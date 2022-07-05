import React, { useState, useEffect, useRef } from 'react';
import { Text, SafeAreaView, View, StyleSheet, FlatList, RefreshControl, Modal, Dimensions, BackHandler } from 'react-native'
import axios from "axios";
import { _uploadPost, _getPosts, _getLoggedInUser, _react } from '../../api.service';
import Comments from './comments';
import Footer from './footer';
import Single from './single';
const { height, width } = Dimensions.get('window')

var skip = 0;
var limit = 10;
const Home = ({ navigation, route }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [dataEnd, setDataEnd] = useState(false)
    const [progress, setProgress] = useState(null)
    const [mute, setMute] = useState(false)
    const [snackbar, setSnackbar] = useState({ state: false, message: "", textColor: 'white' })
    const [modalVisible, setModalVisible] = useState({ shown: false, _id: "" })
    const [refreshing, setRefreshing] = useState(false)

    const mediaRefs = useRef([])

    const onViewableItemsChanged = useRef(({ changed }) => {
        changed.forEach(element => {
            const cell = mediaRefs.current[element.key]
            if (cell) {
                if (element.isViewable) {
                    cell.play()
                } else {
                    cell.pause()
                }
            }
        });
    })

    const onRefresh = async () => {
        skip = 0
        _getPosts(skip)
            .then((res) => {
                setData(res.data)
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const fetchData = () => {
        _getPosts(skip)
            .then((res) => {
                if (res.data.length < limit) {
                    setDataEnd(true)
                }
                setLoading(false)
                setData([...data, ...res.data])
            })
            .catch((err) => {
                console.log(err);
            })
    }


    const onEndReached = () => {
        if (!dataEnd) {
            skip = skip + limit
            fetchData()
        }
    }

    const backAction = () => {
        BackHandler.exitApp()
        return true
    }




    const postVideo = async () => {
        const { params } = route
        if (params !== undefined) {
            const videourl = "https://api.cloudinary.com/v1_1/shivraj-technology/video/upload"
            const posterurl = "https://api.cloudinary.com/v1_1/shivraj-technology/image/upload"
            const uri = params.uri;
            const poster = params.poster
            const fd = new FormData()
            fd.append('file', {
                uri: poster,
                name: 'my_photo.jpeg',
                type: 'image/jpeg'
            })
            fd.append("upload_preset", "equals")

            try {
                const posterRes = await axios.post(posterurl, fd, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    onUploadProgress: (p) => {
                        let progress = Math.round((100 * p.loaded / p.total) / 2);
                        setProgress(progress);
                    }
                })

                fd.append('file', {
                    uri: uri,
                    name: 'name.mp4',
                    type: 'video/mp4'
                })

                const videoRes = await axios.post(videourl, fd, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    onUploadProgress: (p) => {
                        let prog = Math.round((100 * p.loaded / p.total) / 2);
                        setProgress(50 + prog);
                    }
                })

                const uploadRes = await _uploadPost(posterRes.data.secure_url, videoRes.data.secure_url, params.desc)
                if (uploadRes.success) {
                    setProgress(null)
                    showSnackbar("Your short is posted successfully", "white")
                } else {
                    setProgress(null)
                    showSnackbar(uploadRes.message, "red")
                }
            } catch (error) {
                console.warn(error);
                setProgress(null)
                showSnackbar("something went wromg", "red")
            }
        }

    }

    const showSnackbar = (message, textColor) => {
        setSnackbar({
            state: true,
            message: message,
            textColor: textColor
        })
        setTimeout(() => {
            setSnackbar({ state: false, message: "" })
        }, 3500);
    }

    useEffect(() => {
        skip = 0
        fetchData()
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, [])

    useEffect(() => {
        postVideo()
    }, [route.params])






    const muteAudio = () => {
        if (mute) {
            setMute(false)
        } else {
            setMute(true)
        }

    }



    const renderItem = ({ item, index }) => {
        return (
            <Single
                navigation={navigation}
                item={item}
                index={index}
                muteAudio={muteAudio}
                mute={mute}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                ref={SingleRef => (mediaRefs.current[item._id] = SingleRef)}
            />
        )
    }


    return (
        <SafeAreaView style={{ backgroundColor: 'black', justifyContent: 'space-between' }}>
            {
                snackbar.state
                &&
                <View style={styles.snackbar}><Text style={{ color: snackbar.textColor }}>{snackbar.message}</Text></View>
            }
            <View style={{ height: height - 55 }}>
                {
                    loading
                        ?
                        <View style={[styles.controls, { backgroundColor: 'silver', height: height - 55 }]}>
                            <Text style={[styles.brand, { margin: 10 }]}>shorts</Text>

                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                                <Text>loading......</Text>
                            </View>

                            <View style={[styles.bottom, { marginBottom: -40 }]}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={styles.profileImg}></View>
                                    <View style={styles.skeleton}></View>
                                </View>
                                <View style={[styles.skeleton, { width: 135 }]}></View>
                            </View>
                        </View>
                        :
                        (data.length > 0)
                            ?

                            <FlatList
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={onRefresh}
                                    />
                                }
                                onEndReached={onEndReached}
                                data={data}
                                pagingEnabled={true}
                                renderItem={renderItem}
                                keyExtractor={item => item._id}
                                decelerationRate={'fast'}
                                windowSize={5}
                                initialNumToRender={0}
                                removeClippedSubviews
                                onViewableItemsChanged={onViewableItemsChanged.current}
                                viewabilityConfig={{
                                    itemVisiblePercentThreshold: 100
                                }}
                                ListFooterComponent={() => {
                                    if (!dataEnd) {
                                        return (
                                            <View style={[styles.controls, { backgroundColor: 'silver', height: height - 55 }]}>
                                                <Text style={[styles.brand, { margin: 10 }]}>shorts</Text>

                                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                                                    <Text>loading......</Text>
                                                </View>

                                                <View style={[styles.bottom, { marginBottom: -40 }]}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <View style={styles.profileImg}></View>
                                                        <View style={styles.skeleton}></View>
                                                    </View>
                                                    <View style={[styles.skeleton, { width: 135 }]}></View>
                                                </View>
                                            </View>
                                        )
                                    }
                                    return null
                                }}
                            />
                            :
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: '#eee' }}>No shorts to show</Text>
                            </View>

                }


            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible.shown}
                onRequestClose={() => {
                    setModalVisible({ shown: !modalVisible.shown, _id: "" });
                }}
            >
                <Comments closeComment={setModalVisible} _id={modalVisible._id} navigation={navigation} />
            </Modal>
            <Footer progress={progress} navigation={navigation} />
        </SafeAreaView >
    )
}


const styles = StyleSheet.create({
    bottom: {
        padding: 15,
        position: 'absolute',
        bottom: 35
    },
    brand: {
        color: '#eee',
        fontSize: 22,
        fontWeight: 'bold',
    },
    profileImg: {
        width: 35,
        height: 35,
        borderRadius: 50,
        backgroundColor: '#eee',
    },
    skeleton: {
        backgroundColor: '#eee',
        padding: 7,
        width: 100,
        margin: 8
    },
    progress: {
        borderRadius: 50,
        width: 30,
        aspectRatio: 1 / 1,
        borderColor: 'green',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    snackbar: {
        backgroundColor: "rgb(40,40,40)",
        width: width,
        padding: 20,
        position: 'absolute',
        top: 0,
        zIndex: 3,
        justifyContent: 'center'
    }

});


export default Home;