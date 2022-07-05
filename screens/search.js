import React, { Component } from 'react'
import { View, Text, Image, TextInput, BackHandler, FlatList, SafeAreaView, Dimensions, StatusBar, StyleSheet, TouchableOpacity } from 'react-native'
import Icon from "react-native-vector-icons/Ionicons"
import { _searchUser, _getLoggedInUser } from "../api.service"

const { width } = Dimensions.get("window")
const dp = require("../assets/dp.png")
var myid = ""
export default class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            data: []
        }
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        _getLoggedInUser()
            .then((res) => {
                myid = res._id
            })
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        this.props.navigation.goBack(null);
        return true;
    }

    onChangeText(e) {
        this.setState({ loading: true })
        _searchUser(e)
            .then((data) => {
                if (data.success) {
                    this.setState({ loading: false, data: data.data })
                }
            })
    }

    renderItem({ item }) {
        if (item._id == myid) {
            return null
        }
        return (
            <TouchableOpacity style={styles.card} onPress={() => { this.props.navigation.navigate("profile", { id: item._id }) }}>
                <Image source={item.image ? { uri: item.image } : dp} style={styles.dp} />
                <Text>{item.name}</Text>
                {
                    item.isVarified &&
                    <Icon style={{ marginLeft: 5 }} name="checkmark-circle" size={20} color="dodgerblue" />
                }
            </TouchableOpacity>
        )
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar backgroundColor="white" barStyle="dark-content" />
                <View style={styles.header}>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                            style={{ justifyContent: 'center' }}
                            onPress={this.handleBackButtonClick}
                        >
                            <Icon name='arrow-back' size={24} color="black" />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.input}
                            returnKeyType="search"
                            onChangeText={this.onChangeText}
                            placeholder="search user"
                            maxLength={20}
                            underlineColorAndroid="transparent"
                        />
                    </View>
                </View>
                {
                    this.state.loading
                    &&
                    <Text style={{ margin: 15, textAlign: 'center' }}>loading....</Text>
                }
                <FlatList
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    data={this.state.data}
                    renderItem={this.renderItem}
                />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: 'white',
        padding: 15,
        justifyContent: 'center',
    },
    input: {
        marginLeft: 10,
        borderColor: 'silver',
        borderWidth: 1,
        borderRadius: 7,
        padding: 0,
        paddingLeft: 15,
        paddingRight: 15,
        width: width - 65,
        fontSize: 12,
        height: 36
    },
    card: {
        flexDirection: 'row',
        width: width,
        alignItems: 'center',
        padding: 15,
    },
    dp: {
        width: 40,
        height: 40,
        borderRadius: 50,
        marginRight: 20
    }
})