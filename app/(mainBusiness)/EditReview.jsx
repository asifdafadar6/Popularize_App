import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";

export default function EditReview() {
  const { id } = useLocalSearchParams(); 
  const router = useRouter();

  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [links, setLinks] = useState([{ _id: null, link: "" }]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
          throw new Error("Authentication required");
        }

        const response = await axios.get(
          `https://popularizenode.apdux.tech/api/getreviewbyreviewId/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        const reviewArray = response.data.alldata; 

        if (Array.isArray(reviewArray) && reviewArray.length > 0) {
          const reviewData = reviewArray[0]; 
          setReviewText(reviewData.review || ""); 
          setRating(reviewData.rating || 5);
          
          if (reviewData.link && Array.isArray(reviewData.link) && reviewData.link.length > 0) {
            setLinks(reviewData.link.map(item => ({ 
              _id: item._id, 
              link: item.link || "" 
            })));
          } else {
            setLinks([{ _id: null, link: "" }]);
          }
        } else {
          throw new Error("Review not found");
        }
      } catch (error) {
        console.error("Error fetching review:", error);
        Alert.alert("Error", error.message || "Failed to fetch review details.");
        router.back();
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReview();
    }
  }, [id]);

  const handleLinkChange = (text, index) => {
    const newLinks = [...links];
    newLinks[index].link = text;
    setLinks(newLinks);
  };

  const addLinkField = () => {
    if (links.length < 5) { // Limit to 5 links
      setLinks([...links, { _id: null, link: "" }]);
    } else {
      Alert.alert("Limit reached", "You can add up to 5 links maximum.");
    }
  };

  const removeLinkField = (index) => {
    if (links.length > 1) {
      const newLinks = [...links];
      newLinks.splice(index, 1);
      setLinks(newLinks);
    }
  };

  const validateURL = (url) => {
    const pattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return pattern.test(url);
  };

  const handleUpdate = async () => {
    if (!id) {
      Alert.alert("Error", "Invalid review ID.");
      return;
    }

    if (!reviewText.trim()) {
      Alert.alert("Error", "Please enter your review text.");
      return;
    }

    // if (reviewText.trim().length < 10) {
    //   Alert.alert("Error", "Review should be at least 10 characters long.");
    //   return;
    // }

    const invalidLinks = links.filter(item => !item.link.trim());
    if (invalidLinks.length > 0) {
      Alert.alert("Error", "All link fields are mandatory. Please fill them all.");
      return;
    }

    const invalidURLs = links.filter(item => !validateURL(item.link.trim()));
    if (invalidURLs.length > 0) {
      Alert.alert("Error", "Please enter valid URLs for all links.");
      return;
    }

    setSaving(true);

    try {
      const token = await AsyncStorage.getItem("userToken");
      const userId = await AsyncStorage.getItem("userId");

      if (!token || !userId) {
        Alert.alert("Authentication Error", "Please log in again.");
        router.push("/login"); 
        return;
      }

      const response = await axios.put(
        `https://popularizenode.apdux.tech/api/editreview/${id}`,
        {
          review: reviewText.trim(),
          rating: rating,
          userId: userId,
          link: links.map(item => ({ 
            _id: item._id, // Include existing _id for updates
            link: item.link.trim() 
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.msg === "Review Updated Successfully.") {
        Alert.alert("Success", "Review updated successfully!", [
          { text: "OK", onPress: () => router.back() }
        ]);
      } else {
        throw new Error(response.data.message || "Failed to update review");
      }
    } catch (error) {
      console.error("Error updating review:", error);
      Alert.alert("Error", error.message || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7622" />
        <Text style={styles.loadingText}>Loading review details...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <AntDesign name="left" size={24} color="black" />
        </TouchableOpacity>

        <View style={styles.container}>
          <Text style={styles.title}>Edit Your Review</Text>

          <Text style={styles.label}>Your Rating:</Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity 
                key={star} 
                onPress={() => setRating(star)}
                disabled={saving}
              >
                <FontAwesome
                  name={star <= rating ? "star" : "star-o"} 
                  size={32}
                  color="#FFA500"
                  style={{ marginHorizontal: 5 }}
                />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Your Review:</Text>
          <TextInput
            value={reviewText}
            onChangeText={setReviewText}
            multiline
            numberOfLines={4}
            style={styles.textInput}
            placeholder="Share your experience..."
            placeholderTextColor="#999"
            editable={!saving}
          />

          <View style={styles.linksHeader}>
            <Text style={styles.label}>Submission Links:</Text>
            <TouchableOpacity 
              onPress={addLinkField}
              disabled={saving || links.length >= 5}
              style={styles.addLinkButton}
            >
              <Text style={styles.addLinkText}>Add Link</Text>
            </TouchableOpacity>
          </View>

          {links.map((item, index) => (
            <View key={index} style={styles.linkContainer}>
              <TextInput
                value={item.link}
                onChangeText={(text) => handleLinkChange(text, index)}
                placeholder={`https://example.com/profile`}
                style={styles.linkInput}
                keyboardType="url"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!saving}
              />
              {links.length > 1 && (
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => removeLinkField(index)}
                  disabled={saving}
                >
                  <Ionicons name="close-circle" size={24} color="red" />
                </TouchableOpacity>
              )}
            </View>
          ))}

          <TouchableOpacity
            onPress={handleUpdate}
            style={[styles.submitButton, saving && styles.submitButtonDisabled]}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.submitText}>Update Review</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0", 
    alignItems: "left",
    justifyContent: "center",
    marginTop:10
  },  
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontWeight: "500",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    minHeight: 60,
  },
  ratingContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  linkInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  addButton: {
    padding: 10,
  },
  removeButton: {
    padding: 10,
  },
  submitButton: {
    backgroundColor: "orange",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  submitText: {
    color: "white",
    fontWeight: "bold",
  },
});

