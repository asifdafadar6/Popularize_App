// import React, { useEffect, useState } from 'react';
// import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
// import Feather from '@expo/vector-icons/Feather';
// import { useRouter } from "expo-router";
// import { AntDesign } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';



// const EditProfileScreen = () => {
//    const [userId, setUserId] = useState(null);
//    const [loading, setLoading] = useState(true);
//    const [profile, setProfile] = useState({
//     userName: "",
//     userEmail: "",
//     intraID: "",
//     intraID:"",
//     companyName: "",
//     brandName: "",
//     gstNumber: "",
//     profileImage: "",
//     role: "",
//      });

//   const router = useRouter(); 

//    useEffect(() => {
//       const fetchUserIdAndProfile = async () => {
//         try {
//           const storedUserId = await AsyncStorage.getItem("userinfluId");
//           if (storedUserId) {
//             console.log("Fetched User ID:", storedUserId);
//             setUserId(storedUserId);
//             await fetchProfile(storedUserId);
//           } else {
//             Alert.alert("Error", "User ID not found.");
//             setLoading(false);
//           }
//         } catch (error) {
//           console.error("Error fetching userId:", error);
//           Alert.alert("Error", "Something went wrong.");
//           setLoading(false);
//         }
//       };
  
//       fetchUserIdAndProfile();
//     }, []);

//     const fetchProfile = async (id) => {
//       try {
//         console.log(Fetching profile for userId: ${id});
//         const response = await axios.get(https://popularizenode.apdux.tech/api/viewprofilebyid/${id});
//         if (response.status === 200 && response.data?.userDetails) {
//           setProfile(response.data.userDetails);
//         } else {
//           Alert.alert("Error", "Profile not found.");
//         }
//       } catch (error) {
//         console.error("Error fetching profile:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const handleChange = (name, value) => {
//       setProfile((prev) => ({ ...prev, [name]: value }));
//     };
  
//     const pickImage = async () => {
//       let result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [1, 1],
//         quality: 1,
//       });
  
//       if (!result.canceled) {
//         setProfile((prev) => ({ ...prev, profileImage: result.assets[0].uri }));
//       }
//     };
  
//     const handleSave = async () => {
//       if (!userId) {
//         Alert.alert("Error", "User ID is missing.");
//         return;
//       }
  
//       setLoading(true);
  
//       try {
//         const formData = new FormData();
//         // formData.append("companyName", profile.companyName);
//         // formData.append("brandName", profile.brandName);
//         // formData.append("userEmail", profile.userEmail);
//         // formData.append("gstNumber", profile.gstNumber);
//         // formData.append("instaID", profile.instaID);
  
//         if (profile.profileImage) {
//           formData.append("profileImage", {
//             uri: profile.profileImage,
//             name: "profile.jpg",
//             type: "image/jpeg",
//           });
//         }
  
//         console.log(Updating profile for userId: ${userId});
  
//       //   for (const [key, value] of formData.entries()) {
//       //     console.log(key,value);
//       // }
//         const response = await axios.put(https://popularizenode.apdux.tech/api/editprofile/${userId}, profile,formData, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         });
  
