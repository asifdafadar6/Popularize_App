import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";

const AddAddress = ({ navigation, route }) => {
  const router = useRouter();
  const [userId, setUserId] = useState(null); // Store userId from AsyncStorage
  const [newAddress, setNewAddress] = useState({
    name: "",
    mobile:"",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  useEffect(() => {
    const getUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) {
          setUserId(storedUserId);
        } else {
          Alert.alert("Error", "User ID not found. Please log in again.");
        }
      } catch (error) {
        console.error("Error fetching userId:", error);
      }
    };

    getUserId();
  }, []);

  const handleChange = (field, value) => {
    setNewAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!newAddress.name || !newAddress.street || !newAddress.city) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    if (!userId) {
      Alert.alert("Error", "User ID is missing. Please log in again.");
      return;
    }

    try {
      const response = await axios.post("https://popularizenode.apdux.tech/api/insertAddress", {
        fullName: newAddress.name,
        mobileNo:newAddress.mobile,
        streetAddress: newAddress.street,
        city: newAddress.city,
        state: newAddress.state,
        zipCode: newAddress.zip,
        country: newAddress.country,
        userId: userId, // Use retrieved userId from AsyncStorage
      });

      if (response.status === 200 || response.status === 201) {
        Alert.alert("Success", "Address added successfully!");
        router.back(); // Navigate back to the address list
      }
    } catch (error) {
      console.error("Error adding address:", error);
      Alert.alert("Error", "Failed to add address. Please try again.");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Add New Address</Text>

      <TextInput
        placeholder="Full Name"
        value={newAddress.name}
        onChangeText={(text) => handleChange("name", text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Street Address"
        value={newAddress.street}
        onChangeText={(text) => handleChange("street", text)}
        style={styles.input}
      />
      <TextInput
        placeholder="City"
        value={newAddress.city}
        onChangeText={(text) => handleChange("city", text)}
        style={styles.input}
      />
      <TextInput
        placeholder="State"
        value={newAddress.state}
        onChangeText={(text) => handleChange("state", text)}
        style={styles.input}
      />
      <TextInput
        placeholder="ZIP Code"
        keyboardType="numeric"
        value={newAddress.zip}
        onChangeText={(text) => handleChange("zip", text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Country"
        value={newAddress.country}
        onChangeText={(text) => handleChange("country", text)}
        style={styles.input}
      />

      <TouchableOpacity onPress={handleSubmit} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Address</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = {
  input: { borderBottomWidth: 1, padding: 10, marginBottom: 15 },
  saveButton: { backgroundColor: "#ff6600", padding: 15, borderRadius: 5, alignItems: "center" },
  saveButtonText: { color: "white", fontWeight: "bold" },
  backButton: { marginTop: 10, alignItems: "center" },
  backText: { color: "red", fontSize: 16 },
};

export default AddAddress;
