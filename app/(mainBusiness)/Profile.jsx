import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { router, useFocusEffect } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const menuItems = [
  { title: 'Personal Info', icon: 'person' },
  { title: 'Addresses', icon: 'location-on' },
  { title: 'Notifications', icon: 'notifications' },
  { title: 'User Package Details', icon: 'rate-review' },
  { title: 'Add Offer', icon: 'local-offer' },
  { title: 'List of Offers', icon: 'list' },
  { title: 'Sign Out', icon: 'logout' },
];

const ProfileScreen = () => {
  const [profile, setProfile] = useState(null);

  const fetchProfile = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;

      const response = await axios.get(`https://popularizenode.apdux.tech/api/viewprofilebyid/${userId}`);
      setProfile(response.data.userDetails);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem("userToken");
      console.log('User signed out successfully.');
      router.push('/welcome');
    } catch (error) {
      console.error('Failed to sign out:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <View style={styles.imageWrapper}>
          <Image
  source={
    profile?.profileImage
      ? { uri: profile.profileImage }
      : require("../../assets/images/alterprofile.png")
  }
  style={styles.profileImage}
/>
            <TouchableOpacity style={styles.editButton} onPress={() => router.push("/editprofile")}>
              <Feather name="edit-2" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.companyName}>{profile?.companyName || profile?.userName || 'Loading...'}</Text>
          <Text style={styles.rating}>⭐⭐⭐⭐⭐</Text>
        </View>

        {/* Menu Options */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => {
                if (item.title === "Notifications") {
                  router.push("/businessNotifications");
                } else if (item.title === "Addresses") {
                  router.push("/BuisnessAddress");
                } else if (item.title === "Personal Info") {
                  router.push("/editprofile");
                }  else if (item.title === "User Package Details") {
                  router.push("/userPackageDetails");
                } else if (item.title === "Add Offer") {
                  router.push("/AddOffers");
                } else if (item.title === "List of Offers") {
                  router.push("/ListOffers");
                }
                 else if (item.title === "Sign Out") {
                  handleSignOut();
                }
              }}
            >
              <MaterialIcons name={item.icon} size={24} color="#ff8500" />
              <Text style={styles.menuText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', padding: 20, marginBottom: 40 },
  profileContainer: { alignItems: 'center', marginVertical: 20 },

  imageWrapper: {
    position: 'relative',
    width: 120,
    height: 120,
  },

  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#ffffff',
    backgroundColor: '#f8f8f8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },

  editButton: {
    position: 'absolute',
    bottom: 10,
    right: 0,
    backgroundColor: '#ff8500',
    width: 35,
    height: 35,
    borderRadius: "50%",
    borderWidth: 3,
    borderColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },

  companyName: { fontSize: 20, fontWeight: 'bold', marginTop: 10 },
  rating: { fontSize: 16, color: 'gold', marginTop: 5 },

  menuContainer: { marginTop: 20, marginBottom: 40 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
    marginVertical: 5,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },

  menuText: { fontSize: 18, marginLeft: 10, color: '#333' },

  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default ProfileScreen;