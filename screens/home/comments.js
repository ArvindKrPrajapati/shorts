import React, {Component } from "react";
import { Text, View, Image, StyleSheet, Dimensions, TouchableOpacity, TextInput, FlatList } from "react-native"
import Icon from "react-native-vector-icons/Ionicons";
const { height, width } = Dimensions.get("window")
import { _getComments,_getLoggedInUser,_saveComment } from "../../api.service"
const dp = require('../../assets/dp.png')
var skip = 0

export default class Comments extends Component {
        constructor(props) {
            super(props)
            this.state = {
                data: [],
                loading: true,
                dataEnded:false,
                comment:null,
                refreshing:false
            }
            this.fetchData = this.fetchData.bind(this)
            this.loadMore = this.loadMore.bind(this)
            this.saveComment = this.saveComment.bind(this)
            this.onRefresh = this.onRefresh.bind(this)
            this.renderItem = this.renderItem.bind(this)
        }
        componentDidMount() {
            skip = 0
            this.fetchData()
        }
      
        onRefresh(){
           this.setState({refreshing:true})
           skip=0
           _getComments(this.props._id, skip)
                .then((res) => {
                    if (res.success) {
                        if(res.data.length===0){
                            this.setState({dataEnded:true,refreshing:false})
                        }else{
                            this.setState({loading:false,data:res.data,refreshing:false})
                        }
                    } else {
                        // whwn error occurs
                    }
                })
        }

        fetchData() {
            _getComments(this.props._id, skip)
                .then((res) => {
                    if (res.success) {
                        if(res.data.length===0){
                            this.setState({dataEnded:true,loading:false})
                        }else{
                            this.setState({loading:false,data:[...this.state.data,...res.data]})
                        }
                    } else {
                        // whwn error occurs
                    }
                })
        }
  

        

        renderItem({ item }) {
            const goToProfile=()=>{
                this.props.closeComment({ shown: false, _id: "" })
                this.props.navigation.navigate('profile',{id:item.by._id})
            }
            return (
                <View style={styles.singleComment}>
                    <TouchableOpacity onPress={goToProfile}>
                    <Image source={item.by.image ? {uri : item.by.image} : dp} style={styles.dp} />
                    </TouchableOpacity>
                    <View style={{ marginLeft: 15, width: width - 80 }}>
                        <View style={{flexDirection:'row'}}>
                            <Text style={styles.name}>{item.by.name}</Text>
                            {
                                item.by.isVarified &&
                               <Icon style={{ marginLeft: 5 }} name="checkmark-circle" size={15} color="dodgerblue" />
                            }
                        </View>
                        <Text style={styles.comm}>{item.comments.comm}</Text>
                    </View>
                </View>
            )
        }
    
        loadMore() {
            if(!this.state.dataEnded){
                skip = skip + 20;
                this.fetchData()    
            }
        }
    
        saveComment(){
            const comm=this.state.comment
            _getLoggedInUser()
             .then((user)=>{
                const newComment={
                    by:{ 
                        _id:user._id,
                        name:user.name,
                        image:user.image,
                        isVarified:user.isVarified
                    },
                    comments:{
                        _id:"",
                        comm
                    }
                }
                this.setState({data:[newComment,...this.state.data],comment:null})
                _saveComment(this.props._id,comm)
             })
        }

