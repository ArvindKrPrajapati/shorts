import React, { useState, useEffect } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity, StatusBar, TextInput } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons"
import { createThumbnail } from "react-native-create-thumbnail";

const AddDetails = ({ navigation, route }) => {
    const [poster, setPoster] = useState("")
    var desc = ""

    useEffect(() => {
        createPoster()
    }, [])

    const createPoster = () => {
        const url = route.params.assets[0].uri
        createThumbnail({
            url: url,
            timeStamp: 500
        })
            .then((res) => {
                setPoster(res.path)
            })
            .catch((err) => {
                setPoster("")
            })
    }

    const backAction = () => {
        navigation.goBack(null)
    }

    const changeDesc = (e) => {
        desc = e
    }

    const done = () => {
        const data = { uri: route.params.assets[0].uri,poster, desc }
        navigation.navigate('home', data)
    }
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='rgb(40,40,40)' />
            <View style={styles.header}>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        onPress={backAction}
                    >
                        <Icon name='arrow-back' size={23} style={styles.icon} />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Describe Your Short</Text>
                </View>
                <TouchableOpacity
                    onPress={done}
                >
                    <Icon name='checkmark' size={23} style={styles.icon} />
                </TouchableOpacity>
            </View>
            <View style={styles.main}>
                {
                    poster ?
                        <Image source={{ uri: poster }} style={styles.video} />
                        :
                        <View style={styles.video}></View>
                }
                <TextInput
                    style={styles.descInput}
                    onChangeText={changeDesc}
                    placeholder="Description"
                    placeholderTextColor='silver'
                    maxLength={80}
                    multiline={true}
                    underlineColorAndroid="silver"
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    header: {
        backgroundColor: 'rgb(40,40,40)',
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    headerText: {
        color: 'white',
        marginLeft: 25,
        fontSize: 19,
        fontWeight: 'bold'
    },
    icon: {
        color: 'white'
    },
    main: {
        padding: 15,
        justifyContent: 'center'
    },
    descInput: {
        maxHeight: 100,
        color: 'white',
        padding: 15,
        fontSize: 16,
        marginTop: 25
    },
    video: {
        position: "relative",
        top: 10,
        height: 150,
        width: 100,
        borderRadius: 10,
        alignSelf: 'center'

    },
})
export default AddDetails;