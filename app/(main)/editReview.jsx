import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import { FontAwesome } from "@expo/vector-icons"; 
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditReview() {
  const { id } = useLocalSearchParams(); 
  const router = useRouter();

  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axios.get(`https://popularizenode.apdux.tech/api/getreviewbyreviewId/${id}`);
        const reviewArray = response.data.alldata; 
  
        console.log("Fetched review data:", reviewArray);
  
        if (Array.isArray(reviewArray) && reviewArray.length > 0) {
          const reviewData = reviewArray[0]; 
          setReviewText(reviewData.review || ""); 
          setRating(reviewData.rating || 0);
        } else {
          Alert.alert("Error", "No review found.");
        }
      } catch (error) {
        console.error("Error fetching review:", error);
        Alert.alert("Error", "Failed to fetch review details.");
      } finally {
        setLoading(false);
      }
    };
  
    if (id) {
      fetchReview();
    }
  }, [id]);

  const handleUpdate = async () => {
    if (!id) {
      Alert.alert("Error", "Invalid review ID.");
      return;
    }
  
    setLoading(true);
  
    try {
      const userinflutoken = await AsyncStorage.getItem("userInfluToken");
      const userinfluId = await AsyncStorage.getItem("userinfluId");
  
      if (!userinflutoken || !userinfluId) {
        Alert.alert("You can't edit others' reviews");
        setLoading(false);
        return;
      }
  
      const response = await axios.put(
        `https://popularizenode.apdux.tech/api/editreview/${id}`,
        {
          review: reviewText.trim(),
          rating: rating,
          userId: userinfluId,
        },
        {
          headers: {
            Authorization: `Bearer ${userinflutoken}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.data.success) {
        Alert.alert("Success", "Review updated successfully!", [
          {
            text: "OK",
            onPress: () => {
              console.log("Navigating back...");
              router.back(); // Try router.replace("/your-screen") if it still doesn't work
            },
          },
        ]);
      }
    } catch (error) {
      console.error("Error updating review:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Edit Review</Text>

      {loading ? (
        <ActivityIndicator size="large" color="orange" />
      ) : (
        <>
          <Text style={{ marginBottom: 5 }}>Your Review:</Text>
          <TextInput
            value={reviewText}
            onChangeText={setReviewText}
            multiline
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 10,
              borderRadius: 5,
              marginBottom: 10,
            }}
          />

          <Text style={{ marginBottom: 5 }}>Your Rating:</Text>
          <View style={{ flexDirection: "row", marginBottom: 20 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <FontAwesome
                  name={star <= rating ? "star" : "star-o"} 
                  size={30}
                  color="#FFA500"
                  style={{ marginHorizontal: 5 }}
                />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            onPress={handleUpdate}
            style={{
              backgroundColor: "orange",
              padding: 10,
              alignItems: "center",
              borderRadius: 5,
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>Update Review</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

