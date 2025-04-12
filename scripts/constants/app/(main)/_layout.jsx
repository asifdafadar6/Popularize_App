import { Stack, Tabs } from 'expo-router'
import React, { Component } from 'react'
import { Text, View ,} from 'react-native'


export default function _layout() {
 
    return (
      <Stack>
        <Stack.Screen name='index' options={{headerShown:false}}/>
        <Stack.Screen name='search' options={{headerShown:false}}/>
        <Stack.Screen name='profile' options={{headerShown:false}}/>
        <Stack.Screen name='Editprofile' options={{headerShown:false}}/>
        
      </Stack>
    )
  
};

