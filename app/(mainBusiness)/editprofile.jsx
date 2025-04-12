import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { Feather, AntDesign } from "@expo/vector-icons";

const EditProfileScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [profile, setProfile] = useState({
    userName: "",
    userEmail: "",
    intraID: "",
    companyName: "",
    brandName: "",
    gstNumber: "",
    profileImage: "",
    role: "",
    type: "",
  });

  useEffect(() => {
    const fetchUserIdAndProfile = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) {
          console.log("Fetched User ID:", storedUserId);
          setUserId(storedUserId);
          await fetchProfile(storedUserId);
        } else {
          Alert.alert("Error", "User ID not found.");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching userId:", error);
        Alert.alert("Error", "Something went wrong.");
        setLoading(false);
      }
    };

    fetchUserIdAndProfile();
  }, []);

  const fetchProfile = async (id) => {
    try {
      console.log(`Fetching profile for userId: ${id}`);
      const response = await axios.get(`https://popularizenode.apdux.tech/api/viewprofilebyid/${id}`);
      if (response.status === 200 && response.data?.userDetails) {
        console.log(response.data.userDetails);
        setProfile(response.data.userDetails);
      } else {
        Alert.alert("Error", "Profile not found.");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      Alert.alert("Error", "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name, value) => {
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfile((prev) => ({ ...prev, profileImage: result.assets[0].uri }));
    }
  };

  const handleSave = async () => {
    if (!userId) {
      Alert.alert("Error", "User ID is missing.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("companyName", profile.companyName);
      formData.append("brandName", profile.brandName);
      formData.append("userEmail", profile.userEmail);
      formData.append("gstNumber", profile.gstNumber);
      formData.append("intraID", profile.intraID);

      if (profile.profileImage && profile.profileImage.startsWith("file://")) {
        formData.append("profileImage", {
          uri: profile.profileImage,
          name: "profile.jpg",
          type: "image/jpeg",
        });
      }
      console.log('profile image:', profile.profileImage);

      console.log(`Updating profile for userId: ${userId}`);

      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await axios.put(`https://popularizenode.apdux.tech/api/editprofile/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        Alert.alert("Success", "Profile updated successfully!");
        router.back();
      } else {
        Alert.alert("Error", "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#ff6600" style={{ flex: 1, justifyContent: "center" }} />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backArrow} onPress={() => router.back()}>
        <Feather name="arrow-left" size={24} color="orange" />
      </TouchableOpacity>
      <Text style={styles.header}>Edit Profile</Text>

      <View style={styles.profileContainer}>
        <Image source={{ uri: profile.profileImage || require("../../assets/images/alterprofile.png") }} style={styles.profileImage} />
        <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
          <Feather name="edit-2" size={16} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>COMPANY NAME</Text>
        <TextInput style={styles.input} value={profile.companyName} onChangeText={(text) => handleChange("companyName", text)} />

        <Text style={styles.label}>BRAND NAME</Text>
        <TextInput style={styles.input} value={profile.brandName || profile.userName} onChangeText={(text) => handleChange("brandName", text)} />

        <Text style={styles.label}>USER EMAIL</Text>
        <TextInput style={styles.input} value={profile.userEmail} onChangeText={(text) => handleChange("userEmail", text)} />

        <Text style={styles.label}>GST NUMBER</Text>
        <TextInput style={styles.input} value={profile.gstNumber} onChangeText={(text) => handleChange("gstNumber", text)} />

        <Text style={styles.label}>INSTAGRAM ID</Text>
        <TextInput style={styles.input} value={profile.intraID} onChangeText={(text) => handleChange("intraID", text)} />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>SAVE</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <AntDesign name="left" size={24} color="#ff6600" style={{ marginRight: 5, position: "relative", top: 10 }} />
          <Text style={styles.backText}>BACK TO PROFILE</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};



const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', backgroundColor: '#f8f8f8', padding: 40 },
  backArrow: { position: 'absolute', left: 20, top: 40 },
  header: { fontSize: 20, fontWeight: 'bold', marginTop: 0, marginBottom: 20 },
  profileContainer: { position: 'relative', marginBottom: 10 },
  profileImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: '#ff6600' },
  editIcon: { position: 'absolute', bottom: 5, right: 5, backgroundColor: '#ff6600', padding: 6, borderRadius: 15 },
  form: { width: '100%', backgroundColor: 'white', padding: 20, borderRadius: 15 },
  label: { fontSize: 12, fontWeight: 'bold', color: 'black', marginBottom: 5 },
  input: { width: '100%', backgroundColor: '#f2f2f2', padding: 15, borderRadius: 10, marginBottom: 10 },
  saveButton: { backgroundColor: '#ff6600', padding: 15, borderRadius: 10, alignItems: 'center', width: '100%', marginTop: 10 },
  saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  backText: { color: '#ff6600', marginTop: 20, fontSize: 14, fontWeight: 'bold' },
});

export default EditProfileScreen;