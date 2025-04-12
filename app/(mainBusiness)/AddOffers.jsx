
import React, { useState, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import axios from "axios";

export default function AddOffers() {
  const [offerText, setOfferText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [discount, setDiscount] = useState("");
  const [userId, setUserId] = useState(null);
  const [offerImage, setOfferImage] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        const storedAuthToken = await AsyncStorage.getItem("userToken");
  
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

  const handleAddOffer = async () => {
    if (!offerText || !startDate || !expiryDate || !discount) {
      Alert.alert("Error", "All fields are required!");
      return;
    }
  
    if (!userId) {
      Alert.alert("Error", "User ID is missing. Please log in again.");
      return;
    }
  
    const authToken = await AsyncStorage.getItem("userToken");
  
    const formData = new FormData();
    formData.append("offerName", offerText);
    formData.append("offerStartingDate", startDate);
    formData.append("offerExpireDate", expiryDate);
    formData.append("discount", parseFloat(discount));
    formData.append("userId", userId);
  
    if (offerImage) {
      formData.append("offerImg", {
        uri: offerImage,
        name: "offer-image.jpg",
        type: "image/jpeg",
      });
    }
  
    try {
      const response = await axios.post(
        "https://popularizenode.apdux.tech/api/insertoffer",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`, 
          },
        }
      );
  
      console.log("Offer Response:", response.data);
  
      if (response.data.success) {
        Alert.alert("Success", "Offer added successfully!");
        router.back();
      } else {
        Alert.alert("Error", response.data.msg || "Failed to add offer.");
      }
    } catch (error) {
      console.error("Error adding offer:", error);
      Alert.alert("Error", "Something went wrong while adding the offer.");
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
    <ScrollView 
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Add New Offer</Text>

        <Text style={styles.label}>Offer Details</Text>
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
          value={discount}
          onChangeText={(text) => setDiscount(text.replace(/[^0-9.]/g, ""))}
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

        <TouchableOpacity style={styles.button} onPress={handleAddOffer}>
          <Text style={styles.buttonText}>Add Offer</Text>
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
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingBottom: 40, // Add extra padding at the bottom
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FF6B00",
    marginBottom: 40,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  colorContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  colorBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderColor: "#000",
  },
  button: {
    backgroundColor: "#FF6B00",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    alignSelf: "center",
  },
  backText: {
    fontSize: 16,
    color: "#FF6B00",
    marginLeft: 5,
  },
  imagePicker: { 
    marginTop: 20, 
    alignItems: "center",
    marginBottom: 20, // Add some bottom margin
  },
  imagePlaceholder: {
    width: "100%", 
    height: 150, 
    backgroundColor: "#F5F7FA", 
    justifyContent: "center", 
    alignItems: "center", 
    borderRadius: 12,
  },
  imagePickerText: { 
    color: "#888", 
    marginTop: 10 
  },
  previewImage: { 
    width: "100%", 
    height: 150, 
    borderRadius: 12 
  },
  button: { 
    backgroundColor: "#FF6B00", 
    padding: 15, 
    borderRadius: 8, 
    alignItems: "center", 
    marginTop: 20 
  },
  buttonText: { 
    color: "#fff", 
    fontWeight: "bold" 
  },
});



