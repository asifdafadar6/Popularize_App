import React from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet,Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { router } from "expo-router";


const SearchScreen = () => {
  const recentSearches = [
    { id: '1', name: 'Offer Name', description: 'Lorem Ipsum' },
    { id: '2', name: 'Offer Name', description: 'Lorem Ipsum' },
    { id: '3', name: 'Offer Name', description: 'Lorem Ipsum' },
  ];

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton}>
        <Icon name="chevron-back-outline" size={24} color="#D4A373" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Result For Your Search</Text>

      {/* Search Box */}
      <View style={styles.searchBox}>
        <Icon name="search-outline" size={20} color="#A0A0A0" style={styles.searchIcon} />
        <TextInput placeholder="Search here" style={styles.input} />
        <Icon name="close-circle-outline" size={20} color="#A0A0A0" />
      </View>

      {/* Recent Search Title */}
      <Text style={styles.recentTitle}>Recent Search</Text>

      {/* Recent Search List */}
      <FlatList
        data={recentSearches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.searchItem}>
            <View style={styles.placeholder} />
            <View style={{ flex: 1 }}>
              <Text style={styles.offerName}>{item.name}</Text>
              <Text style={styles.offerDescription}>{item.description}</Text>
            </View>
            <Icon name="chevron-forward-outline" size={20} color="#D4A373" />
          </TouchableOpacity>
        )}
      />
      <View style={styles.socialContainer}>
                          <TouchableOpacity>
                            <Image source={require('../../assets/images/homeicon.png')} style={styles.socialIcons}/>
                          </TouchableOpacity>
                          <TouchableOpacity>
                            <Image source={require('../../assets/images/magnifying-glass.png')} style={styles.socialIcons}/>
                          </TouchableOpacity>
                          <TouchableOpacity>
                            <TouchableOpacity onPress={()=>{router.push("/profile")
                                                          
                                                        }}>
 <Image source={require('../../assets/images/user.png')} style={styles.socialIcons}/>
                                                        </TouchableOpacity>
                           
                          </TouchableOpacity>
                        </View>
    </View>
  );
};

export default SearchScreen; 

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8', padding: 16 },
  backButton: { position: 'absolute', top: 20, left: 16, zIndex: 10 },
  title: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFEFEF',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 16,
  },
  searchIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 16 },
  recentTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  placeholder: {
    width: 40,
    height: 40,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    marginRight: 10,
  },
  offerName: { fontSize: 14, fontWeight: 'bold' },
  offerDescription: { fontSize: 12, color: '#A0A0A0' },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFF',
    paddingVertical: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  socialIcons: {
    height:30,
    width:30,
    resizeMode:"contain"
  },
  socialContainer: {
    flexDirection:'row',
    alignItems:"center",
    justifyContent:"center",
    gap:10,
marginTop:20,

  },
});
