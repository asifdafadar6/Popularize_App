import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet,Switch,setRememberMe,rememberMe,Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const index= () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>LOG IN</Text>
        <Text style={styles.subtitle}>Please log in to your account</Text>
      </View>

      <View style={styles.form}>
        {/* <Text style={styles.label}>FULL NAME</Text> */}
        {/* <TextInput style={styles.input} placeholder="example@gmail.com" /> */}

        <Text style={styles.label}>EMAIL</Text>
        <TextInput style={styles.input} placeholder="example@gmail.com" keyboardType="email-address" />

        {/* <Text style={styles.label}>INSTAGRAM ID</Text> */}
        {/* <TextInput style={styles.input} placeholder="example@gmail.com" /> */}

        <Text style={styles.label}>PASSWORD</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="****"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="gray" />
          </TouchableOpacity>
        </View>
        <View style={styles.rememberForgotContainer}>
                  <View style={styles.checkboxContainer}>
                    <Switch value={rememberMe} onValueChange={setRememberMe} />
                    <Text style={styles.rememberText}>Remember me</Text>
                  </View>
                  <TouchableOpacity>
                    <Text style={styles.forgotPassword}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>

        <TouchableOpacity style={styles.button} onPress={()=>{
            router.push("/(mainBusiness)")
          }}>
          <Text style={styles.buttonText}>LOG IN</Text>

        </TouchableOpacity>

        
          <TouchableOpacity onPress={()=>{
            router.push("/signup")
          }}>
          <Text style={styles.footerText}>
         Don't have an account? <Text style={styles.loginText}>SIGN UP</Text>
          </Text>
          </TouchableOpacity>
          <View style={styles.socialContainer}>
                    <TouchableOpacity>
                      <Image source={require('../../assets/images/facebook.png')} style={styles.socialIcons}/>
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Image source={require('../../assets/images/twitter.png')} style={styles.socialIcons}/>
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Image source={require('../../assets/images/apple.png')} style={styles.socialIcons}/>
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
    marginBottom: 50,
    marginTop: 70,
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
    flex:1,
    backgroundColor: "white",
    width: "100%",
    padding: 20,
    borderRadius: 15,
    alignSelf:'center'
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberText: {
    marginLeft: 5,
    fontSize: 14,
  },
  forgotPassword: {
    color: '#ff7300',
    fontWeight: 'bold',
    fontSize: 14,
  },
  socialIcons: {
    height:30,
    width:30,
    resizeMode:"contain"
  },
  socialContainer: {
    flexDirection:'row',
    alignItems:"center",
    justifyContent:"center",
    gap:10,
marginTop:20,

  },
});

export default index;