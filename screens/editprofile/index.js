import React, { useState } from "react";
import { Text, SafeAreaView, View, TextInput, Image, TouchableOpacity, ActivityIndicator, StyleSheet, StatusBar } from 'react-native'
import Icon from "react-native-vector-icons/Ionicons"
const dp = require("../../assets/dp.png")
import Snackbar from 'react-native-snackbar';
import { _updateProfile, _updateProfilePicture } from '../../api.service'
import axios from "axios";
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage'


const EditProfile = ({ navigation, route }) => {
    const [data, setData] = useState(route.params.data)
    const [saving, setSaving] = useState(false)
    const [image, setimage] = useState("")
    const [progress, setProgress] = useState(null)
    const [uploading, setUploading] = useState(false)

    const backAction = () => {
        navigation.goBack(null)
    }
    const done = async () => {
        if ((route.params.data.name != data.name) || (route.params.data.desc != data.desc)) {
            if (data.name == '') {
                Snackbar.show({
                    text: "Name should not be empty",
                    duration: Snackbar.LENGTH_LONG
                })
            } else {
                setSaving(true)
                _updateProfile(data.name, data.desc)
                    .then(async(res) => {
                        if (res.success) {
                            setSaving(false)
                            await AsyncStorage.setItem('key', res.data)
                            navigation.navigate('profile', { id: route.params.data._id, data: data })
                        } else {
                            Snackbar.show({
                                text: res.message,
                                duration: Snackbar.LENGTH_LONG
                            })
                        }
                    })
                    .catch((err) => {
                        setSaving(false)
                        Snackbar.show({
                            text: "something went wrong",
                            duration: Snackbar.LENGTH_LONG
                        })
                    })
            }
        } else if ((route.params.data.image != data.image)) {
            navigation.navigate('profile', { id: route.params.data._id, data: data })
        } else {
            navigation.navigate('profile', { id: route.params.data._id })
        }
    }

    const selectImage = async () => {
        ImagePicker.openPicker({
            width: 400,
            height: 400,
            cropping: true
        }).then(image => {
            setimage(image.path);
            uploadImage(image.path)
        });
    }

    const uploadImage = async (path) => {
        const upurl = "https://api.cloudinary.com/v1_1/shivraj-technology/image/upload"
        const fd = new FormData()
        fd.append('file', {
            uri: path,
            name: 'my_dp.jpeg',
            type: 'image/jpeg'
        })
        fd.append("upload_preset", "equals")
        try {
            setUploading(true)
            const res = await axios.post(upurl, fd, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (p) => {
                    let progress = Math.round(100 * p.loaded / p.total);
                    setProgress(progress);

                }
            })
            const saveRes =await  _updateProfilePicture(res.data.secure_url)
            if (saveRes.success) {
                await AsyncStorage.setItem('key', saveRes.data)
                setData({ ...data, image: res.data.secure_url })
                Snackbar.show({
                    text: "Updated Successfully",
                    duration: Snackbar.LENGTH_LONG
                })
            } else {
                Snackbar.show({
                    text: saveRes.message,
                    duration: Snackbar.LENGTH_LONG
                })
            }
            setProgress(null)
            setUploading(false)
        } catch (error) {
            setProgress(null)
            setUploading(false)
            Snackbar.show({
                text: "something went wrong",
                duration: Snackbar.LENGTH_LONG
            })
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar backgroundColor="white" barStyle="dark-content" />
            <View style={styles.header}>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={backAction}>
                        <Icon name='arrow-back' size={23} style={styles.icon} />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Edit Profile</Text>
                </View>
                {
                    saving
                        ?
                        <ActivityIndicator />
                        :
                        <TouchableOpacity disabled={uploading} onPress={done}>
                            <Icon name='checkmark' size={23} style={styles.icon} />
                        </TouchableOpacity>
                }
            </View>
            <View style={styles.container}>
                <TouchableOpacity disabled={uploading} onPress={selectImage} style={[styles.dp, { opacity: uploading ? 0.7 : 1 }]}>
                   {
                    uploading
                    ?
                    <Image source={image ? { uri: image } : dp} style={styles.dp} />
                    :
                   <Image source={data.image ? {uri:data.image} : dp} style={styles.dp}/>
                   }
                </TouchableOpacity>
                <View style={[styles.input, { marginTop: 15 }]}>
                    <Text style={styles.label}>Name</Text>
                    <TextInput
                        style={styles.input}
                        underlineColorAndroid='black'
                        maxLength={30}
                        value={data.name}
                        onChangeText={(e) => { setData({ ...data, name: e }) }}
                    />
                </View>
                <View style={styles.input}>
                    <Text style={styles.label}>About</Text>
                    <TextInput
                        style={[styles.input, { maxHeight: 150 }]}
                        underlineColorAndroid='black'
                        multiline={true}
                        maxLength={50}
                        value={data.desc}
                        onChangeText={(e) => { setData({ ...data, desc: e }) }}
                    />
                </View>

            </View>
            {
                uploading &&
                <View style={styles.footer}>
                    <Text style={{ color: 'white' }}>Uploading {progress == 100 ? "99" : progress} %</Text>
                </View>
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: 'white',
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    headerText: {
        color: 'black',
        marginLeft: 25,
        fontSize: 19,
        fontWeight: 'bold'
    },
    icon: {
        color: 'black'
    },
    container: {
        padding: 15
    },
    dp: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignSelf: 'center'
    },
    label: {
        color: 'black'
    },
    input: {
        padding: 10
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        width: "100%",
        backgroundColor: 'rgb(40,40,40)',
        padding: 15,
    }
})
export default EditProfile