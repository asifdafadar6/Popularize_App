import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router, useFocusEffect } from "expo-router"; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const menuItems = [
  { title: 'Personal Info', icon: 'person' },
  { title: 'Addresses', icon: 'location-on' },
  // { title: 'Notifications', icon: 'notifications' },
  { title: 'User Reviews', icon: 'rate-review' },
  { title: 'Ongoing Offers', icon: 'local-offer' },
  { title: 'Sign Out', icon: 'logout' },
];

const ProfileScreen = () => {

   const [profile, setProfile] = useState(null);
  
      const fetchProfile = async () => {
        try {
          const userId = await AsyncStorage.getItem('userinfluId');
          if (!userId) return;
  
          const response = await axios.get(`https://popularizenode.apdux.tech/api/viewprofilebyid/${userId}`);
          setProfile(response.data.userDetails);
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      };
  
      // fetchProfile();
    useFocusEffect(
       useCallback(() => {
        fetchProfile();
       }, [])
     );

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem('userinfluId');
      await AsyncStorage.removeItem("userInfluToken");
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
                        source={{ uri: profile?.profileImage }}
                        style={styles.profileImage}
                      />
            <TouchableOpacity onPress={()=>{
                        router.push("(main)/Editprofile")
                      }} style={styles.editButton}>
                        <Feather name="edit-2" size={16} color="#fff" />
                      </TouchableOpacity>
        </View>
        <Text style={styles.companyName}>{profile?.userName || 'Loading...'}</Text>
        <Text style={styles.rating}>⭐⭐⭐⭐⭐</Text>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem} onPress={() => {
            if (item.title === 'User Reviews') {
              router.push("/givenReview");
            } else if (item.title === 'Personal Info') {
              router.push("/profileDetails");
            } else if (item.title === 'Addresses') {
              router.push("/InfluAddress");
            } else if (item.title === 'Ongoing Offers') {
              router.push('/onGoingOffers');
            } else if (item.title === 'Sign Out') {
              handleSignOut();
            }
          }}>
            <MaterialIcons name={item.icon} size={24} color="#ff8500" />
            <Text style={styles.menuText}>{item.title}</Text>
          </TouchableOpacity>
          
        ))}
      </View>

      {/* Bottom Navigation */}
      {/* <View style={styles.bottomNav}>
        <TouchableOpacity>
          <Feather name="home" size={24} color="#ccc" />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome name="history" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name="user" size={24} color="#ff8500" />
        </TouchableOpacity>
      </View> */}
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', padding: 20,marginBottom:50 },
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
    bottom: 0,
    right: 0,
    backgroundColor: '#ff8500',
    width: 32,
    height: 32,
    borderRadius: 16,
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

  menuContainer: { marginVertical: 20 },
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



// import React, { useState } from 'react';
// import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, TextInput, ScrollView } from 'react-native';
// import Feather from '@expo/vector-icons/Feather';
// import { router } from "expo-router";
// import FontAwesome from '@expo/vector-icons/FontAwesome';
// import EvilIcons from '@expo/vector-icons/EvilIcons';
// import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

// const ProfileScreen = () => {
//   const posts = [
//     { id: '1', image: require('../../assets/images/camera.jpg'), caption: 'Lorem Ipsum For Demo' },
//     { id: '2', image: require('../../assets/images/camera.jpg'), caption: 'Enjoying the beautiful sunset!' },
//     { id: '3', image: require('../../assets/images/camera.jpg'), caption: 'Exploring nature and loving it!' },
//     { id: '4', image: require('../../assets/images/camera.jpg'), caption: 'A perfect day at the beach!' },
//   ];


//   const [liked, setLiked] = useState(false);
//   const [showCommentInput, setShowCommentInput] = useState(false);
//   const [comment, setComment] = useState("");
//   const [comments, setComments] = useState([]);
//   const [followed, setFollowed] = useState(false);


//   const [postStates, setPostStates] = useState(
//     posts.reduce((acc, post) => {
//       acc[post.id] = {
//         liked: false,
//         saved: false,
//         comments: [],
//         showComments: false,
//         commentText: ""
//       };
//       return acc;
//     }, {})
//   );

//   const toggleSave = (postId) => {
//     setPostStates((prevState) => ({
//       ...prevState,
//       [postId]: {
//         ...prevState[postId],
//         saved: !prevState[postId].saved,
//       },
//     }));
//   };


//   const toggleLike = (postId) => {
//     setPostStates((prevState) => ({
//       ...prevState,
//       [postId]: {
//         ...prevState[postId],
//         liked: !prevState[postId].liked,
//       },
//     }));
//   };

