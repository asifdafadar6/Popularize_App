import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { router } from "expo-router";

const ProfileScreen = () => {
  const posts = [
    { id: '1', image: require('../../assets/images/camera.jpg'), caption: 'Lorem Ipsum For Demo' }
  ];

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.icon}>
          <Image source={require('../../assets/images/profilepic.jpg')} style={styles.profileImage} />
          <TouchableOpacity style={styles.editicon}>
             <TouchableOpacity onPress={()=>{router.push("/Editprofile")
                                                                      
                }}>
               <Feather name="edit-2" size={16} color="Black" />
            </TouchableOpacity>
            
          </TouchableOpacity>
        </View>

        <Text style={styles.name}>Lorem Ipsum</Text>
        <Text style={styles.username}>@loremipsum</Text>

        <View style={styles.statsContainer}>
          <Text style={styles.stat}>50{"\n"}Posts</Text>
          <Text style={styles.stat}>2.5k{"\n"}Following</Text> 
          <Text style={styles.stat}>1.5m{"\n"}Followers</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.followButton}>
            <Text style={styles.buttonText}>Follow</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.messageButton}>
            <Text style={styles.buttonText}>Message</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Post Section */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <View style={styles.postHeader}>
              <Image source={require('../../assets/images/profilepic.jpg')} style={styles.profileThumb} />
              <View>
                <Text style={styles.postUser}>Lorem Ipsum</Text>
                <Text style={styles.postTime}>40 min ago · Lorem, India</Text>
              </View>
            </View>
            <Image source={item.image} style={styles.postImage} />
            <Text style={styles.postCaption}>{item.caption}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: '#ff6600', 
    borderBottomLeftRadius: 20, 
    borderBottomRightRadius: 20 
  },
  icon: { 
    position: "relative", 
    width: 90, 
    height: 90, 
    justifyContent: "center", 
    alignItems: "center"
  },
  profileImage: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    borderWidth: 2, 
    borderColor: '#fff' 
  },
  editicon: {
    position: "absolute",
    bottom: 0,
    right: 5, /* Adjusted to better match the reference */
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#ff6600", 
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "Black",
  },
  name: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginTop: 5 },
  username: { fontSize: 14, color: '#fff' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '80%', marginVertical: 10 },
  stat: { textAlign: 'center', color: '#fff' },
  buttonContainer: { flexDirection: 'row', gap: 10 },
  followButton: { backgroundColor: '#fff', padding: 10, borderRadius: 5 },
  messageButton: { borderWidth: 1, borderColor: '#fff', padding: 10, borderRadius: 5 },
  buttonText: { color: '', fontWeight: 'bold' }, /* Fixed text color */
  postContainer: { padding: 15, borderBottomWidth: 1, borderColor: '#ddd' },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  profileThumb: { width: 40, height: 40, borderRadius: 20, marginRight: 10, },
  postUser: { fontWeight: 'bold' },
  postTime: { fontSize: 12, color: '#666' },
  postImage: { width: '100%', height: 200, borderRadius: 10 },
  postCaption: { marginTop: 5 },
});

export default ProfileScreen;