//         if (response.status === 200) {
//           Alert.alert("Success", "Profile updated successfully!");
//           router.back();
//         }
//       } catch (error) {
//         router.back();
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (loading) {
//         return <ActivityIndicator size="large" color="#ff6600" style={{ flex: 1, justifyContent: "center" }} />;
//       }

    
//   return (
//     <View style={styles.container}>
//       <TouchableOpacity style={styles.backArrow} onPress={() => router.back()}>
//         <Feather name="arrow-left" size={24} color="orange" />
//       </TouchableOpacity>
//       <Text style={styles.header}>Edit Profile</Text>

//       <View style={styles.profileContainer}>
//         <Image source={require('../../assets/images/profilepic.jpg')} style={styles.profileImage} />
//         <TouchableOpacity style={styles.editIcon}>
//           <Feather name="edit-2" size={16} color="white" />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.form}>
//         <Text style={styles.label}>FULL NAME</Text>
//         <TextInput style={styles.input} value={profile.userName || profile.brandName} onChangeText={(text) => handleChange("userName", text)} placeholder="Enter your name" />

//         <Text style={styles.label}>EMAIL</Text>
//         <TextInput style={styles.input} value={profile.userEmail} onChangeText={(text) => handleChange("userEmail", text)} placeholder="wwww@gmail.com" keyboardType="email-address" />

//         <Text style={styles.label}>INSTAGRAM ID</Text>
//         <TextInput style={styles.input} value={profile.intraID} onChangeText={(text) => handleChange("intraID", text)} placeholder="Enter Instagram ID" />
//       </View>

//       <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
//         <Text style={styles.saveButtonText}>SAVE</Text>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => router.back()}>
//     <View style={{ flexDirection: "row", alignItems: "center" }}>
//         <AntDesign name="left" size={24} color="#ff6600" style={{ marginRight: 5, position: "relative", top: 10 }} />
//         <Text style={styles.backText}>BACK TO PROFILE</Text>
//     </View>
// </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, alignItems: 'center', backgroundColor: '#f8f8f8', padding: 40 },
//   backArrow: { position: 'absolute', left: 20, top: 40 },
//   header: { fontSize: 20, fontWeight: 'bold', marginTop: 40, marginBottom: 20 },
//   profileContainer: { position: 'relative', marginBottom: 20 },
//   profileImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: '#ff6600' },
//   editIcon: { position: 'absolute', bottom: 5, right: 5, backgroundColor: '#ff6600', padding: 6, borderRadius: 15 },
//   form: { width: '100%', backgroundColor: 'white', padding: 20, borderRadius: 15 },
//   label: { fontSize: 12, fontWeight: 'bold', color: 'black', marginBottom: 5 },
//   input: { width: '100%', backgroundColor: '#f2f2f2', padding: 15, borderRadius: 10, marginBottom: 10 },
//   saveButton: { backgroundColor: '#ff6600', padding: 15, borderRadius: 10, alignItems: 'center', width: '100%', marginTop: 10 },
//   saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
//   backText: { color: '#ff6600', marginTop: 20, fontSize: 14, fontWeight: 'bold' },
// });

// export default EditProfileScreen;

import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  TextInput, 
  StyleSheet, 
  ActivityIndicator, 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView 
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from "expo-router";
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker'; 

const EditProfileScreen = () => {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
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

  const router = useRouter();

  // Request permissions for image picker
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please grant permission to access your photo library.');
      }
    })();
  }, []);

  useEffect(() => {
    const fetchUserIdAndProfile = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userinfluId");
        if (storedUserId) {
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
      const response = await axios.get(`https://popularizenode.apdux.tech/api/viewprofilebyid/${id}`);
      if (response.status === 200 && response.data?.userDetails) {
        setProfile(response.data.userDetails);
      } else {
        Alert.alert("Error", "Profile not found.");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
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

      const response = await axios.put(
        `https://popularizenode.apdux.tech/api/editprofile/${userId}`, 
        formData, 
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Profile updated successfully!");
        router.back();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6600" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoidingView}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={24} color="#FF6600" />
          </TouchableOpacity>
          
          <Text style={styles.header}>Edit Profile</Text>

          <View style={styles.profileImageContainer}>
            <Image 
              source={{ 
                uri: profile.profileImage || "https://via.placeholder.com/150" 
              }} 
              style={styles.profileImage} 
            />
            <TouchableOpacity 
              style={styles.editImageButton} 
              onPress={pickImage}
              activeOpacity={0.7}
            >
              <Feather name="edit-2" size={18} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={profile.userName || profile.brandName}
                onChangeText={(text) => handleChange("userName", text)}
                placeholder="Enter your name"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={profile.userEmail}
                onChangeText={(text) => handleChange("userEmail", text)}
                placeholder="example@gmail.com"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Instagram ID</Text>
              <TextInput
                style={styles.input}
                value={profile.intraID}
                onChangeText={(text) => handleChange("intraID", text)}
                placeholder="@yourusername"
                placeholderTextColor="#999"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Influencer Type</Text>
              <TextInput
                style={styles.input}
                value={profile.type}
                onChangeText={(text) => handleChange("type", text)}
                placeholder="e.g. Fashion, Travel, Food"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.7}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.saveButtonText}>SAVE CHANGES</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.backLink}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <AntDesign name="left" size={16} color="#FF6600" />
            <Text style={styles.backLinkText}>Back to Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingTop: 50,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
    padding: 8,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#FF6600',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#FF6600',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  formContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginLeft: 5,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  saveButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#FF6600',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },
  saveButtonDisabled: {
    backgroundColor: '#FFA366',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
  },
  backLinkText: {
    color: '#FF6600',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
});

export default EditProfileScreen;