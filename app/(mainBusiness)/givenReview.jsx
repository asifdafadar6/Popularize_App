import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator
} from "react-native";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const { width } = Dimensions.get("window");

export default function ReviewSection() {
  const [selectedTab, setSelectedTab] = useState("Popular");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [influId, setInfluId] = useState(null);

  const router = useRouter();

  useEffect(() => {
    getUserId();
  }, []);

  const getUserId = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const storedInfluId = await AsyncStorage.getItem("influId");
      const storedToken = await AsyncStorage.getItem("userToken");

      if (userId) {
        setLoggedInUserId(userId);
      }
      if (storedInfluId) {
        setInfluId(storedInfluId); 
      }
    } catch (error) {
      console.error("Error retrieving user ID:", error);
    }
  };

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://popularizenode.apdux.tech/api/getAllreview`);
      if (response.data && response.data.alldata) {
        const filteredReviews = response.data.alldata.filter(
          (review) => review.recivedreviewId?._id === influId
        );
        setReviews(filteredReviews);
      } else {
        Alert.alert("Error", "Failed to load reviews.");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      Alert.alert("Error", "Something went wrong while fetching reviews.");
    } finally {
      setLoading(false);
    }
  };
  

  useFocusEffect(
    useCallback(() => {
      if (influId) {
        fetchReviews();
      }
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
            const token = await AsyncStorage.getItem("userToken"); // Fetch token

            if (!token) {
              Alert.alert("Error", "Authentication token not found.");
              return;
            }

            await axios.delete(`https://popularizenode.apdux.tech/api/deletereview/${reviewId}`, {
              headers: { Authorization: `Bearer ${token}` }, // Pass token in headers
            });

            fetchReviews(); // Reload reviews after deletion
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

  const getSortedReviews = () => {
    if (selectedTab === "Recent") {
      return [...reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return reviews;
  };

  const givenReview = ({ item }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={{ flexDirection: "row", flex: 1 }}>
          {[...Array(item.rating)].map((_, index) => (
            <FontAwesome key={index} name="star" size={14} color="#FFA500" />
          ))}
          <Text style={styles.username}> {item?.userId?.userName || item?.userId?.brandName || "Anonymous"}</Text>
          <Text style={styles.timestamp}> • {item.timeAgo || "Just now"}</Text>
        </View>

        {loggedInUserId === item?.userId?._id && item?.userId?.role === "business" && (
          <TouchableOpacity onPress={() => setMenuVisible(menuVisible === item._id ? null : item._id)}>
            <Entypo name="dots-three-vertical" size={18} color="black" />
          </TouchableOpacity>
        )}

        {menuVisible === item._id && loggedInUserId === item?.userId?._id && (
          <View style={styles.menuContainer}>
            <TouchableOpacity onPress={() => editReview(item._id)} style={styles.menuItem}>
              <Text style={styles.menuText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteReview(item._id)} style={styles.menuItem}>
              <Text style={styles.menuText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

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
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="angle-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reviews</Text>
      </View>

      <View style={styles.ratingSummary}>
        <View style={{ flexDirection: "row", alignItems: "left" }}>
          {[...Array(5)].map((_, index) => (
            <FontAwesome key={index} name="star" size={20} color="#FFA500" />
          ))}
        </View>
        <Text style={styles.averageRating}> 4.8</Text>
      </View>
      <Text style={styles.reviewCount}>{reviews.length} Reviews</Text>

      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setSelectedTab("Popular")}>
          <Text style={[styles.tab, selectedTab === "Popular" && styles.activeTab]}>Popular</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedTab("Recent")}>
          <Text style={[styles.tab, selectedTab === "Recent" && styles.activeTab]}>Recent</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FFA500" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={getSortedReviews()}
          renderItem={givenReview}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        />
      )}

      <TouchableOpacity style={styles.writeReviewButton} onPress={() => router.push('/reviewSection')}>
        <Text style={styles.writeReviewText}>WRITE A REVIEW</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: { flexDirection: "row", alignItems: "center", padding: 16, borderBottomWidth: 1, borderBottomColor: "#EAEAEA" },
  headerTitle: { fontSize: 18, fontWeight: "bold", marginLeft: 12, flex: 1 },
  ratingSummary: { flexDirection: "row", alignItems: "left", justifyContent: "left", marginTop: 16, marginLeft: 10 },
  averageRating: { fontSize: 20, fontWeight: "bold", marginLeft: 8 },
  reviewCount: { textAlign: "left", fontSize: 14, color: "gray", marginBottom: 16, marginLeft: 10 },
  tabs: { flexDirection: "row", justifyContent: "center", borderBottomWidth: 1, borderBottomColor: "#EAEAEA", marginBottom: 8 },
  tab: { fontSize: 16, fontWeight: "bold", marginHorizontal: 16, paddingBottom: 8, color: "gray" },
  activeTab: { color: "#F36F21", borderBottomWidth: 2, borderBottomColor: "#F36F21" },
  reviewCard: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#EAEAEA" },
  reviewHeader: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  username: { fontSize: 14, fontWeight: "bold", marginLeft: 6 },
  timestamp: { fontSize: 12, color: "gray" },
  reviewText: { fontSize: 14, color: "black", marginBottom: 8 },
  feedbackRow: { flexDirection: "row", alignItems: "center" },
  feedbackButton: { flexDirection: "row", alignItems: "center", marginRight: 16 },
  feedbackText: { fontSize: 12, color: "gray", marginLeft: 4 },
  writeReviewButton: { backgroundColor: "#F36F21", paddingVertical: 12, alignItems: "center", margin: 16, borderRadius: 8 },
  writeReviewText: { color: "white", fontWeight: "bold", fontSize: 16 },
  menuContainer: { position: "absolute", right: 0, top: 25, backgroundColor: "white", padding: 5, borderRadius: 5, elevation: 5 },
  menuItem: { padding: 5 },
  menuText: { fontSize: 14, color: "black" },
});