//   const addComment = (postId) => {
//     const comment = postStates[postId].commentText.trim();
//     if (comment === "") return;

//     setPostStates((prevState) => ({
//       ...prevState,
//       [postId]: {
//         ...prevState[postId],
//         comments: [...prevState[postId].comments, comment],
//         commentText: "", 
//       },
//     }));
//   };


//   return (
//     <ScrollView>
//       <View style={styles.container}>
//         <View style={styles.header}>
//           <View style={styles.icon}>
//             <Image source={require('../../assets/images/profilepic.jpg')} style={styles.profileImage} />
//             <TouchableOpacity style={styles.editicon} onPress={() => router.push("/Editprofile")}>
//               <Feather name="edit-2" size={16} color="black" />
//             </TouchableOpacity>
//           </View>

//           <Text style={styles.name}>Lorem Ipsum</Text>
//           <Text style={styles.username}>@loremipsum</Text>

//           <View style={styles.statsContainer}>
//             <Text style={styles.stat}>50{"\n"}Posts</Text>
//             <View style={styles.buttonContainer}>
//   <TouchableOpacity 
//     style={[styles.followButton, followed && styles.followingButton]} 
//     onPress={() => setFollowed(!followed)}
//   >
//     <Text style={[styles.buttonFollowText, followed && styles.followingText]}>
//       {followed ? "Following" : "Follow"}
//     </Text>
//   </TouchableOpacity>
//   <TouchableOpacity style={styles.messageButton} onPress={() => { router.push('/chatMessage') }}>
//     <Text style={styles.buttonText}>Message</Text>
//   </TouchableOpacity>
// </View>
//           </View>

//           {/* <View style={styles.buttonContainer}>
//             <TouchableOpacity style={styles.followButton}>
//               <Text style={styles.buttonFollowText}>Follow</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.messageButton} onPress={() => { router.push('/chatMessage') }}>
//               <Text style={styles.buttonText}>Message</Text>
//             </TouchableOpacity>
//           </View> */}
//         </View>
//         <View style={styles.tabContainer}>
//           <TouchableOpacity style={styles.tab}><Text>Posts</Text></TouchableOpacity>
//           <TouchableOpacity style={styles.tab}><Text>Photos</Text></TouchableOpacity>
//           <TouchableOpacity style={styles.tab}><Text>Videos</Text></TouchableOpacity>
//         </View>

//         <FlatList
//           data={posts}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <View style={styles.postContainer}>
//               <View style={styles.postHeader}>
//                 <Image source={require('../../assets/images/profilepic.jpg')} style={styles.profileThumb} />
//                 <View>
//                   <Text style={styles.postUser}>Lorem Ipsum</Text>
//                   <Text style={styles.postTime}>40 min ago · Lorem, India</Text>
//                 </View>
//               </View>

//               <Image source={item.image} style={styles.postImage} />
//               <Text style={styles.postCaption}>{item.caption}</Text>

