import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StatusBar, LogBox } from 'react-native';

import Home from "./screens/home/home";
import Profile from "./screens/profile/profile";
import Splash from "./screens/splash";
import Login from "./screens/login";
import Search from "./screens/search";
import Notification from "./screens/notification";

import AddDetails from "./screens/add/add_details";
import EditVideo from "./screens/add/edit_video";
import EditProfile from './screens/editprofile';

const stack = createNativeStackNavigator()


const App = () => {
  return (
    <NavigationContainer>
      {LogBox.ignoreAllLogs()}
      <StatusBar barStyle='light-content' backgroundColor='#000' />
      <stack.Navigator>
        <stack.Screen name='splash' component={Splash} options={{ headerShown: false }} />
        <stack.Screen name='login' component={Login} options={{ headerShown: false }} />
        <stack.Screen name='home' component={Home} options={{ headerShown: false }} />
        <stack.Screen name='profile' component={Profile} options={{ headerShown: false }} />
        <stack.Screen name='search' component={Search} options={{ headerShown: false }} />
        <stack.Screen name='notification' component={Notification} options={{ headerShown: false }} />
        <stack.Screen name='addDetails' component={AddDetails} options={{ headerShown: false }} />
        <stack.Screen name='editVideo' component={EditVideo} options={{ headerShown: false }} />
        <stack.Screen name='editProfile' component={EditProfile} options={{ headerShown: false }} />
      </stack.Navigator>
    </NavigationContainer>
  )
}

export default App;









// import React, { useRef } from 'react';
// import {StyleSheet} from 'react-native';
// import Video from 'react-native-video';

// const App = () => {
//   const videoRef = useRef(null)

//   const onBuffer=()=>{

//   }

//   const videoError=()=>{

//   }
//   return (
//     <Video source={{ uri: "https://res.cloudinary.com/shivraj-technology/video/upload/v1655567887/279254610_1151117615449419_2601272888201710659_n_eqglsf.mp4" }}
//       ref={videoRef}
//       resizeMode='cover'
//       repeat={true}
//       paused={true}
//       onBuffer={onBuffer}
//       onError={videoError}
//       style={styles.backgroundVideo} />

//   )
// }

// const styles = StyleSheet.create({
//   backgroundVideo: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     bottom: 0,
//     right: 0,
//   },
// });
// export default App;