import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, Switch, StatusBar, Image, StyleSheet } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as WebBrowser from 'expo-web-browser';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const index = () => {
  const [userEmail, setUserEmail] = useState("");
  const [password, setUserPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
 
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();

  const redirectUri = AuthSession.makeRedirectUri({
    useProxy: true, 
    native: "com.soham10.popularize:/oauthredirect", 
  });
  
  useEffect(() => {
    console.log("Redirect URI:", redirectUri);
  }, []);
  
  useEffect(() => {
    console.log("Google Redirect URI:", 
      AuthSession.makeRedirectUri({
        useProxy: true,
        native: "com.soham10.popularize:/oauthredirect"
      })
    );
  }, []);

  const [request, response, promptAsync] = Facebook.useAuthRequest({
    clientId: "1181811056633055",
    // scopes: ["public_profile", "email"],
    // redirectUri: AuthSession.makeRedirectUri({
    //   useProxy: true,
    //   native: "com.soham10.popularize:/oauthredirect"
    // }),
  });
  
  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    clientId: "1181811056633055.apps.googleusercontent.com",
    redirectUri: AuthSession.makeRedirectUri({
      useProxy: true,
      native: "com.soham10.popularize:/oauthredirect"
    }),
    scopes: ["openid", "profile", "email"],
  }); 

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      handleFacebookLogin(code);
    }
  }, [response]);

  useEffect(() => {
    if (googleResponse?.type === "success") {
      handleGoogleLogin(googleResponse.authentication.accessToken);
    }
  }, [googleResponse]);

  const handleFacebookLogin = async (code) => {
    try {
      setLoading(true);
  
      const redirectUri = AuthSession.makeRedirectUri({
        useProxy: __DEV__, 
        native: "com.soham10.popularize:/oauthredirect",
      });
  
      console.log("Using redirect URI:", redirectUri);
  
      const tokenResponse = await fetch(
        `https://graph.facebook.com/v13.0/oauth/access_token?` +
          `client_id=1181811056633055&` +
          `redirect_uri=${encodeURIComponent(redirectUri)}&` +
          `client_secret=99f0ad6df2543ed81c351e20ed8cb061&` +
          `code=${code}`
      );
  
      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        console.error("Facebook token error:", errorData);
        throw new Error(errorData.error?.message || "Failed to fetch Facebook access token");
      }
  
      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;
  
      const userInfoResponse = await fetch(
        `https://graph.facebook.com/v13.0/me?fields=id,name,email,picture&access_token=${accessToken}`
      );
  
      if (!userInfoResponse.ok) {
        throw new Error("Failed to fetch Facebook user info");
      }
  
      const userInfo = await userInfoResponse.json();
  
      console.log("Facebook User Info:", userInfo);
  
      await AsyncStorage.setItem("userFacebookInfo", JSON.stringify(userInfo));
  
      Alert.alert("Login Success", `Welcome, ${userInfo.name}!`);
      router.push("(tabsinflu)");
    } catch (error) {
      console.error("Facebook Login Error:", error);
      Alert.alert("Error", error.message || "Failed to log in with Facebook.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (token) => {
    try {
      setLoading(true);
  
      if (!token) {
        throw new Error("Google token is missing");
      }
  console.log('token',token);
  
      const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Google API error: ${response.status} - ${errorText}`);
      }
  
      const userInfo = await response.json();
  
      if (!userInfo || !userInfo.email) {
        throw new Error("Invalid user information received from Google");
      }
  
      await AsyncStorage.setItem("userGoogleInfo", JSON.stringify(userInfo));
  
      console.log("User info saved successfully:", userInfo);
  
      router.push("(tabsinflu)");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
  
      Alert.alert("Login Error", error.message || "Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const fbUri = AuthSession.makeRedirectUri({
      useProxy: true,
      native: "com.soham10.popularize:/oauthredirect"
    });
    const googleUri = AuthSession.makeRedirectUri({
      useProxy: true,
      native: "com.soham10.popularize:/oauthredirect" 
    });
    
    console.log("Facebook Redirect URI:", fbUri);
    console.log("Google Redirect URI:", googleUri);
  }, []);

  const handleLogin = async () => {
    if (!userEmail || !password) {
      setErrorMsg("Email and password are required.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const payloads = { userEmail, password };
      console.log("Sending Payload:", payloads);

      const response = await axios.post(
        "https://popularizenode.apdux.tech/api/login",
        payloads,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Login Successful:", response.data);

      const { payload, token } = response.data;

      if (payload && token) {
        console.log("User ID:", payload.id);
        console.log("User Role:", payload.role);
        console.log("JWT Token:", token);

        if (payload.role === "business") {
          Alert.alert("Access Denied", "Business accounts cannot log in as influencer.");
          setLoading(false);
          return;
        }

        try {
          await AsyncStorage.setItem("userinfluId", String(payload.id));
          await AsyncStorage.setItem("userInfluToken", token);
          console.log("User ID & Token stored successfully.");
        } catch (storageError) {
          console.error("Failed to store data in AsyncStorage:", storageError);
        }
      } else {
        console.warn("Invalid data received. Skipping storage.");
      }

      router.push("(tabsinflu)");

    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      setErrorMsg("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FF6600" />

      <View style={styles.header}>
        <Text style={styles.title}>LOG IN</Text>
        <Text style={styles.subtitle}>Please log in to your account</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>EMAIL</Text>
        <TextInput
          style={styles.input}
          placeholder="example@gmail.com"
          keyboardType="email-address"
          value={userEmail}
          onChangeText={setUserEmail}
        />

        <Text style={styles.label}>PASSWORD</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="****"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setUserPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="gray" />
          </TouchableOpacity>
        </View>

        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

        <View style={styles.rememberForgotContainer}>
          <View style={styles.checkboxContainer}>
            <Switch value={rememberMe} onValueChange={setRememberMe} />
            <Text style={styles.rememberText}>Remember me</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/Emailpassword')}>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>LOG IN</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text style={styles.footerText}>
            Don't have an account? <Text style={styles.loginText}>SIGN UP</Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.socialContainer}>
          <TouchableOpacity
            onPress={() => promptAsync()}
            disabled={!request}
            style={[styles.socialButton, styles.facebookButton]}
          >
            <Image
              source={require('../../assets/images/facebook.png')}
              style={styles.socialIcon}
            />
            <Text style={styles.socialButtonText}>Log in with Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => googlePromptAsync()}
            disabled={!googleRequest}
            style={[styles.socialButton, styles.googleButton]}
          >
            <Image
              source={require('../../assets/images/google.png')}
              style={styles.socialIcon}
            />
            <Text style={styles.socialButtonText}>Log in with Google</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
    marginBottom: 80,
    marginTop: 200,
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
    backgroundColor: "#FFFFFF",
    width: "100%",
    padding: 20,
    borderTopEndRadius: 15,
    borderTopStartRadius: 15,
    alignSelf: "center",
    height: "80%",
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
    padding: 20,
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
  socialContainer: {
    flexDirection: "colomn",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 30,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 38,
    borderRadius: 8,
    elevation: 3,
  },
  facebookButton: {
    backgroundColor: "#1877F2",
  },
  googleButton: {
    backgroundColor: "#DB4437",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 48,
    borderRadius: 8,
    elevation: 3,
  },
  socialIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
    marginRight: 10,
  },
  socialButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default index;
