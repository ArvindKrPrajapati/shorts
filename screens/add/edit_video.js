import React, { useEffect, useState, useRef } from 'react';
import { Text, View, StyleSheet, Dimensions, BackHandler, TouchableOpacity } from 'react-native';
import Video from 'react-native-video'

const { height, width } = Dimensions.get('window')

const EditVideo = ({ navigation, route }) => {
    const videoRef = useRef(null)
    const backAction = () => {
        navigation.goBack(null)
        return true
    }

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, [])

    const onError = () => {

    }
    const onLoad = () => {

    }

    const addDetails = () => {
        // add edited video object or whatever
        const editedVideo = route.params
        navigation.navigate('addDetails', editedVideo)
    }

    return (
        <View style={styles.container}>
            <View style={styles.options}>
                <TouchableOpacity
                    onPress={backAction}
                    style={styles.btn}
                >
                    <Text style={{ color: 'white', fontWeight: "bold", fontSize: 16 }}>cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={addDetails}
                    style={styles.btn}
                >
                    <Text style={{ color: 'white', fontWeight: "bold", fontSize: 16 }}>Done</Text>
                </TouchableOpacity>
            </View>
            <Video
                source={{ uri: route.params.assets[0].uri }}
                ref={videoRef}
                onError={onError}
                resizeMode='contain'
                repeat={true}
                onLoad={onLoad}
                style={styles.video} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        height: height - 110
    },
    video: {
        height: height - 110,
        width: width,
    },
    options: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        width: '100%',
    },
    btn: {
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 5,
        padding: 10,
        zIndex: 2
    }
})

export default EditVideo;