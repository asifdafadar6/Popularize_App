// import { Tabs } from 'expo-router';
// import React from 'react';
// import { Platform } from 'react-native';

// import { HapticTab } from '@/components/HapticTab';
// import { IconSymbol } from '@/components/ui/IconSymbol';
// import TabBarBackground from '@/components/ui/TabBarBackground';
// import { Colors } from '@/constants/Colors';
// import { useColorScheme } from '@/hooks/useColorScheme';
// import {MaterialIcons,FontAwesome5} from '@expo/vector-icons';


// export default function TabLayout() {

//   const colorScheme = useColorScheme();

//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
//         headerShown: false,
//         tabBarButton: HapticTab,
//         tabBarBackground: TabBarBackground,
//         tabBarStyle: Platform.select({
//           ios: {
//             // Use a transparent background on iOS to show the blur effect
//             position: 'absolute',
//           },
//           default: {},
//         }),
//       }}>
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'Home',
//           tabBarIcon: ({ color }) => <IconSymbol size={26} name="house.fill" color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="history"
//         options={{
//           title: 'History',
//           tabBarIcon: ({ color }) => <MaterialIcons size={26} name="history" color={color} />,
//         }}
//       />
//        <Tabs.Screen
//         name="profile"
//         options={{
//           title: 'Profile',
//           tabBarIcon: ({ color }) => <FontAwesome5 size={24} name="user-alt" color={color} />,
//         }}
//       />
//     </Tabs>
//   );
// }

import React from 'react'
import { Tabs } from 'expo-router'
import { TabBar } from '@/components/Pages/TabBar'
import { StatusBar } from 'react-native'

export default function TabLayout() {
  return (
    <Tabs 
      tabBar={props => <TabBar {...props} />} 
      screenOptions={{
        headerShown: false
      }}
    >
      <Tabs.Screen name='index' options={{ title: "Home" }} />
      <Tabs.Screen name="chatBusiness" options={{ title: "Chat"}} />
      <Tabs.Screen name='history' options={{ title: "History" }} />
      <Tabs.Screen name='profile' options={{ title: "Profile" }} />
      
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" translucent={false} />
    </Tabs>
  )
}
