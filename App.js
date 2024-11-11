import React from 'react'
import{
View,
Text,
SafeAreaView,
Image,
StyleSheet,
useColorScheme,
ImageSourcePropType
} from 'react-native'
import Headphone from './Components/headphone';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './Components/HomeScreen'
import Foundation from 'react-native-vector-icons/Foundation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AudioInputButton from './Components/AudioInputButton';
import ProcessPage from './Components/Processpage';
import AnalysisPage from './Components/AnalysisPage';


function App(){
  const TabNav = createBottomTabNavigator();
return(

  <NavigationContainer>
   
  <TabNav.Navigator screenOptions={{
    tabBarActiveTintColor:"#2C4EC5",
    tabBarInactiveTintColor:'#fff',
    tabBarInactiveBackgroundColor:"#000",
    tabBarActiveBackgroundColor:"#000",
    tabBarStyle:{
      height:60,
      paddingTop:0
    },
    tabBarLabelStyle:{
      fontSize:14,
      paddingBottom:5,
      fontWeight:600,
      fontFamily:'Poppins-Medium',
      backgroundColor:"#000"
    }
  }}>
      <TabNav.Screen name='Home' component={HomeScreen} options={{headerShown:false,
        tabBarIcon:({focused})=>(
          <Foundation name='home' size={25} color={focused? "#2C4EC5":"#fff"}/>
        )
      }}/>

      <TabNav.Screen name='Recording' component={AudioInputButton/*Change to the respective page */} options={{
        headerShown:true,headerTitle:'New Recording',headerTitleAlign:'center',headerTintColor:'black',
        headerTransparent:true,
        margin:15,
        tabBarIcon:({focused})=>(
          <FontAwesome name="microphone" size={25} color={focused? "#2C4EC5":"#fff"}/>
        )
        }}/>


      <TabNav.Screen name='Process' component={ProcessPage} options={{headerShown:false,
        tabBarIcon:({focused})=>(
          <Foundation name='graph-pie'size={30} color={focused? "#2C4EC5":"#fff"}/>
        )
      }}/>


      <TabNav.Screen name='AnalysisPage' component={AnalysisPage} options={{headerShown:false,
         tabBarIcon:({focused})=>(
          <Ionicons name='analytics-sharp'size={30} color={focused? "#2C4EC5":"#fff"}/>
        )
      }}/>
  </TabNav.Navigator>
  
  </NavigationContainer> 

  );
}

export default App;