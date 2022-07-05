import React, { useState, useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text, Dimensions, TouchableWithoutFeedback } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons'
import Video from 'react-native-video';
const dp = require("../../assets/dp.png")
import { _react } from '../../api.service';

var clickCount = 0;

const { width, height } = Dimensions.get("window")
const Single = forwardRef((props, ref) => {
    const { navigation, item, index, mute, muteAudio, modalVisible, setModalVisible } = props
    useImperativeHandle(ref, () => ({
        play, pause, unload
    }))

    useEffect(() => {
        return () => unload()
    }, [])

    const [singleItem, setSingleItem] = useState(item)
    const [liked, setLiked] = useState(false)
    const videoRef = useRef(null)
    const play = () => {
        if (videoRef.current == null) {
            return;
        }
        if (videoRef.current.props.paused) {
            videoRef.current.setNativeProps({ paused: false })
        }
    }

    const pause = () => {
        if (videoRef.current == null) {
            return;
        }
        if (!videoRef.current.props.paused) {
            videoRef.current.setNativeProps({ paused: true })
        }
    }

    const unload = () => {
        if (videoRef.current == null) {
            return;
        }
        console.log("unloaded");
    }
    const doubleClick = async (_id) => {
        clickCount++;
        if (clickCount == 2) {
            clickCount = 0
            await setLiked(true)
            setTimeout(() => {
                setLiked(false)
            }, 200)
            if (!singleItem.isLiked) {
                setSingleItem({ ...singleItem, isLiked: true, likes: singleItem.likes + 1 })
                _react(_id, true)
            }
        }
    }
    const react = (_id) => {
        if (singleItem.isLiked) {
            setSingleItem({ ...singleItem, isLiked: false, likes: singleItem.likes - 1 })
            _react(_id, false)
        } else {
            setSingleItem({ ...singleItem, isLiked: true, likes: singleItem.likes + 1 })
            _react(_id, true)
        }
    }

    return (
        <TouchableWithoutFeedback onPressIn={() => { videoRef.current.setNativeProps({ paused: true }) }} onPressOut={play} onPress={() => { doubleClick(item._id) }} >
            <View style={{ height: height - 55 }} >
                <LinearGradient style={styles.controls} colors={['rgba(0,0,0,0.16)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.16)']}>
                    {
                        modalVisible.shown ||
                        <View style={styles.top} >
                            <Text style={styles.brand}>{index === 0 && 'shorts'}</Text>
                            <Icon name='camera' style={[styles.icon, { color: 'white' }]} />
                        </View>
                    }
                    {
                        mute
                        &&
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: "center" }}>
                            <Icon name='volume-mute' size={50} />
                        </View>

                    }

                    {
                        liked
                        &&
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: "center" }}>
                            <Icon name='heart' size={70} style={{ color: 'red' }} />
                        </View>

                    }
                    <View style={styles.option}>
                        <View>
                            <View>
                                <TouchableOpacity style={[styles.circle, { marginBottom: 0 }]} onPress={() => { react(item._id) }}>
                                    <Icon name={singleItem.isLiked ? 'heart' : 'heart-outline'} style={singleItem.isLiked ? { color: 'red' } : styles.white} size={30} />
                                </TouchableOpacity>
                                <Text style={[styles.white, { textAlign: 'center' }]}>{singleItem.likes}</Text>
                            </View>

                            <View>
                                <TouchableOpacity style={[styles.circle, { marginBottom: 0 }]} onPress={() => { setModalVisible({ shown: true, _id: item._id }) }}>
                                    <Icon name='chatbubble-outline' style={styles.white} size={25} />
                                </TouchableOpacity>
                                <Text style={[styles.white, { textAlign: 'center' }]}>{item.comments}</Text>
                            </View>

                            <TouchableOpacity style={styles.circle}>
                                <Icon name='share-social-outline' style={styles.white} size={25} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={muteAudio} style={styles.circle}>
                                {
                                    mute
                                        ?
                                        <Icon name='volume-mute' style={styles.white} size={25} />
                                        :
                                        <Icon name='volume-high' style={styles.white} size={25} />
                                }
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.circle}>
                                <Icon name='ellipsis-vertical-outline' style={styles.white} size={20} />
                            </TouchableOpacity>

                        </View>
                    </View>

                    <View style={styles.bottom}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => { navigation.navigate('profile', { id: item.postedby._id }) }} >
                                <Image
                                    style={styles.profileImg}
                                    source={item.postedby.image ? { uri: item.postedby.image } : dp}
                                />
                            </TouchableOpacity>
                            <Text style={[styles.name, styles.white]}>{item.postedby.name}</Text>
                            {
                                item.postedby.isVarified &&
                                <Icon style={{ marginLeft: 5 }} name="checkmark-circle" size={20} color="dodgerblue" />
                            }
                        </View>
                        <Text numberOfLines={2} style={[styles.desc, styles.white]}>{item.desc}</Text>
                    </View>
                </LinearGradient>
                <Video
                    source={{ uri: item.url }}
                    resizeMode="cover"
                    poster={item.poster}
                    posterResizeMode="cover"
                    paused={true}
                    ref={videoRef}
                    repeat={true}
                    muted={mute}
                    style={modalVisible.shown ? styles.smallVideo : styles.backgroundVideo}
                />
            </View>
        </TouchableWithoutFeedback>
    )
})
const styles = StyleSheet.create({
    backgroundVideo: {
        height: height - 55,
        borderColor: 'grey',
        borderBottomWidth: 1,
        width: width
    },
    smallVideo: {
        height: 230,
        width: 130,
        alignSelf: 'center',
        borderRadius: 10
    },
    icon: {
        fontSize: 23,
        color: 'grey',

    },
    controls: {
        flex: 1,
        position: 'absolute',
        padding: 15,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: height - 55,
        zIndex: 2,
    },
    top: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10
    },
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
    name: {
        marginLeft: 8,
        fontSize: 16
    },
    desc: {
        marginTop: 8
    },
    option: {
        position: 'absolute',
        bottom: 90,
        right: 10
    },
    white: {
        color: "#eee"
    },
    circle: {
        alignItems: "center",
        justifyContent: 'center',
        marginBottom: 8,
        padding: 10,
        borderRadius: 50
    },
});

export default Single