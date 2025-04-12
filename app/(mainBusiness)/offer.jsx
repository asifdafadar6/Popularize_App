import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, ActivityIndicator } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

export default function OfferDetails() {
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOfferDetails = async () => {
      try {
        const offerId = await AsyncStorage.getItem("selectedOfferId");
        console.log('offer id', offerId);

        if (!offerId) {
          setError("No offer selected.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`https://popularizenode.apdux.tech/api/getOfferById/${offerId}`);
        if (response.data.success) {
          setOffer(response.data.data);
        } else {
          setError("Failed to retrieve offer.");
        }
      } catch (error) {
        setError("Error fetching offer: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOfferDetails();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topBackground} />
      <Text style={styles.title}>POPULARIZE</Text>
      <Text style={styles.subtitle}>TAG, PROMOTE, SUCCEED</Text>

      {loading ? (
        <ActivityIndicator size="large" color="orange" style={{ marginTop: 20 }} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <View style={styles.card}>
          <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <AntDesign name="close" size={24} color="gray" />
          </TouchableOpacity>

          <Image
            source={offer.offerImg ? { uri: offer.offerImg } : require("../../assets/images/offerImg.png")}
            style={styles.offerIcon}
          />

          <Text style={styles.offerTitle}>{offer.offerName}</Text>
          <Text style={styles.dueDate}>Due Date - {offer.offerExpireDate}</Text>
          {/* <Text style={styles.couponCode}>Discount: {offer.discount || "N/A"}%</Text> */}
          <Text style={styles.offerText}>
            Use the coupon to get{" "}
            <Text style={styles.couponCode}>{offer.discount || "N/A"}%</Text> discount
          </Text>
          <Text style={styles.offerText}>Use this offer before it expires!</Text>

          <TouchableOpacity style={styles.gotItButton} onPress={() => router.push("/ClaimSuccessful")}>
            <Text style={styles.gotItText}>GOT IT</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  topBackground: {
    position: "absolute",
    top: 0,
    width: width,
    height: height * 0.4,
    backgroundColor: "#F36F21",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
    bottom: 25
  },
  subtitle: {
    fontSize: 12,
    color: "white",
    marginBottom: 20,
    bottom: 25
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
    width: 80,
    height: 80,
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
    // marginBottom: 5,
    padding: 10
  },
  offerText: {
    fontSize: 18,
    textAlign: "center",
    color: "black",
    paddingTop: 5,
    paddingBottom: 20,
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

