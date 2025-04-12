import { router } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const AddUserScreen = () => {
  const users = [
    { id: '1', name: 'User Name', description: 'Instagram Id - Lorem Ipsum' },
    { id: '2', name: 'User Name', description: 'Instagram Id - Lorem Ipsum' },
    { id: '3', name: 'User Name', description: 'Instagram Id - Lorem Ipsum' },
  ];

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity style={styles.backButton}>
        <Icon name="chevron-back-outline" size={24} color="#D4A373" />       
      </TouchableOpacity> */}

<TouchableOpacity style={styles.backBottomButton} onPress={()=>{router.push('/Editoffer')}}>
        <Text style={styles.backBottomText}>⬅ BACK</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Add User</Text>

      <TouchableOpacity style={styles.searchBox}>
        <Text style={styles.searchPlaceholder}>Select Here</Text>
      </TouchableOpacity>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.userItem}>
            <View style={styles.placeholder} />
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userDescription}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      
    </View>
  );
};

export default AddUserScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8', padding: 16 },
  backButton: { position: 'absolute', top: 20, left: 16, zIndex: 10 },
  title: { fontSize: 18, fontWeight: 'bold', textAlign: 'left', marginVertical: 20, marginTop: 40 },
  
  searchBox: {
    backgroundColor: '#E8ECEF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  searchPlaceholder: {
    fontSize: 16,
    color: '#A0A0A0',
  },

  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  placeholder: {
    width: 40,
    height: 40,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    marginRight: 10,
  },
  userName: { fontSize: 14, fontWeight: 'bold' },
  userDescription: { fontSize: 12, color: '#A0A0A0' },

  backBottomButton: {
    alignSelf: 'flex-start',
  },
  backBottomText: {
    color: '#D4A373',
    fontWeight: 'bold',
    fontSize: 16,
  },
});