import { router } from "expo-router";
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default function Successful() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>POPULARIZE</Text>
        <Text style={styles.tagline}>TAG, PROMOTE, SUCCEDE</Text>
      </View>

      <View style={styles.card}>
        <Image source={require("../../assets/images/successful.png")} style={styles.icon} />
        <Text style={styles.title}>Offer Availed</Text>
        <Text style={styles.subtitle}>Thank You For Your Service</Text>

        <TouchableOpacity style={styles.button} onPress={()=>{router.push('/(tabsinflu)')}}>
          <Text style={styles.buttonText}>← BACK TO HOME</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#F36F21",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    backgroundColor: "#F36F21",
    width: width,
    height: height * 0.4,
    position: "absolute",
    top: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  tagline: {
    color: "white",
    fontSize: 12,
    marginTop: 4,
    fontWeight:'semibold'
  },
  card: {
    backgroundColor: "white",
    width: width * 0.85,
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
    // marginTop: height * 0.1,
    bottom:10
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    color: "#F36F21",
    fontSize: 16,
    fontWeight: "bold",
  },
});
