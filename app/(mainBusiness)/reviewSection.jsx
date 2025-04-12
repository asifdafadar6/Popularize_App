import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";

const { width, height } = Dimensions.get("window");

export default function ReviewSection() {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [links, setLinks] = useState([""]); 
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const { influencerId } = useLocalSearchParams();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        const storedToken = await AsyncStorage.getItem("userToken");

        if (storedUserId && storedToken) {
          setUserId(storedUserId);
          setToken(storedToken);
        } else {
          Alert.alert("Error", "User not authenticated. Please log in again.");
          router.push("/login");
        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
        Alert.alert("Error", "Failed to load user data. Please try again.");
      }
    };

    fetchUserData();
  }, []);

  const handleLinkChange = (text, index) => {
    const newLinks = [...links];
    newLinks[index] = text;
    setLinks(newLinks);
  };

  const addLinkField = () => {
    setLinks([...links, ""]);
  };

  const removeLinkField = (index) => {
    if (links.length > 1) {
      const newLinks = [...links];
      newLinks.splice(index, 1);
      setLinks(newLinks);
    }
  };

  const handleSubmit = async () => {
    if (!userId || !token || !influencerId) {
      Alert.alert("Error", "Missing required information. Please try again.");
      return;
    }
  
    if (rating === 0) {
      Alert.alert("Error", "Please give a rating before submitting.");
      return;
    }
  
    const emptyLinks = links.some(link => !link.trim());
    if (emptyLinks) {
      Alert.alert("Error", "All link fields are mandatory. Please fill them all.");
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await axios.post(
        "https://popularizenode.apdux.tech/api/givereview",
        {
          userId,
          rating,
          review: reviewText.trim(),
          link: links.map(link => ({ link: link.trim() })),
          recivedreviewId: influencerId,
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
        router.back();
      } else {
        Alert.alert("Error", response.data.message || "Failed to submit review.");
      }
    } catch (error) {
      console.error("Error submitting review:", error?.response?.data || error);
      const errorMessage = error.response?.data?.message || "An error occurred while submitting your review.";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.topBackground} />

        <Text style={styles.title}>POPULARIZE</Text>
        <Text style={styles.subtitle}>TAG, PROMOTE, SUCCEED</Text>

        <View style={styles.card}>
          <Text style={styles.header}>Rate your Experience</Text>
          <Text style={styles.subheader}>How Did You Enjoy This</Text>

          <View style={styles.starContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity 
                key={star} 
                onPress={() => setRating(star)}
                activeOpacity={0.7}
              >
                <FontAwesome
                  name={star <= rating ? "star" : "star-o"}
                  size={30}
                  color="#FFA500"
                  style={{ marginHorizontal: 5 }}
                />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Add detailed review</Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Write Review"
            multiline
            value={reviewText}
            onChangeText={setReviewText}
            textAlignVertical="top"
          />

          <Text style={styles.label}>Submission Links (required)</Text>
          {links.map((link, index) => (
            <View key={index} style={styles.linkInputContainer}>
              <TextInput
                style={[styles.input, styles.linkInput]}
                placeholder={`Submission link #${index + 1}`}
                value={link}
                onChangeText={(text) => handleLinkChange(text, index)}
                keyboardType="url"
                autoCapitalize="none"
              />
              {index === links.length - 1 ? (
                <TouchableOpacity 
                  style={styles.addButton} 
                  onPress={addLinkField}
                  disabled={loading}
                >
                  <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={styles.removeButton} 
                  onPress={() => removeLinkField(index)}
                  disabled={loading}
                >
                  <Ionicons name="close" size={24} color="red" />
                </TouchableOpacity>
              )}
            </View>
          ))}

          <TouchableOpacity
            style={[styles.submitButton, loading && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitText}>{loading ? "Submitting..." : "Submit"}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={() => router.back()}
            disabled={loading}
          >
            <Text style={styles.cancelText}>CANCEL</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#F36F21", 
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
    // borderBottomLeftRadius: 50,
    // borderBottomRightRadius: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
    bottom:25
  },
  subtitle: {
    fontSize: 12,
    color: "white",
    marginBottom: 20,
    bottom:25
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
  linkInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  linkInput: {
    flex: 1,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#FF7622",
    borderRadius: 30,     
    padding: 12,               
    justifyContent: "center",
    alignItems: "center",
     marginBottom:10
  },
  
  removeButton: {
    padding: 10,
  },
  // submitButton: {
  //   backgroundColor: "#FF7622",
  //   borderRadius: 8,
  //   padding: 15,
  //   alignItems: "center",
  //   marginTop: 20,
  // },
  // submitText: {
  //   color: "#fff",
  //   fontWeight: "bold",
  //   fontSize: 16,
  // },
  // cancelButton: {
  //   borderWidth: 1,
  //   borderColor: "#FF7622",
  //   borderRadius: 8,
  //   padding: 15,
  //   alignItems: "center",
  //   marginTop: 10,
  // },
  // cancelText: {
  //   color: "#FF7622",
  //   fontWeight: "bold",
  //   fontSize: 16,
  // },
});
