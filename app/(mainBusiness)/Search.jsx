import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { router } from "expo-router";
import { MaterialIcons, Feather } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const SearchScreen = () => {
  const [recentSearches, setRecentSearches] = useState([
    { id: '1', name: 'Summer Sale', description: 'Up to 50% off on all items' },
    { id: '2', name: 'Tech Gadgets', description: 'Latest electronics collection' },
    { id: '3', name: 'Fashion Week', description: 'New arrivals for the season' },
  ]);

  const handleDelete = (id) => {
    setRecentSearches(recentSearches.filter(item => item.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search History</Text>

      <View style={styles.searchBox}>
        <Icon name="search-outline" size={20} color="#A0A0A0" style={styles.searchIcon} />
        <TextInput 
          placeholder="Search here..." 
          placeholderTextColor="#A0A0A0"
          style={styles.input} 
        />
        <Icon name="close-circle-outline" size={20} color="#A0A0A0" />
      </View>

      <Text style={styles.recentTitle}>Recent Searches</Text>

      <FlatList
        data={recentSearches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.searchItem}>
            <View style={styles.placeholder}>
              <Icon name="time-outline" size={20} color="#FF7622" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.offerName}>{item.name}</Text>
              <Text style={styles.offerDescription}>{item.description}</Text>
            </View>
            <TouchableOpacity 
              onPress={() => handleDelete(item.id)}
              style={styles.deleteButton}
            >
              <Icon name="trash-outline" size={20} color="#D4A373" />
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <Feather name="home" size={24} color="#A0A0A0" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navButtonActive}>
          <FontAwesome name="history" size={24} color="#FF7622" />
          <Text style={[styles.navText, styles.navTextActive]}>History</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => router.push("/Profile")}
        >
          <Feather name="user" size={24} color="#A0A0A0" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8F8F8', 
    padding: 20,
    paddingBottom: 80 
  },
  title: { 
    fontSize: 22, 
    fontWeight: '700', 
    color: '#333', 
    marginVertical: 20,
    textAlign: 'center'
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: { 
    marginRight: 12 
  },
  input: { 
    flex: 1, 
    fontSize: 16,
    color: '#333'
  },
  recentTitle: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#333',
    marginBottom: 16,
    paddingLeft: 8
  },
  listContent: {
    paddingBottom: 20
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  placeholder: {
    width: 40,
    height: 40,
    backgroundColor: '#FFF5EB',
    borderRadius: 10,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE4CC'
  },
  textContainer: {
    flex: 1
  },
  offerName: { 
    fontSize: 16, 
    fontWeight: '600',
    color: '#333',
    marginBottom: 4
  },
  offerDescription: { 
    fontSize: 14, 
    color: '#888' 
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  navButton: {
    alignItems: 'center',
    padding: 8
  },
  navButtonActive: {
    alignItems: 'center',
    padding: 8
  },
  navText: {
    fontSize: 12,
    color: '#A0A0A0',
    marginTop: 4
  },
  navTextActive: {
    color: '#FF7622',
    fontWeight: '600'
  }
});