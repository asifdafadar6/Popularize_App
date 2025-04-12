import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import axios from "axios";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForget = async () => {
    if (!email) {
        Alert.alert("Error", "Please enter your email address.");
        return;
    }
// Test 
    try {
        setLoading(true);
        const response = await axios.post("https://popularizenode.apdux.tech/api/confirmemail", {
            userEmail: email,
        });

        console.log("UserEmail Token:", response.data.token); 

        if (response.data.success) {
            Alert.alert("Success", "OTP sent to your email.");
            router.push({
                pathname: "/otpverify",
                params: { token: response.data.token, email: email }, 
            });
        } else {
            Alert.alert("Error", response.data.message || "Failed to send OTP.");
        }
    } catch (error) {
        Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
        setLoading(false);
    }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.label}>Enter Email Address</Text>
      <TextInput
        style={styles.input}
        placeholder="example@gmail.com"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity>
        <Text style={styles.backToSignIn}>Back to sign in</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleForget} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send</Text>}
      </TouchableOpacity>

      <Text style={styles.orText}>or</Text>

      <View style={styles.socialIcons}>
        <FontAwesome name="facebook" size={24} color="#3b5998" />
        <FontAwesome name="google" size={24} color="#db4a39" style={styles.iconSpacing} />
        <FontAwesome name="apple" size={24} color="#000" style={styles.iconSpacing} />
      </View>

      <Text style={styles.accountText}>Do you have an account?</Text>
      <TouchableOpacity style={styles.signUpButton}>
        <Text style={styles.signUpText}>Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 70,
  },
  label: {
    alignSelf: "flex-start",
    marginBottom: 10,
    fontSize: 16,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 15,
  },
  backToSignIn: {
    color: "gray",
    marginBottom: 10,
  },
  button: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#ff6a00",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  orText: {
    marginVertical: 10,
    color: "gray",
  },
  socialIcons: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  iconSpacing: {
    marginLeft: 15,
  },
  accountText: {
    color: "gray",
  },
  signUpButton: {
    marginTop: 10,
    width: "100%",
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#ff6a00",
    borderRadius: 10,
    alignItems: "center",
  },
  signUpText: {
    color: "#ff6a00",
    fontWeight: "bold",
  },
});

export default ForgotPasswordScreen;