import React, { useState } from "react";
import { 
  View, Text, TextInput, ScrollView, StyleSheet, 
  TouchableOpacity, Image, Alert 
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { router } from "expo-router";

export default function EditOffersInflu({ navigation }) {
  const [offerName, setOfferName] = useState("");
  const [reward, setReward] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [branchCode, setBranchCode] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [imageUri, setImageUri] = useState(null);

  const pickImage = () => {
    const options = {
      mediaType: "photo",
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        Alert.alert("Cancelled", "You did not select any image.");
      } else if (response.errorMessage) {
        Alert.alert("Error", response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const handleSave = () => {
    console.log({
      offerName,
      reward,
      description,
      dueDate,
      couponCode,
      branchCode,
      contactInfo,
      imageUri,
    });
    Alert.alert("Success", "Offer details saved successfully!");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>← Edit Offer</Text>
      </TouchableOpacity>

      {renderInputField("OFFER NAME", offerName, setOfferName)}
      {renderInputField("REWARD", reward, setReward)}
      {renderInputField("DESCRIPTION", description, setDescription)}
      {renderInputField("DUE DATE", dueDate, setDueDate)}
      {renderInputField("COUPON CODE", couponCode, setCouponCode)}
      {renderInputField("BRANCH CODE", branchCode, setBranchCode)}
      {renderInputField("CONTACT INFO", contactInfo, setContactInfo)}

      <View style={styles.imageContainer}>
        <Text style={styles.label}>OFFER IMAGE</Text>
        <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <Text style={styles.imageText}>📷 Choose Image</Text>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <TouchableOpacity onPress={()=>{
                    router.push("/adduser")
                  }}>
                    <Text style={styles.saveText}>SAVE</Text>
                  </TouchableOpacity>
        
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton}> 
        <Text style={styles.deleteText}>🗑 DELETE</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const renderInputField = (label, value, setValue) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput 
      style={styles.input} 
      value={value} 
      onChangeText={setValue} 
      placeholder={`Enter ${label.toLowerCase()}`} 
      placeholderTextColor="#888" 
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  backButton: {
    marginBottom: 20,
  },
  backText: {
    fontSize: 16,
    color: "#FF7F27",
    fontWeight: "bold",
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#F2F4F7",
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    color: "#333",
  },
  imageContainer: {
    marginBottom: 20,
  },
  imageBox: {
    backgroundColor: "#F2F4F7",
    height: 150,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  imageText: {
    color: "#888",
    fontSize: 14,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: "#FF7F27",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    marginTop: 10,
    alignItems: "center",
  },
  deleteText: {
    color: "#FF7F27",
    fontSize: 14,
    fontWeight: "bold",
  },
});

