import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams} from "expo-router";
import axios from "axios";

const Signup = () => {
  const { userType } = useLocalSearchParams(); 

  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    intraID: "",
    userPassword: "",
    role: userType || "influencer", 
    type: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (name, value) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSignup = async () => {
    const { userName, userEmail, intraID, userPassword, type } = formData;
  
    if (!userName || !userEmail || !intraID || !userPassword || !type) {
      setErrorMsg("All fields are required.");
      return;
    }
  
    setLoading(true);
    setErrorMsg("");
  
    try {
      const payload = {
        userName,
        userEmail,
        intraID,
        userPassword,
        role: userType || "influencer",
        type, 
      };
  
      console.log("Sending Payload:", payload);
  
      const res = await axios.post(
        "https://popularizenode.apdux.tech/api/registration",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Signup Successful:", res.data);
      Alert.alert("You have registered successfully");
      router.push("/(auth)");
    } catch (error) {
      // console.error("Signup Error:", error);
      setErrorMsg(error.response?.data?.message || "Signup failed. Please try again.");
      if (error.response && error.response.data.msg.includes("Email Already Exists")) {
              Alert.alert("Signup Failed", "This email is already registered. Please use a different email or register.", [
                { text: "OK" },
              ]);
            } 
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SIGN UP {userType}</Text>
        <Text style={styles.subtitle}>Please Sign Up to your account</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>FULL NAME</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your Name"
          value={formData.userName}
          onChangeText={(text) => handleChange("userName", text)}
        />

        <Text style={styles.label}>EMAIL</Text>
        <TextInput
          style={styles.input}
          placeholder="example@gmail.com"
          keyboardType="email-address"
          value={formData.userEmail}
          onChangeText={(text) => handleChange("userEmail", text)}
        />

        <Text style={styles.label}>INSTAGRAM ID</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your Instagram ID"
          value={formData.intraID}
          onChangeText={(text) => handleChange("intraID", text)}
        />

        <Text style={styles.label}>TYPE</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Type"
          value={formData.type}
          onChangeText={(text) => handleChange("type", text)}
        />

        <Text style={styles.label}>PASSWORD</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="****"
            secureTextEntry={!showPassword}
            value={formData.userPassword}
            onChangeText={(text) => handleChange("userPassword", text)}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="gray" />
          </TouchableOpacity>
        </View>

        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

        <TouchableOpacity
          style={styles.button}
          onPress={handleSignup}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Signing Up..." : "SIGN UP"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/(auth)")}>
          <Text style={styles.footerText}>
            Already have an account?{" "}
            <Text style={styles.loginText}>LOG IN</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FF6600",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 50,
    marginTop: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    color: "white",
    fontSize: 14,
  },
  form: {
    flex: 1,
    backgroundColor: "white",
    width: "100%",
    padding: 20,
    borderRadius: 15,
    alignSelf: "center",
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: "gray",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: "row",
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    justifyContent: "space-between",
  },
  passwordInput: {
    flex: 1,
  },
  rememberForgotContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rememberText: {
    marginLeft: 5,
    fontSize: 14,
  },
  forgotPassword: {
    color: "#ff7300",
    fontWeight: "bold",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#FF6600",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  footerText: {
    textAlign: "center",
    marginTop: 15,
    color: "gray",
  },
  loginText: {
    color: "#FF6600",
    fontWeight: "bold",
  },
  socialIcons: {
    height: 30,
    width: 30,
    resizeMode: "contain",
  },
  socialContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 20,
  },
});

export default Signup;
