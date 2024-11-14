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
   <Text style={styles.overlayText1}>Vocal</Text>
   <Text style={styles.overlayText2}>Shield</Text>
   {/* <Text style={styles.overlayText3}>Using NLP and DL</Text> */}


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
    fontSize: 48, // Text size
    fontWeight: 'bold', // Text weight
    fontFamily:'Poppins-Medium',
  },
  overlayText2: {
    paddingTop:100,
    position: 'absolute',
    color: '#000', // Text color
    fontSize: 48, // Text size
    fontWeight: 'bold', // Text weight
    fontFamily:'Poppins-Medium'
  },
  overlayText3: {
    paddingTop:200,
    position: 'absolute',
    color: '#000', // Text color
    fontSize: 22, // Text size
    fontWeight: 'bold', // Text weight
    fontFamily:'Poppins-Medium'
  
  },
});