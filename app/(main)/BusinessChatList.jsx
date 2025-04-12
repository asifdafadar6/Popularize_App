import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ChatList() {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    axios.get('https://popularizenode.apdux.tech/api/viewallprofile')
      .then(response => {
        const businesses = response.data.all_data
          .filter(user => user.role.toLowerCase() === 'business')
          .slice(-5);
        setProfiles(businesses);
      })
      .catch(error => {
        console.error('Error fetching profiles:', error);
      });
  }, []);

  const handlePress = (user) => {
    router.push({
      pathname: '/chatMessage',
      params: { userBusinessId: user._id },
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handlePress(item)} style={styles.card}>
      <Image
        source={{ uri: item.profileImage || require("../../assets/images/alterprofile.png") }}
        style={styles.image}
      />
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
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.noUsersContainer}>
          <Text style={styles.noUsers}>No Businesses available</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#FFFFFF',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#222',
    textAlign: 'center',
  },
  noUsersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noUsers: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#FEE8D6',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    borderWidth: 1, 
    borderColor: '#EAEAEA', 
  },
  image: {
    width: 55,
    height: 55,
    borderRadius: 50,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#FF7622',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  email: {
    fontSize: 13,
    color: '#555',
    marginTop: 3,
  },
  role: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FF7622',
    marginTop: 3,
  },
  chatIcon: {
    padding: 10,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#FF7622',
  },
});
