import React, { useState, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ActivityIndicator,
  ScrollView
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";

export default function EditOffer() {
  const { 
    offerId,
    offerName,
    discount,
    offerStartingDate,
    offerExpireDate,
    offerImg
  } = useLocalSearchParams();
  
  const [offerText, setOfferText] = useState(offerName || "");
  const [startDate, setStartDate] = useState(offerStartingDate || "");
  const [expiryDate, setExpiryDate] = useState(offerExpireDate || "");
  const [discountValue, setDiscountValue] = useState(discount || "");
  const [userId, setUserId] = useState(null);
  const [offerImage, setOfferImage] = useState(offerImg || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) {
          setUserId(storedUserId);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchUserData();
  }, []);  

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setOfferImage(result.assets[0].uri);
    }
  };

  const handleUpdateOffer = async () => {
    if (!offerText || !startDate || !expiryDate || !discountValue) {
      Alert.alert("Error", "All fields are required!");
      return;
    }
  
    if (!userId) {
      Alert.alert("Error", "User ID is missing. Please log in again.");
      return;
    }
  
    const authToken = await AsyncStorage.getItem("userToken");
    setLoading(true);
  
    const formData = new FormData();
    formData.append("offerName", offerText);
    formData.append("offerStartingDate", startDate);
    formData.append("offerExpireDate", expiryDate);
    formData.append("discount", parseFloat(discountValue));
    formData.append("userId", userId);
  
    if (offerImage && !offerImage.startsWith('http')) {
      formData.append("offerImg", {
        uri: offerImage,
        name: "offer-image.jpg",
        type: "image/jpeg",
      });
    }
  
    try {
      const response = await axios.put(
        `https://popularizenode.apdux.tech/api/editOffer/${offerId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`, 
          },
        }
      );
  
      if (response.data.success) {
        Alert.alert("Success", "Offer updated successfully!");
        router.back();
      } else {
        Alert.alert("Error", response.data.msg || "Failed to update offer.");
      }
    } catch (error) {
      // console.error("Error updating offer:", error);
      Alert.alert("You can't edit this offer.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleDateChange = (text, setDate) => {
    let formattedText = text.replace(/\D/g, "");

    if (formattedText.length > 2 && formattedText.length <= 4) {
      formattedText = `${formattedText.slice(0, 2)}/${formattedText.slice(2)}`;
    } else if (formattedText.length > 4) {
      formattedText = `${formattedText.slice(0, 2)}/${formattedText.slice(2, 4)}/${formattedText.slice(4, 8)}`;
    }

    setDate(formattedText);
  };

  return (
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.title}>Edit Offer</Text>

      <Text style={styles.label}>Offer Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter offer details"
        value={offerText}
        onChangeText={setOfferText}
      />

      <Text style={styles.label}>Start Date</Text>
      <TextInput
        style={styles.input}
        placeholder="DD/MM/YYYY"
        value={startDate}
        onChangeText={(text) => handleDateChange(text, setStartDate)}
        keyboardType="numeric"
        maxLength={10}
      />

      <Text style={styles.label}>Expiry Date</Text>
      <TextInput
        style={styles.input}
        placeholder="DD/MM/YYYY"
        value={expiryDate}
        onChangeText={(text) => handleDateChange(text, setExpiryDate)}
        keyboardType="numeric"
        maxLength={10}
      />

      <Text style={styles.label}>Discount (%)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter discount percentage"
        value={discountValue}
        onChangeText={(text) => setDiscountValue(text.replace(/[^0-9.]/g, ""))}
        keyboardType="numeric"
        maxLength={5}
      />

      <Text style={styles.label}>Offer Image</Text>
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {offerImage ? (
          <Image source={{ uri: offerImage }} style={styles.previewImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={40} color="#aaa" />
            <Text style={styles.imagePickerText}>Choose Image</Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleUpdateOffer}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Update Offer</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#FF6B00" />
        <Text style={styles.backText}>Go Back</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#FF6B00",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  imagePicker: {
    height: 150,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    overflow: "hidden",
  },
  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  imagePickerText: {
    color: "#aaa",
    marginTop: 10,
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  button: {
    backgroundColor: "#FF6B00",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  backText: {
    color: "#FF6B00",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 5,
  },
});