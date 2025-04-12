import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { Alert } from "react-native";

const Signup = () => {
  const { userType } = useLocalSearchParams();

  const [formData, setFormData] = useState({
    companyName: "",
    brandName: "",
    gstNumber: "",
    userEmail: "",
    userPassword: "",
    intraID: "",
    role: userType || "business",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (name, value) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSignup = async () => {
    const { companyName, brandName, gstNumber, userEmail, userPassword, intraID, role } = formData;
  
    if (!companyName || !brandName || !gstNumber || !userEmail || !userPassword || !intraID) {
      setErrorMsg("All fields are required.");
      return;
    }
  
    setLoading(true);
    setErrorMsg("");
  
    try {
      const payload = { companyName, brandName, gstNumber, userEmail, userPassword, intraID, role };
      console.log("Sending Payload:", payload);
  
      const response = await axios.post(
        "https://popularizenode.apdux.tech/api/registration",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
  
      console.log("Signup Successful:", response.data);
      Alert.alert("Success", "You have registered successfully", [{ text: "OK", onPress: () => router.push("/(authBusiness)") }]);
  
    } catch (error) {
      // console.error("Signup Error:", error.response ? error.response.data : error.message);
  
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
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>SIGN UP {userType}</Text>
          <Text style={styles.subtitle}>Please Sign Up to your account</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>COMPANY NAME</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter company name"
            value={formData.companyName}
            onChangeText={(text) => handleChange("companyName", text)}
          />

          <Text style={styles.label}>BRAND NAME</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter brand name"
            value={formData.brandName}
            onChangeText={(text) => handleChange("brandName", text)}
          />

          <Text style={styles.label}>GST NUMBER</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter GST number"
            value={formData.gstNumber.toString()}
            onChangeText={(text) => handleChange("gstNumber", text)}
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
            placeholder="Enter Instagram ID"
            value={formData.intraID}
            onChangeText={(text) => handleChange("intraID", text)}
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

          <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
            {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>SIGN UP</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/(authBusiness)")}>
            <Text style={styles.footerText}>
              Already have an account? <Text style={styles.loginText}>LOG IN</Text>
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
  loginText: {
    color: "#FF6600",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
});

export default Signup;
