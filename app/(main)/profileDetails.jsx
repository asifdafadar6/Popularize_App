import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { router, useLocalSearchParams } from "expo-router";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { AntDesign, Fontisto } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as Facebook from '';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';

const InfluProfile = () => {
  const posts = [
    { id: '1', image: require('../../assets/images/camera.jpg'), caption: 'Lorem Ipsum For Demo' },
    { id: '2', image: require('../../assets/images/camera.jpg'), caption: 'Enjoying the beautiful sunset!' },
    { id: '3', image: require('../../assets/images/camera.jpg'), caption: 'Exploring nature and loving it!' },
    { id: '4', image: require('../../assets/images/camera.jpg'), caption: 'A perfect day at the beach!' },
  ];


  const [liked, setLiked] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [followed, setFollowed] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userinfluId, setUserinfluId] = useState(null);


  const [postStates, setPostStates] = useState(
    posts.reduce((acc, post) => {
      acc[post.id] = {
        liked: false,
        saved: false,
        comments: [],
        showComments: false,
        commentText: ""
      };
      return acc;
    }, {})
  );

  const toggleSave = (postId) => {
    setPostStates((prevState) => ({
      ...prevState,
      [postId]: {
        ...prevState[postId],
        saved: !prevState[postId].saved,
      },
    }));
  };


  const toggleLike = (postId) => {
    setPostStates((prevState) => ({
      ...prevState,
      [postId]: {
        ...prevState[postId],
        liked: !prevState[postId].liked,
      },
    }));
  };

  const addComment = (postId) => {
    const comment = postStates[postId].commentText.trim();
    if (comment === "") return;

    setPostStates((prevState) => ({
      ...prevState,
      [postId]: {
        ...prevState[postId],
        comments: [...prevState[postId].comments, comment],
        commentText: "",
      },
    }));
  };

  // const connectWithFacebook = async () => {
  //   try {
  //     await Facebook.initializeAsync({
  //       appId: 644288331665012,
  //     });
  
  //     const { type, token } = await Facebook.logInWithReadPermissionsAsync({
  //       permissions: ['public_profile', 'email'],
  //     });
  
  //     if (type === 'success' && token) {
  //       const response = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,email`);
  //       const userInfo = await response.json();
  //       console.log('Facebook User Info:', userInfo);
  
  //       alert(`Connected to Facebook as ${userInfo.name}`);
  //     } else {
  //       alert('Facebook login canceled.');
  //     }
  //   } catch (error) {
  //     console.error('Facebook Login Error:', error);
  //     alert('Error connecting to Facebook.');
  //   }
  // };


  const instagramAppId = 644288331665012;
  const instagramRedirectUri = AuthSession.makeRedirectUri({ useProxy: true });

  const connectWithInstagram = async () => {
    try {
      const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${instagramAppId}&redirect_uri=${encodeURIComponent(instagramRedirectUri)}&scope=user_profile,user_media&response_type=code`;
      const result = await WebBrowser.openAuthSessionAsync(authUrl, instagramRedirectUri);

      if (result.type === 'success') {
        console.log('Instagram Auth Code:', result.url);
        alert('Connected to Instagram');
      } else {
        alert('Instagram login canceled.');
      }
    } catch (error) {
      console.error('Instagram Login Error:', error);
      alert('Error connecting to Instagram.');
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedInfluId = await AsyncStorage.getItem("userinfluId");
        console.log("Fetching profile for userId:", storedInfluId);

        if (!storedInfluId) {
          setError("Influencer ID not found in storage");
          setLoading(false);
          return;
        }

        setUserinfluId(storedInfluId);

        const response = await axios.get(`https://popularizenode.apdux.tech/api/viewprofilebyid/${storedInfluId}`);
        console.log("API Response:", response.data);

        if (response.data && response.data.userDetails) {
          setUserData(response.data.userDetails);
        } else {
          setError("No user data found");
        }
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to load profile: " + (err.message || "Unknown error"));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <View style={styles.icon}>
                <Image source={{ uri: userData.profileImage }} style={styles.profileImage} />
              </View>

              <Text style={styles.name}>{userData.userName}</Text>
              <Text style={styles.instaname}>@{userData.intraID}</Text>
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>50</Text>
                  <Text style={styles.statLabel}>Posts</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>2.5k</Text>
                  <Text style={styles.statLabel}>Following</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>1.5m</Text>
                  <Text style={styles.statLabel}>Followers</Text>
                </View>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.socialButton, styles.facebookButton]}
                  // onPress={connectWithFacebook}
                >
                  <Image source={require('../../assets/images/facebook.png')} style={styles.socialIcon} />
                  <Text style={styles.socialText}>Connect Facebook</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.socialButton, styles.instagramButton]}
                  onPress={connectWithInstagram}
                >
                  <Image source={require('../../assets/images/instagram.png')} style={styles.socialIcon} />
                  <Text style={styles.socialText}>Connect Instagram</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.horizontalLine} />

            {/* <View style={styles.tabContainer}> */}
            {/* <TouchableOpacity style={styles.tab}><Text>Posts</Text></TouchableOpacity> */}
            {/* <TouchableOpacity style={styles.tab}><Text>Photos</Text></TouchableOpacity>
          <TouchableOpacity style={styles.tab}><Text>Videos</Text></TouchableOpacity> */}
            {/* </View> */}
          </>
        }
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <View style={styles.postHeader}>
              <Image source={require('../../assets/images/profilepic.jpg')} style={styles.profileThumb} />
              <View>
                <Text style={styles.postUser}>{userData.userName}</Text>
                <Text style={styles.postTime}>40 min ago · Lorem, India</Text>
              </View>
            </View>

            <Image source={item.image} style={styles.postImage} />
            <Text style={styles.postCaption}>{item.caption}</Text>

            <View style={styles.interactionBar}>
              <View style={styles.leftIcons}>
                <TouchableOpacity onPress={() => toggleLike(item.id)}>
                  <FontAwesome
                    name={postStates[item.id].liked ? "heart" : "heart-o"}
                    size={22}
                    color={postStates[item.id].liked ? "red" : "black"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    setPostStates((prevState) => ({
                      ...prevState,
                      [item.id]: {
                        ...prevState[item.id],
                        showComments: !prevState[item.id].showComments,
                      },
                    }))
                  }
                >
                  <View style={styles.commentButton}>
                    <Fontisto name="commenting" size={24} color="black" />
                    {postStates[item.id].comments.length > 0 && (
                      <Text style={styles.commentCount}>{postStates[item.id].comments.length}</Text>
                    )}
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <MaterialCommunityIcons name="send-outline" size={22} color="black" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => toggleSave(item.id)}
                style={styles.bookmarkButton}
              >
                <View style={[styles.bookmarkInner, postStates[item.id].saved && styles.bookmarked]}>
                  <Feather
                    name="bookmark"
                    size={22}
                    color={postStates[item.id].saved ? "white" : "black"}
                  />
                </View>
                <View>
                  <AntDesign name="star" size={24} color="white" />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.commentBox}>
              <TextInput
                style={styles.commentInput}
                placeholder="Write a comment..."
                value={postStates[item.id].commentText}
                onChangeText={(text) =>
                  setPostStates((prevState) => ({
                    ...prevState,
                    [item.id]: { ...prevState[item.id], commentText: text },
                  }))
                }
              />
              <TouchableOpacity style={styles.postButton} onPress={() => addComment(item.id)}>
                <Text style={styles.postButtonText}>Post</Text>
              </TouchableOpacity>
            </View>

            {postStates[item.id].showComments &&
              postStates[item.id].comments.map((comment, index) => (
                <Text key={index} style={styles.commentText}>💬 {comment}</Text>
              ))
            }
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
    // padding: 20,
    // backgroundColor: '#ff6600',
    // borderBottomLeftRadius: 20,
    // borderBottomRightRadius: 20,
  },
  icon: {
    position: "relative",
    width: "150%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff6600"
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 100,
    borderWidth: 5,
    borderColor: '#fff',
    marginTop: 100,
    backgroundColor: "#fff"
  },
  editicon: {
    position: "absolute",
    bottom: 0,
    right: 5,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#ff6600",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "black",
  },
  commentCount: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  statLabel: {
    fontSize: 14,
    color: '#000',
  },
  starIconButton: {
    backgroundColor: "#FF7622",
    padding: 8,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  name: { fontSize: 18, fontWeight: 'bold', color: '#000', marginTop: 70 },
  instaname: { fontSize: 14, color: 'gray', padding: 10 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '60%', marginVertical: 10 },
  stat: { textAlign: 'center', color: '#fff', right: 40 },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  followButton: { backgroundColor: '#fff', padding: 10, borderRadius: 5 },
  messageButton: { borderWidth: 1, borderColor: '#fff', padding: 10, borderRadius: 5, fontWeight: 'bold' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  buttonFollowText: { color: 'black', fontWeight: 'bold' },
  tabContainer: { fontWeight: 'semibold', flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#ddd' },
  tab: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 5, fontWeight: 'semibold' },
  postContainer: { padding: 15, borderBottomWidth: 1, borderColor: '#ddd' },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  profileThumb: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  postUser: { fontWeight: 'bold' },
  postTime: { fontSize: 12, color: '#666' },
  postImage: { width: '100%', height: 200, borderRadius: 10 },
  postCaption: { marginTop: 5 },
  interactionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  leftIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  likeButton: {
    padding: 8,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "transparent",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  liked: {
    backgroundColor: "#eb5757",
    borderColor: "#eb5757",
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  saveButton: {
    padding: 5,
  },
  socialIcons: {
    height: 30,
    width: 30,
    resizeMode: "contain",
  },
  socialContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 20,
  },
  commentBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 10,
    backgroundColor: "#f9f9f9",
  },
  commentInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    fontSize: 14,
    color: "#333",
  },
  commentButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 0,
  },
  postCommentButton: {
    backgroundColor: "#ff6600",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginLeft: 10,
  },

  postCommentText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  commentInput: { flex: 1, paddingHorizontal: 10, fontSize: 14, color: "#333" },
  postButton: { backgroundColor: "#ff6600", paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, marginLeft: 10 },
  postButtonText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  commentText: { fontSize: 14, color: "#555", marginTop: 5 },
  bookmarkButton: {
    padding: 2,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "white",
  },

  bookmarkInner: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },

  bookmarked: {
    backgroundColor: "orange",
  },
  followingButton: {
    backgroundColor: "#ddd",
  },

  followingText: {
    color: "black",
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    width: "45%",
    borderRadius: 25,
    paddingHorizontal: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  facebookButton: {
    backgroundColor: "#1877F2",
  },
  instagramButton: {
    backgroundColor: "#E1306C",
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    resizeMode: "contain",
  },
  socialText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
  },
  horizontalLine: {
    width: "90%",
    height: 1,
    backgroundColor: "#D3D3D3",
    marginVertical: 25,
    alignSelf: "center",
  },
  connectText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});

export default InfluProfile; 
