import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { launchImageLibrary } from 'react-native-image-picker';
import { _getLoggedInUser } from '../../api.service';
const Footer = ({ navigation, progress }) => {
    const selectVideo = async () => {
        launchImageLibrary({ mediaType: 'video', includeBase64: true }, (response) => {
            if (response.assets) {
                navigation.navigate('editVideo', response)
            }
        })
    }

    const changeScreen = (screen) => {
        if (screen == "profile") {
            _getLoggedInUser()
                .then((data) => {
                    navigation.navigate('profile', { id: data._id })
                })
        } else {
            navigation.navigate(screen)
        }
    }
    return (
        <View style={styles.footer}>
            <TouchableOpacity style={styles.iconBox}>
                <Icon name='home' style={[styles.icon, { color: 'silver' }]} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBox} onPress={() => { changeScreen('search') }}>
                <Icon name='search' style={styles.icon} />
            </TouchableOpacity>
            {
                (progress === null)
                    ?
                    <TouchableOpacity style={styles.iconBox} onPress={selectVideo}>
                        <Icon name='add-circle' style={[styles.icon, { fontSize: 35 }]} />
                    </TouchableOpacity>
                    :
                    <View style={styles.iconBox}>
                        <View style={styles.progress}><Text style={{ color: "green", fontSize: 11 }}>{progress === 100 ? '99' : progress}%</Text></View>
                    </View>
            }
            <TouchableOpacity style={styles.iconBox} onPress={() => { changeScreen('notification') }}>
                <Icon name='heart' style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBox} onPress={() => { changeScreen('profile') }}>
                <Icon name='person' style={styles.icon} />
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    footer: {
        width: '100%',
        height: 55,
        backgroundColor: 'black',
        flexDirection: 'row',
    },
    icon: {
        fontSize: 23,
        color: 'grey',
    },
    iconBox: {
        width: '20%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    progress: {
        borderRadius: 50,
        width: 30,
        aspectRatio: 1 / 1,
        borderColor: 'green',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
export default Footer