        render() {
            return (
                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <View style={{ height: 250 }}></View>
                    <View style={styles.modal}>
                        <View style={styles.header}>
                            <TouchableOpacity
                                onPress={() => { this.props.closeComment({ shown: false, _id: "" }) }}
                            >
                                <Icon name="close" size={24} style={{ color: '#eee' }} />
                            </TouchableOpacity>
                            <Text style={styles.headerText}>Comments</Text>
                        </View>
                        {
                            this.state.loading
                                ?
                                <View style={{ flex: 1, marginBottom: 120, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: '#eee' }}>Loading....</Text></View>
                                :
                                 (this.state.data.length==0)
                                 ?
                                 <View style={{ flex: 1, marginBottom: 120, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: '#eee' }}>No Comments</Text></View>
                                 :
                                 <View style={{ marginBottom: 115 ,justifyContent:'space-between'}}>
                                 <FlatList
                                     data={this.state.data}
                                     renderItem={this.renderItem}
                                     onEndReached={this.loadMore}
                                     onRefresh={this.onRefresh}
                                     refreshing={this.state.refreshing}
                                     ListFooterComponent={
                                       !this.state.dataEnded ? <Text style={{color:'#eee',textAlign:"center",margin:10}}>loading....</Text> : <Text></Text>
                                     }
                                     ListHeaderComponent={
                                        this.state.refreshing ? <Text style={{color:'#eee',textAlign:"center",margin:10}}>Refreshing....</Text> : <Text></Text>
                                      }
                                 />
                             </View>
                        }
                    </View>
                    <View style={styles.footer}>
                        <TextInput
                            style={styles.input}
                            onChangeText={(e)=>{this.setState({comment:e})}}
                            value={this.state.comment}
                            placeholder="Add Comment"
                            placeholderTextColor='silver'
                            multiline={true}
                            underlineColorAndroid="transparent"
                        />
                        <TouchableOpacity 
                           onPress={this.saveComment}
                           disabled={(this.state.comment==null) ? true : false} 
                        >
                            <Icon name="send" size={22} style={{ color: '#eee' }} />
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
    }






const styles = StyleSheet.create({
    modal: {
        backgroundColor: 'rgb(30,30,30)',
        height: height - 250,
        borderTopColor: 'rgb(30,30,30)',
        borderWidth: 2,
    },
    header: {
        backgroundColor: 'black',
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerText: {
        color: '#eee',
        marginLeft: 20,
        fontSize: 18
    },
    footer: {
        backgroundColor: 'black',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        position: 'absolute',
        bottom: 0,
        width: width
    },
    input: {
        width: width - 50,
        color:'white'
    },
    singleComment: {
        padding: 10,
        flexDirection: 'row',
    },
    dp: {
        width: 40,
        height: 40,
        borderRadius: 50
    },
    name: {
        color: '#eee',
        fontWeight: 'bold'
    },
    comm: {
        color: '#eee'
    }
})
    //const Comment = (props) => {
    //     const [loading, setLoading] = useState(true)
    //     const [data, setData] = useState([])
    
    //     const fetchData = () => {
    //         _getComments(props._id, skip)
    //             .then((res) => {
    //                 if (res.success) {
    //                     setLoading(false)
    //                     setData([...data, ...res.data])
    //                     console.log("len", data.length);
    //                 } else {
    //                     // whwn error occurs
    //                 }
    //             })
    //     }
    
    //     const renderItem = ({ item }) => {
    //         return (
    //             <View style={styles.singleComment}>
    //                 <Image source={dp} style={styles.dp} />
    //                 <View style={{ marginLeft: 15, width: width - 80 }}>
    //                     <Text style={styles.name}>{item.by.name}</Text>
    //                     <Text style={styles.comm}>{item.comments.comm}</Text>
    //                 </View>
    //             </View>
    //         )
    //     }
    
    //     const loadMore = () => {
    //         skip = skip + 20;
    //         fetchData()
    //         console.log("le", data.length);
    
    //     }
    
    
    //     useEffect(() => {
    //         fetchData()
    //     }, [])
    
    //     return (
    //         <View style={{ flex: 1, justifyContent: 'space-between' }}>
    //             <View style={{ height: 250 }}></View>
    //             <View style={styles.modal}>
    //                 <View style={styles.header}>
    //                     <TouchableOpacity
    //                         onPress={() => { props.closeComment({ shown: false, _id: "" }) }}
    //                     >
    //                         <Icon name="close" size={24} style={{ color: '#eee' }} />
    //                     </TouchableOpacity>
    //                     <Text style={styles.headerText}>Comments</Text>
    //                 </View>
    //                 {
    //                     loading
    //                         ?
    //                         <View style={{ flex: 1, marginBottom: 105, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: '#eee' }}>Loading....</Text></View>
    //                         :
    //                         <View style={{ marginBottom: 115 }}>
    //                             <FlatList
    //                                 data={data}
    //                                 renderItem={renderItem}
    //                                 onEndReached={loadMore}
    //                             />
    //                         </View>
    //                 }
    //             </View>
    //             <View style={styles.footer}>
    //                 <TextInput
    //                     style={styles.input}
    //                     // onChangeText={}
    //                     placeholder="Add Comment"
    //                     placeholderTextColor='silver'
    //                     multiline={true}
    //                     underlineColorAndroid="transparent"
    //                 />
    //                 <TouchableOpacity>
    //                     <Icon name="send" size={22} style={{ color: '#eee' }} />
    //                 </TouchableOpacity>
    //             </View>
    //         </View>
    //     )
    // }
    
    // export default Comment
    















