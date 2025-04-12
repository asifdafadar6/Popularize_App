import { Stack } from 'expo-router'
import React, { Component } from 'react'
import { StatusBar, Text, View } from 'react-native'

export default function _layout() {
 
    return (
      <Stack screenOptions={{
        headerShown:false
      }}>
        <Stack.Screen name='index'/>
        <Stack.Screen name='singup'/>
        <Stack.Screen name='Emailpassword'/>
        <Stack.Screen name='otpverify'/>
        <Stack.Screen name='newPass'/>
      </Stack>
    )
  
};

