import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const { width, height } = Dimensions.get("window");

export default function OfferSection() {
  
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getClaimedOffer();
  }, []);

  const getClaimedOffer = async () => {
    try {
      const offerId = await AsyncStorage.getItem('claimedOfferId');
      if (!offerId) {
        setError("No claimed offer found.");
        setLoading(false);
        return;
      }

      const response = await axios.get(`https://popularizenode.apdux.tech/api/getOfferById/${offerId}`);
      if (response.data.success) {
        setOffer(response.data.data);
      } else {
        setError("Failed to fetch offer details.");
      }
    } catch (error) {
      setError("Error retrieving offer details.");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#FF7622" style={{ marginTop: 50 }} />;
  if (error) return <Text style={styles.errorText}>{error}</Text>;

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
          source={offer?.offerImg ? { uri: offer.offerImg } : require("../../assets/images/offerImg.png")}
          style={styles.offerIcon}
        />

        <Text style={styles.offerTitle}>{offer?.offerName || "Great Offers!"}</Text>
        <Text style={styles.dueDate}>Valid till - {offer?.offerExpireDate || "N/A"}</Text>
        <Text style={styles.couponCode}>#{offer?._id?.slice(-6) || "XXXXXX"}</Text>
        <Text style={styles.offerText}>Use the coupon to get {offer?.discount || 0}% discount</Text>

        <TouchableOpacity style={styles.gotItButton} onPress={() => router.push('/successful')}>
          <Text style={styles.gotItText}>GOT IT</Text>
        </TouchableOpacity>
      </View>
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
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  offerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#F36F21",
    marginBottom: 5,
    textAlign:'center'
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
    padding:10
  },
  offerText: {
    fontSize: 18,
    textAlign: "center",
    color: "black",
    paddingTop:5,
    paddingBottom:20,
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

