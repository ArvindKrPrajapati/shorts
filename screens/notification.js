import React, { Component } from 'react'
import {View , Text,BackHandler} from 'react-native'
export default class Notification extends Component {
    constructor(props) {
        super(props)
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        this.props.navigation.goBack(null);
        return true;
    }
    render() {
        return (
            <View style={{flex:1,justifyContent:'center',backgroundColor:'black',alignItems:'center'}}>
                <Text style={{color:'gainsboro'}}>No Notification</Text>
            </View>
        )
    }
}