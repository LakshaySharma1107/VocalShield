import React from 'react'
import{
View,
Text,
SafeAreaView,
StyleSheet,
Image,
useColorScheme,
ImageSourcePropType
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons';

export default function Headphone(){
  return(
  <View  style={styles.container}>
    <Image 
      source={require("../Headphone_icon.png")}
      />
   <Text style={styles.overlayText1}>Voice</Text>
   <Text style={styles.overlayText2}>Censorship</Text>
   </View>

  )
}

// Define styles
const styles = StyleSheet.create({
  container: {
  width:'auto',
  height:'auto',
  flex :1,
  justifyContent:'center',
  alignItems:'center',
  marginTop:'90%'
  },
  overlayText1: {
 
    position: 'absolute',
    color: '#000', // Text color
    fontSize: 34, // Text size
    fontWeight: 'bold', // Text weight
    fontFamily:'Poppins-Medium'
  
  },
  overlayText2: {
    paddingTop:100,
    position: 'absolute',
    color: '#000', // Text color
    fontSize: 34, // Text size
    fontWeight: 'bold', // Text weight
    fontFamily:'Poppins-Medium'
  },
});