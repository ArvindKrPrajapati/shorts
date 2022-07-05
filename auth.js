import AsyncStorage from '@react-native-async-storage/async-storage'


const Auth=async()=>{
  try {
      const value = await AsyncStorage.getItem('key');
      return value
    } catch (error) {
       return false
    }
}
export {Auth}