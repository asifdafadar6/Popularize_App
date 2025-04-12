import React from "react";
import { Tabs } from "expo-router";
import { StatusBar } from "react-native";
import { TabBarInflu } from "../../components/Pages/TabBarInflu"; // Ensure the path is correct

export default function TabLayout() {
  return (
    
     <Tabs tabBar={props => <TabBarInflu {...props} />} screenOptions={{
      headerShown: false
    }}>  
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen
        name="chatmessage"
        options={{
          title: "Chat",
          tabBarStyle: { display: "none" }, 
        }}
      />
      <Tabs.Screen name="search" options={{ title: "Search" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" translucent={false} />
    </Tabs>
  );
}