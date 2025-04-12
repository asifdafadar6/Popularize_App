import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

export default function RootLayout() {
  return (
    <Stack screenOptions={{
      headerShown:false
    }}>
      <Stack.Screen name='(tabs)' />
      <Stack.Screen name ='welcome' />
      <Stack.Screen name='(auth)' />
      <Stack.Screen name='(authBusiness)' />
      <Stack.Screen name='(main)' />
      <Stack.Screen name='(mainBusiness)' />

    </Stack>
  )
}