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
        <Stack.Screen name='Accountupdate' options={{headerShown:false}}/>
        <Stack.Screen name='Delete' options={{headerShown:false}}/>
        <Stack.Screen name='accountUpdate1' options={{headerShown:false}}/>
        <Stack.Screen name='ReviewSection' options={{headerShown:false}}/>
        <Stack.Screen name='givenReview' options={{headerShown:false}}/>
        <Stack.Screen name='successful' options={{headerShown:false}}/>
        <Stack.Screen name='OfferSection' options={{headerShown:false}}/>
        <Stack.Screen name='offerDetails' options={{headerShown:false}}/>
        <Stack.Screen name='offerDetailswithoutAcceptButton' options={{headerShown:false}}/>
        <Stack.Screen name='BusinessChatList' options={{headerShown:false}}/>
        <Stack.Screen name='chatMessage' options={{headerShown:false}}/>
        <Stack.Screen name='reviewMessage' options={{headerShown:false}}/>
        <Stack.Screen name='InfluAddress' options={{headerShown:false}}/>
        <Stack.Screen name='AddAddress' options={{headerShown:false}}/>
        <Stack.Screen name='editAddress' options={{headerShown:false}}/>
        <Stack.Screen name='profileDetails' options={{headerShown:false}}/>
        <Stack.Screen name='notifications' options={{headerShown:false}}/>
        <Stack.Screen name='claimedOffers' options={{headerShown:false}}/>
        <Stack.Screen name='onGoingOffers' options={{headerShown:false}}/>
      </Stack>
    )
  
};