//               <View style={styles.interactionBar}>
//                 <View style={styles.leftIcons}>
//                   <TouchableOpacity onPress={() => toggleLike(item.id)}>
//                     <FontAwesome
//                       name={postStates[item.id].liked ? "heart" : "heart-o"}
//                       size={22}
//                       color={postStates[item.id].liked ? "red" : "black"}
//                     />
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     onPress={() =>
//                       setPostStates((prevState) => ({
//                         ...prevState,
//                         [item.id]: {
//                           ...prevState[item.id],
//                           showComments: !prevState[item.id].showComments,
//                         },
//                       }))
//                     }
//                   >
//                     <View style={styles.commentButton}>
//                       <EvilIcons name="comment" size={24} color="black" />
//                       {postStates[item.id].comments.length > 0 && (
//                         <Text style={styles.commentCount}>{postStates[item.id].comments.length}</Text>
//                       )}
//                     </View>
//                   </TouchableOpacity>
//                   <TouchableOpacity>
//                     <MaterialCommunityIcons name="send-outline" size={22} color="black" />
//                   </TouchableOpacity>
//                 </View>

//                 <TouchableOpacity
//                   onPress={() => toggleSave(item.id)}
//                   style={styles.bookmarkButton}
//                 >
//                   <View style={[styles.bookmarkInner, postStates[item.id].saved && styles.bookmarked]}>
//                     <Feather
//                       name="bookmark"
//                       size={22}
//                       color={postStates[item.id].saved ? "white" : "black"}
//                     />
//                   </View>
//                 </TouchableOpacity>

//               </View>

//               {/* Comment Input Box */}
//               <View style={styles.commentBox}>
//                 <TextInput
//                   style={styles.commentInput}
//                   placeholder="Write a comment..."
//                   value={postStates[item.id].commentText}
//                   onChangeText={(text) =>
//                     setPostStates((prevState) => ({
//                       ...prevState,
//                       [item.id]: { ...prevState[item.id], commentText: text },
//                     }))
//                   }
//                 />
//                 <TouchableOpacity style={styles.postButton} onPress={() => addComment(item.id)}>
//                   <Text style={styles.postButtonText}>Post</Text>
//                 </TouchableOpacity>
//               </View>

//               {/* Display Comments (if toggled) */}
//               {postStates[item.id].showComments &&
//                 postStates[item.id].comments.map((comment, index) => (
//                   <Text key={index} style={styles.commentText}>💬 {comment}</Text>
//                 ))
//               }
//             </View>
//           )}
//         />
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff' },
//   header: {
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#ff6600',
//     // borderBottomLeftRadius: 20,
//     // borderBottomRightRadius: 20,
//   },
//   icon: {
//     position: "relative",
//     width: 90,
//     height: 90,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   profileImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     borderWidth: 2,
//     borderColor: '#fff',
//   },
//   editicon: {
//     position: "absolute",
//     bottom: 0,
//     right: 5,
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     backgroundColor: "#ff6600",
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 2,
//     borderColor: "black",
//   },
//   commentCount: {
//     marginLeft: 5,
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#000",
//   },
//   name: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginTop: 5 },
//   username: { fontSize: 14, color: '#fff' },
//   statsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '60%', marginVertical: 10 },
//   stat: { textAlign: 'center', color: '#fff',right:40 },
//   buttonContainer: { flexDirection: 'row', gap: 10,right:20 },
//   followButton: { backgroundColor: '#fff', padding: 10, borderRadius: 5 },
//   messageButton: { borderWidth: 1, borderColor: '#fff', padding: 10, borderRadius: 5, fontWeight: 'bold' },
//   buttonText: { color: '#fff', fontWeight: 'bold' },
//   buttonFollowText: { color: 'black', fontWeight: 'bold' },
//   tabContainer: { fontWeight: 'semibold', flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#ddd' },
//   tab: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 5, fontWeight: 'semibold' },
//   postContainer: { padding: 15, borderBottomWidth: 1, borderColor: '#ddd' },
//   postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
//   profileThumb: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
//   postUser: { fontWeight: 'bold' },
//   postTime: { fontSize: 12, color: '#666' },
//   postImage: { width: '100%', height: 200, borderRadius: 10 },
//   postCaption: { marginTop: 5 },
//   interactionBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//   },
//   leftIcons: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 20,
//   },
//   likeButton: {
//     padding: 8,
//     borderRadius: 50,
//     borderWidth: 2,
//     borderColor: "transparent",
//     backgroundColor: "transparent",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   liked: {
//     backgroundColor: "#eb5757",
//     borderColor: "#eb5757",
//   },
//   iconButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 5,
//   },
//   saveButton: {
//     padding: 5,
//   },
//   socialIcons: {
//     height: 30,
//     width: 30,
//     resizeMode: "contain",
//   },
//   socialContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 10,
//     marginTop: 20,
//   },
//   commentBox: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 20,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     marginTop: 10,
//     backgroundColor: "#f9f9f9",
//   },
//   commentInput: {
//     flex: 1,  // Takes up remaining space
//     height: 40,
//     paddingHorizontal: 10,
//     fontSize: 14,
//     color: "#333",
//   },
//   commentButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 0, // Adds space between icon & number
//   },
//   postCommentButton: {
//     backgroundColor: "#ff6600",
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     borderRadius: 20,
//     marginLeft: 10,
//   },

//   postCommentText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 14,
//   },
//   bottomNav: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     position: "absolute",
//     bottom: 20,
//     left: 20,
//     right: 20,
//     backgroundColor: "#fff",
//     padding: 5,
//     borderRadius: 20,
//     elevation: 5,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   commentInput: { flex: 1, paddingHorizontal: 10, fontSize: 14, color: "#333" },
//   postButton: { backgroundColor: "#ff6600", paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, marginLeft: 10 },
//   postButtonText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
//   commentText: { fontSize: 14, color: "#555", marginTop: 5 },
//   bookmarkButton: {
//     padding: 2, 
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: "white", 
//   },

//   bookmarkInner: {
//     padding: 6,
//     borderRadius: 8,
//     backgroundColor: "transparent",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   bookmarked: {
//     backgroundColor: "orange", 
//   },
//   followingButton: {
//     backgroundColor: "#ddd", 
//   },
  
//   followingText: {
//     color: "black", 
//   },  
// });

// export default ProfileScreen; 
