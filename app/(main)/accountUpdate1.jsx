import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function OfferDetails() {
  return (
    <View style={styles.container}>
      <View style={styles.topBackground} />
 <Text style={styles.title}>POPULARIZE</Text>
      <Text style={styles.subtitle}>TAG, PROMOTE, SUCCEED</Text>

      <View style={styles.card}>
        <TouchableOpacity style={styles.closeButton}>
          <AntDesign name="close" size={24} color="gray" />
        </TouchableOpacity>

        <Image
          source={{ require: ("../../assets/images/percentage.png") }} 
          style={styles.offerIcon}
        />

        <Text style={styles.offerTitle}>Great Offers!</Text>
        <Text style={styles.dueDate}>Due Date - 1/2/25</Text>
        <Text style={styles.couponCode}>#1243CD2</Text>
        <Text style={styles.offerText}>Use the coupon to get 25% discount</Text>

        <TouchableOpacity style={styles.gotItButton} onPress={()=>{router.push('/reviewSection')}}>
          <Text style={styles.gotItText}>GOT IT</Text>
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
        // paddingHorizontal: 2,
        position: "relative",
      },
      topBackground: {
        position: "absolute",
        top: 0,
        width: width,
        height: height * 0.4, 
        backgroundColor: "#F36F21",
        // borderBottomLeftRadius: 50,
        // borderBottomRightRadius: 50,
      },
      title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "white",
        marginBottom: 4,
        bottom:25
      },
      subtitle: {
        fontSize: 12,
        color: "white",
        marginBottom: 20,
        bottom:25
      },
  card: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
  },
  offerIcon: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  offerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#F36F21",
    marginBottom: 5,
  },
  dueDate: {
    fontSize: 14,
    color: "gray",
    marginBottom: 10,
  },
  couponCode: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F36F21",
    marginBottom: 5,
  },
  offerText: {
    fontSize: 18,
    textAlign: "center",
    color: "black",
    marginBottom: 15,
  },
  gotItButton: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#F36F21",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  gotItText: {
    color: "#F36F21",
    fontWeight: "bold",
    fontSize: 16,
  },
});

