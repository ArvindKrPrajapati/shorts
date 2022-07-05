import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Button, BackHandler, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Snackbar from 'react-native-snackbar';

import { _sendOtp, _varifyOtp } from '../api.service'

export default class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mobile: 0,
            isValid: false,
            btnText: 'send otp',
            otp: null,
            sentOtp: false
        }
        this.onChangeText = this.onChangeText.bind(this)
        this.sendOtp = this.sendOtp.bind(this)
        this.onChangeOtp = this.onChangeOtp.bind(this)
        this.varifyOtp = this.varifyOtp.bind(this)
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        BackHandler.exitApp()
        return true;
    }

    onChangeText(e) {
        this.setState({ mobile: e })
        if (e.length === 10) {
            this.setState({ isValid: true })
        } else {
            this.setState({ isValid: false })
        }
    }

    onChangeOtp(e) {
        this.setState({ otp: e })
        if (e.length === 6) {
            this.setState({ isValid: true })
        } else {
            this.setState({ isValid: false })
        }
    }

    sendOtp(e) {
        this.setState({ isValid: false, btnText: "sending...." })
        _sendOtp(this.state.mobile)
            .then((data) => {
                if (data.success) {
                    Snackbar.show({
                        text: 'OTP sent',
                        duration: Snackbar.LENGTH_LONG,
                    });
                    this.setState({ sentOtp: true, btnText: 'varify' })
                }
                else {
                    Snackbar.show({
                        text: data.message,
                        duration: Snackbar.LENGTH_INDEFINITE,
                        action: {
                            text: 'got it',
                            textColor: 'red',
                            onPress: () => {
                                this.setState({ isValid: true, btnText: "send" })
                                Snackbar.dismiss()
                            },
                        },
                    });
                }
            })
            .catch((err) => {
                this.setState({ isValid: true, btnText: "send" })
                Snackbar.show({
                    text: 'something went wrong ,Try Again',
                    duration: Snackbar.LENGTH_LONG,
                });
            })
    }



    varifyOtp() {
        this.setState({ isValid: false, btnText: 'varifying....' })
        _varifyOtp(this.state.mobile, this.state.otp)
            .then(async (data) => {
                if (data.success) {
                    console.log(data.data);
                    try {
                        await AsyncStorage.setItem('key', data.data)
                        await this.props.navigation.navigate('home')
                    } catch (error) {
                        console.log("async error", error);
                    }
                } else {
                    Snackbar.show({
                        text: data.message,
                        duration: Snackbar.LENGTH_INDEFINITE,
                        action: {
                            text: 'got it',
                            textColor: 'red',
                            onPress: () => {
                                this.setState({ isValid: true, btnText: 'varify' })
                                Snackbar.dismiss()
                            },
                        },
                    });
                }
            })
            .catch((err) => {
                this.setState({ isValid: true, btnText: 'varify' })
                Snackbar.show({
                    text: 'server error -fetch- ,Try Again',
                    duration: Snackbar.LENGTH_LONG,
                });
            })
    }


    render() {
        if (!this.state.sentOtp) {
            return (
                <View style={styles.container}>
                    <Text style={styles.title}>login</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={this.onChangeText}
                        placeholder="Mobile Number"
                        placeholderTextColor='#fff'
                        maxLength={10}
                        keyboardType='numeric'
                        underlineColorAndroid="#eee"
                    />
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={this.sendOtp}
                        disabled={!this.state.isValid}
                    >
                        <Text style={[styles.btnText, { color: this.state.isValid ? '#eee' : 'silver' }]}>{this.state.btnText}</Text>
                    </TouchableOpacity>
                </View>
            )
        }

        return (
            <View style={styles.container}>
                <Text style={styles.title}>Varify otp</Text>
                <Text style={{color:'#eee'}}>OTP sent to +91 {this.state.mobile}</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={this.onChangeOtp}
                    placeholder="Enter 6-digit OTP"
                    placeholderTextColor='#fff'
                    maxLength={6}
                    keyboardType='numeric'
                    underlineColorAndroid='#eee'
                />
                 <TouchableOpacity
                        style={styles.btn}
                        onPress={this.varifyOtp}
                        disabled={!this.state.isValid}
                    >
                        <Text style={[styles.btnText, { color: this.state.isValid ? '#eee' : 'silver' }]}>{this.state.btnText}</Text>
                    </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        padding: 40
    },
    title: {
        color: "#eee",
        textTransform: 'uppercase',
        fontSize: 25,
        fontWeight: 'bold',
        marginTop: 10
    },
    input: {
        marginTop: 20,
        marginBottom: 10,
        padding: 15,
        fontSize: 15,
        color: 'white',
    },
    btn: {
        backgroundColor: 'rgb(60,60,60)',
        padding: 8,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnText: {
        color: '#eee',
        fontWeight: 'bold',
        textTransform: 'uppercase'
    }

})