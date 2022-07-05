import React from "react";
import { Image, StyleSheet, View, Text, TouchableOpacity,Dimensions } from 'react-native';
const {width}=Dimensions.get('window')
import Icon from "react-native-vector-icons/Ionicons";
const Single = ({ item }) => {
    return (
        <TouchableOpacity style={styles.card}>
            <Image style={styles.img} source={{ uri: item.poster }} />
            <View style={styles.info}>
                <View style={{ flexDirection: "row", alignItems: 'center' }}>
                    <Icon name="play" style={styles.icon} />
                    <Text style={styles.icon}>{item.views}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: 'center' }}>
                    <Icon name="heart" style={styles.icon} />
                    <Text style={styles.icon}>{item.likes}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: 'center' }}>
                    <Icon name="chatbubble" style={styles.icon} />
                    <Text style={styles.icon}>{item.comments}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    img:{
        width:'100%',
        height:'100%',
        borderRadius: 10,
    },
    card: {
        width: (width/2) - 32,
        aspectRatio:1/1.2,
        margin:10,
        backgroundColor:'gainsboro',
        borderRadius: 10,
    },
    info: {
        backgroundColor: 'rgba(40,40,40,0.2)',
        position: 'absolute',
        flexDirection: 'row',
        width: "100%",
        padding:8,
        justifyContent: 'space-evenly',
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        bottom: 0
    },
    icon: {
        color: 'white',
        fontSize: 15,
        margin: 2
    }
})
export default Single

