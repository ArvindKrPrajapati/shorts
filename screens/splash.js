import React, { Component } from "react";
import { Alert, BackHandler, StyleSheet } from 'react-native'
import { View, Text, Image } from 'react-native';
import Snackbar from 'react-native-snackbar';
const logo = require('../assets/splash.png')
import { Auth } from '../auth'

export default class Splash extends Component {
    constructor(props) {
        super(props)
        Auth()
            .then((isLogIn) => {
                if (isLogIn) {
                    setTimeout(() => {
                        props.navigation.navigate('home');
                    }, 3000)
                } else {
                    setTimeout(() => {
                        props.navigation.navigate('login');
                    }, 3000)
                }
            })
            .catch((err) => {
                console.log("err", err);
                Snackbar.show({
                    text: 'something went wrong',
                    duration: Snackbar.LENGTH_INDEFINITE,
                    action: {
                      text: 'exit',
                      textColor: 'red',
                      onPress: () => {
                        BackHandler.exitApp();
                        return true
                       },
                    },
                  });
            })

    }
    render() {
        return (
            <View style={styles.container}>
                <Image source={logo} style={styles.logo} />
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black'
    },
    logo: {
        height: '25%',
        width: '80%'
    }
})