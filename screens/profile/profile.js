import React, { Component } from 'react';
import { Text, BackHandler, TouchableOpacity, FlatList, StatusBar, Image, View, StyleSheet, SafeAreaView } from 'react-native'
import { _getUser, _getMyPost, _getLoggedInUser, _follow } from "../../api.service"
const dp = require("../../assets/dp.png")
import Snackbar from 'react-native-snackbar';
import Icon from "react-native-vector-icons/Ionicons"
import Single from './single';
var skip = 0
export default class Profile extends Component {
    constructor(props) {
        super(props)
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.profileComponent = this.profileComponent.bind(this);
        this.getMyPost = this.getMyPost.bind(this);
        this.renderPost = this.renderPost.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
        this.getUserInfo = this.getUserInfo.bind(this);
        this.loadMore = this.loadMore.bind(this);
        this.follow = this.follow.bind(this);
        this.state = {
            loading: true,
            data: null,
            postData: [],
            postLoading: true,
            refreshing: false,
            dataEnd: false,
            myid: null
        }
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        this.setState({ postData: [] })
        skip = 0
        this.getUserInfo()
        this.getMyPost()
        _getLoggedInUser()
            .then((data) => {
                this.setState({ myid: data._id })
            })

    }
    componentDidUpdate(prevProps, prevState) {
        const d = this.props.route.params.data;
        if (prevProps.route.params.data !== d) {
            if (d) {
                this.setState({ data: d });
            }
        }


    }

    getUserInfo() {
        const id = this.props.route.params.id
        _getUser(id)
            .then((data) => {
                if (data.success) {
                    this.setState({ loading: false, data: data.data })
                } else {
                    this.setState({ loading: false })
                    Snackbar.show({
                        text: data.message,
                        duration: Snackbar.LENGTH_LONG
                    })
                }
            })
            .catch((error) => {
                this.setState({ loading: false })
                Snackbar.show({
                    text: "something went wrong",
                    duration: Snackbar.LENGTH_LONG
                })
            })
    }

    getMyPost() {
        const id = this.props.route.params.id
        _getMyPost(id, skip)
            .then((d) => {
                if (d.success) {
                    if (d.data.length === 0) {
                        this.setState({ dataEnd: true, postLoading: false, refreshing: false })
                    } else {
                        if (this.state.refreshing) {
                            this.setState({ postLoading: false, refreshing: false, postData: d.data })
                        } else {
                            this.setState({ postLoading: false, refreshing: false, postData: [...this.state.postData, ...d.data] })
                        }
                    }
                } else {
                    this.setState({ postLoading: false, refreshing: false })
                    Snackbar.show({
                        text: d.message,
                        duration: Snackbar.LENGTH_LONG
                    })
                }
            })
            .catch((err) => {
                this.setState({ postLoading: false, refreshing: false })
                Snackbar.show({
                    text: "something went wrong",
                    duration: Snackbar.LENGTH_LONG
                })
            })
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        this.props.navigation.goBack(null);
        return true;
    }

    follow(action) {
        const _id = this.state.data ? this.state.data._id : ''
        const prev = this.state.data.ifollow
        let prevFollowers = this.state.data.followers
        if (_id != '' && action === "follow") {
            this.setState({ data: { ...this.state.data, ifollow: true, followers: prevFollowers + 1 } })
        } else if (_id != '' && action === "unfollow") {
            this.setState({ data: { ...this.state.data, ifollow: false, followers: prevFollowers - 1 } })
        }
        _follow(_id, action)
            .then((data) => {
                if (!data.success) {
                    this.setState({ data: { ...this.state.data, ifollow: prev, followers: prevFollowers } })
                    Snackbar.show({
                        text: data.message,
                        duration: Snackbar.LENGTH_LONG
                    })
                }
            })
            .catch((err) => {
                this.setState({ data: { ...this.state.data, ifollow: prev, followers: prevFollowers } })
                Snackbar.show({
                    text: "something went wrong",
                    duration: Snackbar.LENGTH_LONG
                })
            })
    }

