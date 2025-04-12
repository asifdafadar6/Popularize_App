import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  Alert 
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const { width, height } = Dimensions.get("window");

export default function ReviewSection() {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitLink, setSubmitLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); 

  const router = useRouter();
  const isSubmitDisabled = rating === 0 || review.trim() === "";

  const handleSubmitReview = async () => {
    if (isSubmitDisabled) return;

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("userInfluToken");
      const userinfluId = await AsyncStorage.getItem("userinfluId");

      if (!token || !userinfluId) {
        Alert.alert("Error", "User authentication failed. Please log in again.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "https://popularizenode.apdux.tech/api/givereview",
        {
          userId: userinfluId, 
          review: review.trim(),
          rating: rating, 
          submitLink: submitLink.trim()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        Alert.alert("Success", "Review submitted successfully!");
        
        setRating(0);
        setReview("");
        setSubmitLink("");

        setRefreshKey((prevKey) => prevKey + 1);
        router.back();
      } 
    } catch (error) {
      console.error("Error submitting review:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container} key={refreshKey}> 
      <View style={styles.topBackground} />

      <Text style={styles.title}>POPULARIZE</Text>
      <Text style={styles.subtitle}>TAG, PROMOTE, SUCCEED</Text>

      <View style={styles.card}>
        <Text style={styles.header}>Rate your Experience</Text>
        <Text style={styles.subheader}>How Did You Enjoy This</Text>

        <View style={styles.starContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
              <FontAwesome
                name={star <= rating ? "star" : "star-o"}
                size={24}
                color="#FFA500"
              />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Add detailed review</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your review"
          multiline
          value={review}
          onChangeText={setReview}
        />

        <TextInput
          style={styles.input}
          placeholder="Submit link here"
          value={submitLink}
          onChangeText={setSubmitLink}
        />

        <TouchableOpacity
          style={[styles.submitButton, isSubmitDisabled && styles.disabledButton]}
          disabled={isSubmitDisabled || loading}
          onPress={handleSubmitReview}
        >
          <Text style={styles.submitText}>{loading ? "Submitting..." : "Submit"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelText}>CANCEL</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    position: "relative",
  },
  topBackground: {
    position: "absolute",
    top: 0,
    width: width,
    height: height * 0.4,
    backgroundColor: "#F36F21",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
    bottom: 25,
  },
  subtitle: {
    fontSize: 12,
    color: "white",
    marginBottom: 20,
    bottom: 25,
  },
  card: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subheader: {
    fontSize: 14,
    color: "gray",
    marginBottom: 10,
  },
  starContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  submitButton: {
    width: "100%",
    backgroundColor: "#F36F21",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  submitText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#F36F21",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelText: {
    color: "#F36F21",
    fontWeight: "bold",
    fontSize: 16,
  },
});
