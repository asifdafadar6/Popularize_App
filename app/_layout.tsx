import { View, Text, StatusBar } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

export default function RootLayout() {
  return (
    <Stack screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name='(tabs)' options={{ headerShown: false }}/>
      <Stack.Screen name='(tabsinflu)' options={{ headerShown: false }}/>
      <Stack.Screen name='welcome' options={{ headerShown: false }}/>
      <Stack.Screen name='(auth)' options={{ headerShown: false }}/>
      <Stack.Screen name='(authBusiness)' options={{ headerShown: false }}/>
      <Stack.Screen name='(main)' options={{ headerShown: false }}/>
      <Stack.Screen name='(mainBusiness)' options={{ headerShown: false }}/>
      
    </Stack>
  )
}