    profileComponent() {
        return (
            <View style={styles.container}>
                <Image source={this.state.data.image ? { uri: this.state.data.image } : dp} style={styles.dp} />
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                    <Text style={styles.name}>{this.state.data ? this.state.data.name : "undefined"}</Text>
                    {
                        this.state.data.isVarified &&
                        <Icon style={{ marginLeft: 5 }} name="checkmark-circle" size={20} color="dodgerblue" />
                    }
                </View>
                <Text style={styles.desc}>{this.state.data ? this.state.data.desc : "undefined"} </Text>
                {
                    this.state.myid == this.props.route.params.id
                        ?
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('editProfile', { data: this.state.data }) }} style={[styles.btn, { borderColor: 'silver', borderWidth: 1 }]}>
                            <Text color='black'>Edit Profile</Text>
                            <Icon name='create' size={15} />
                        </TouchableOpacity>
                        :
                        (this.state.data && this.state.data.ifollow)
                            ?
                            <TouchableOpacity onPress={() => { this.follow("unfollow") }} style={[styles.btn, { backgroundColor: 'dodgerblue' }]}>
                                <Text style={{ color: 'white' }}>unfollow</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => { this.follow("follow") }} style={[styles.btn, { backgroundColor: 'dodgerblue' }]}>
                                <Text style={{ color: 'white' }}>Follow</Text>
                                <Icon name='person-add' size={15} color='white' />
                            </TouchableOpacity>

                }
                <View style={[styles.info, styles.infoContainer]}>
                    <View style={styles.info}>
                        <Text style={{ fontWeight: '500' }}>{this.state.data ? this.state.data.shorts : 0}</Text>
                        <Text style={{ fontWeight: '500' }}>shorts</Text>
                    </View>
                    <View style={styles.info}>
                        <Text style={{ fontWeight: '500' }}>{this.state.data ? this.state.data.followers : 0}</Text>
                        <Text style={{ fontWeight: '500' }}>Follower</Text>
                    </View>
                    <View style={styles.info}>
                        <Text style={{ fontWeight: '500' }}>{this.state.data ? this.state.data.followings : 0}</Text>
                        <Text style={{ fontWeight: '500' }}>Following</Text>
                    </View>
                </View>
            </View>
        )
    }

    renderPost({ item }) {
        return (
            <Single item={item} />
        )
    }

    onRefresh() {
        this.setState({ refreshing: true, dataEnd: false })
        skip = 0
        this.getUserInfo()
        this.getMyPost()
    }

    loadMore() {
        if (!this.state.dataEnd) {
            this.setState({ postLoading: true })
            skip = skip + 8
            this.getMyPost()
        }
    }

    render() {

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar backgroundColor="white" barStyle="dark-content" />
                <View style={styles.header}>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                            onPress={this.handleBackButtonClick}
                        >
                            <Icon name='arrow-back' size={24} color="black" />
                        </TouchableOpacity>
                        <Text style={styles.headerText}>Profile</Text>
                    </View>
                </View>
                {
                    this.state.refreshing
                    &&
                    <Text style={{ textAlign: 'center', margin: 10 }}>refreshing....</Text>
                }
                {
                    this.state.loading
                        ?
                        <View style={{ flex: 1, justifyContent: "center", alignItems: 'center', backgroundColor: 'white' }}>
                            <Text style={{ fontSize: 17 }}>Loading.....</Text>
                        </View>
                        :
                        <View style={{ paddingLeft: 14, paddingRight: 14, marginBottom: 40 }}>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                ListHeaderComponent={this.profileComponent}
                                ListFooterComponent={this.state.postLoading ? <Text style={{ textAlign: 'center', margin: 25 }}>Loading...</Text> : <Text></Text>}
                                data={this.state.postData}
                                onRefresh={this.onRefresh}
                                refreshing={this.state.refreshing}
                                numColumns={2}
                                renderItem={this.renderPost}
                                onEndReached={this.loadMore}
                            />
                        </View>
                }

            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: 'white',
        padding: 15
    },
    headerText: {
        fontSize: 19,
        fontWeight: '500',
        marginLeft: 20,
        color: 'black'
    },
    container: {
        alignItems: 'center',
        padding: 10
    },
    dp: {
        width: 140,
        height: 140,
        borderRadius: 70,
        marginTop: 15
    },
    name: {
        fontSize: 23,
        fontWeight: 'bold',
        marginTop: 10
    },
    info: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoContainer: {
        flexDirection: 'row',
        width: "100%",
        justifyContent: 'space-evenly'
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        width: 110,
        justifyContent: 'space-around',
        borderRadius: 5
    },
    desc: {
        margin: 10
    }
})