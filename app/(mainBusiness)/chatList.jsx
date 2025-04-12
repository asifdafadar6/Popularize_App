import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChatList() {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    axios.get('https://popularizenode.apdux.tech/api/viewallprofile')
      .then(response => {
        const influencers = response.data.all_data
          .filter(user => user.role.toLowerCase() === 'influencer')
          .slice(-5);
        setProfiles(influencers);
      })
      .catch(error => {
        console.error('Error fetching profiles:', error);
      });
  }, []);

  const handlePress = async (user) => {
    try {
      await AsyncStorage.setItem('influId', user._id);
      
      router.push({
        pathname: '/chatMessageBusiness',
      });
    } catch (error) {
      console.error('Error storing influencer ID:', error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handlePress(item)} style={styles.card}>
      <Image source={{ uri: item.profileImage }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.userName || item.companyName}</Text>
        <Text style={styles.email}>{item.intraID || item.instaID}</Text>
        <Text style={styles.role}>{item.type}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Chat List</Text>
      {profiles.length > 0 ? (
        <FlatList
          data={profiles}
          keyExtractor={item => item._id}
          renderItem={renderItem}
        />
      ) : (
        <Text style={styles.noUsers}>No influencers available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'left',
    color: '#333',
  },
  noUsers: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 12,
    borderRadius: 15,
    backgroundColor: '#FFD7B5',
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#fff',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    // color: '#fff',
  },
  email: {
    fontSize: 14,
    // color: '#FFD7B5',
  },
  role: {
    fontSize: 14,
    // color: '#FFF',
    fontWeight: '400',
  },
});
