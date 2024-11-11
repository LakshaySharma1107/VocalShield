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
import Headphone from './headphone';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

export default function HomeScreen(){
  return(
  <View>
    <Headphone/>
  </View>
  );
}

