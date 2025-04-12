import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Alert, Pressable } from 'react-native';
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Entypo } from '@expo/vector-icons';

const InfluProfile = () => {
  const [followed, setFollowed] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const { influId } = useLocalSearchParams();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [menuVisible, setMenuVisible] = useState(null);

  const fetchCurrentUser = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      setCurrentUserId(userId);
    } catch (err) {
      console.error("Error fetching current user:", err);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`https://popularizenode.apdux.tech/api/viewprofilebyid/${influId}`);

      if (response.data && response.data.userDetails) {
        setUserData(response.data.userDetails);
        await fetchReviews(response.data.userDetails._id);
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

  const fetchReviews = async (influencerId) => {
    try {
      const response = await axios.get('https://popularizenode.apdux.tech/api/getAllreview');

      if (response.data && response.data.alldata) {
        const influencerReviews = response.data.alldata.filter(review =>
          review.recivedreviewId && review.recivedreviewId._id === influencerId
        );
        setReviews(influencerReviews);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCurrentUser();
      fetchProfile();
      // fetchReviews();
    }, [influId])
  );

  const deleteReview = async (reviewId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this review?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("userToken");

              if (!token) {
                Alert.alert("Error", "Authentication token not found.");
                return;
              }

              await axios.delete(`https://popularizenode.apdux.tech/api/deletereview/${reviewId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });

              fetchReviews(userData._id);
              Alert.alert("Success", "Review deleted successfully.");
            } catch (error) {
              console.error("Error deleting review:", error);
              Alert.alert("Error", "Failed to delete review.");
            }
          },
        },
      ]
    );
  };

  const editReview = (reviewId) => {
    router.push(`/EditReview?id=${reviewId}`);
  };

  const closeMenu = () => {
    setMenuVisible(null);
  };

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

  const renderReviewItem = ({ item }) => (
    <Pressable onPress={closeMenu} style={styles.reviewContainer}>
      <View style={styles.reviewHeader}>
        {item.userId && item.userId.profileImage ? (
          <Image source={{ uri: item.userId.profileImage }} style={styles.reviewerImage} />
        ) : (
          <View style={[styles.reviewerImage, styles.defaultImage]}>
            <FontAwesome name="user" size={24} color="white" />
          </View>
        )}
        <View style={styles.reviewerInfo}>
          <Text style={styles.username}>
            {item.userId ? (item.userId.companyName || item.userId.userName || 'Anonymous') : 'Anonymous'}
          </Text>
          <Text style={styles.timestamp}>{item.timeAgo}</Text>
        </View>
        <View style={styles.ratingContainer}>
          {[...Array(5)].map((_, i) => (
            <FontAwesome
              key={i}
              name={i < item.rating ? "star" : "star-o"}
              size={16}
              color="#FFD700"
            />
          ))}
        </View>
        {currentUserId === item?.userId?._id && item?.userId?.role === "business" && (
          <TouchableOpacity 
            onPress={(e) => {
              e.stopPropagation();
              setMenuVisible(menuVisible === item._id ? null : item._id);
            }}
          >
            <Entypo name="dots-three-vertical" size={18} color="black" />
          </TouchableOpacity>
        )}
      </View>
      
      {menuVisible === item._id && currentUserId === item?.userId?._id && (
        <View style={styles.menuContainer}>
          <TouchableOpacity 
            onPress={(e) => {
              e.stopPropagation();
              editReview(item._id);
              setMenuVisible(null);
            }} 
            style={styles.menuItem}
          >
            <Text style={styles.menuText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={(e) => {
              e.stopPropagation();
              deleteReview(item._id);
              setMenuVisible(null);
            }} 
            style={styles.menuItem}
          >
            <Text style={[styles.menuText, styles.deleteText]}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <Text style={styles.reviewText}>{item.review}</Text>
      <View style={styles.feedbackRow}>
        <TouchableOpacity style={styles.feedbackButton}>
          <FontAwesome name="thumbs-up" size={14} color="#FFA500" />
          <Text style={styles.feedbackText}> Helpful(0)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.feedbackButton}>
          <FontAwesome name="thumbs-down" size={14} color="gray" />
          <Text style={styles.feedbackText}> Not Helpful(0)</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );

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
                  <Text style={styles.statNumber}>{reviews.length}</Text>
                  <Text style={styles.statLabel}>Reviews</Text>
                </View>
                <View style={styles.verticalLine} />

                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>2.5k</Text>
                  <Text style={styles.statLabel}>Following</Text>
                </View>

                <View style={styles.verticalLine} />

                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>1.5m</Text>
                  <Text style={styles.statLabel}>Followers</Text>
                </View>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.followButton, followed && styles.followingButton]}
                  onPress={() => setFollowed(!followed)}
                >
                  <Text style={[styles.buttonFollowText, followed && styles.followingText]}>
                    {followed ? "Following" : "Follow"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.messageButton} 
                  onPress={() => {
                    router.push({
                      pathname: '/chatMessageBusiness',
                      params: { userId: influId },
                    });
                  }}
                >
                  <Text style={styles.buttonText}>Message</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.horizontalLine} />

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              {reviews.length === 0 && (
                <Text style={styles.noReviewsText}>No reviews yet</Text>
              )}
            </View>
          </>
        }
        data={reviews}
        keyExtractor={(item) => item._id}
        renderItem={renderReviewItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No reviews available for this influencer</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
      <TouchableOpacity 
        style={styles.writeReviewButton} 
        onPress={() => router.push({pathname:'/reviewSection',params:{influencerId:influId}})}
      >
        <Text style={styles.writeReviewText}>WRITE A REVIEW</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  header: {
    alignItems: 'center',
  },
  icon: {
    position: "relative",
    width: "100%",
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center'
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 70,
    marginBottom: 5
  },
  instaname: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 15
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginVertical: 15,
  },
  verticalLine: {
    width: 1,
    height: 40,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  statItem: {
    alignItems: 'center',
    flex: 1
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000'
  },
  statLabel: {
    fontSize: 14,
    color: 'gray',
    marginTop: 5
  },
  horizontalLine: {
    width: "90%",
    height: 1,
    backgroundColor: "#D3D3D3",
    marginVertical: 15,
    alignSelf: "center",
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginVertical: 15,
    width: '80%'
  },
  followButton: {
    backgroundColor: '#ff6600',
    padding: 12,
    borderRadius: 25,
    flex: 1,
    alignItems: 'center'
  },
  messageButton: {
    borderWidth: 1,
    borderColor: '#ff6600',
    padding: 12,
    borderRadius: 25,
    flex: 1,
    alignItems: 'center'
  },
  buttonText: {
    color: '#ff6600',
    fontWeight: 'bold',
    fontSize: 16
  },
  buttonFollowText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  followingButton: {
    backgroundColor: "#ddd",
  },
  followingText: {
    color: "black",
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingBottom: 10
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000'
  },
  noReviewsText: {
    color: 'gray',
    marginTop: 5,
    fontSize: 14
  },
  listContent: {
    paddingBottom: 80
  },
  reviewContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  reviewerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10
  },
  defaultImage: {
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center'
  },
  reviewerInfo: {
    flex: 1
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: '#000'
  },
  timestamp: {
    fontSize: 12,
    color: "gray",
    marginTop: 2
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10
  },
  reviewText: {
    fontSize: 15,
    color: "#333",
    marginBottom: 10,
    lineHeight: 20,
    marginTop: 5
  },
  feedbackRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5
  },
  feedbackButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16
  },
  feedbackText: {
    fontSize: 13,
    color: "gray",
    marginLeft: 4
  },
  writeReviewButton: {
    backgroundColor: "#F36F21",
    paddingVertical: 15,
    alignItems: "center",
    margin: 16,
    borderRadius: 25,
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5
  },
  writeReviewText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center'
  },
  emptyText: {
    color: 'gray',
    fontSize: 16,
    textAlign: 'center'
  },
  menuContainer: { 
    position: "absolute", 
    right: 0, 
    top: 40, 
    backgroundColor: "white", 
    padding: 10, 
    borderRadius: 8, 
    elevation: 5,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: 100
  },
  menuItem: { 
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  menuText: { 
    fontSize: 14, 
    color: "black" 
  },
  deleteText: {
    color: 'red'
  }
});

export default InfluProfile;