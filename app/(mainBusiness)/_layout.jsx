import { Stack } from 'expo-router'
import React, { Component } from 'react'
import { Text, View } from 'react-native'

export default function _layout() {

  return (
    <Stack screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name='index' />
      <Stack.Screen name='Congratulation' />
      <Stack.Screen name='payment' />
      <Stack.Screen name='paymentMethod' />
      <Stack.Screen name='index1' />
      <Stack.Screen name='Search' />
      <Stack.Screen name='Profile' />
      <Stack.Screen name='editprofile' />
      <Stack.Screen name='ACCOUNT' />
      <Stack.Screen name='DELETE' />
      <Stack.Screen name='offer' />
      <Stack.Screen name='Editoffer' />
      <Stack.Screen name='adduser' />
      <Stack.Screen name='subscribePlans' />
      <Stack.Screen name='subscribeSubPlans' />
      <Stack.Screen name='givenReview' />
      <Stack.Screen name='reviewSection' />
      <Stack.Screen name='AddOffers' />
      <Stack.Screen name='chatList' />
      <Stack.Screen name='chatMessageBusiness' />
      <Stack.Screen name='BuisnessAddress' />
      <Stack.Screen name='AddAddress' />
      <Stack.Screen name='editAddress' />
      <Stack.Screen name='ClaimSuccessful' />
      <Stack.Screen name='influProfile' />
      <Stack.Screen name='businessNotifications' />
      <Stack.Screen name='BusinessProfile' />
      <Stack.Screen name='BusinessProfileDetails' />
      <Stack.Screen name='ListOffers' />
      <Stack.Screen name='OfferDetails' />
    </Stack>
  )

};

