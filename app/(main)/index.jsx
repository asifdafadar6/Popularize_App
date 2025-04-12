import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ImageBackground,
  Image,
} from "react-native";
import { EvilIcons, Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import axios from "axios";

const Popularize = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      fetchOffers();
    }, [])
  );

  const backgroundImages = [
    require("../../assets/images/offerbg1.png"),
    require("../../assets/images/offerbg2.png"),
    require("../../assets/images/offerbg3.png"),
  ];

  const fetchOffers = async () => {
    try {
      const response = await axios.get("https://popularizenode.apdux.tech/api/getAllOffers");
      if (response.data.success) {
        const offersWithImages = response.data.data.map((offer, index) => ({
          ...offer,
          backgroundImage: backgroundImages[index % backgroundImages.length],
        }));
        setOffers(offersWithImages);
      } else {
        Alert.alert("Error", "Failed to retrieve offers.");
      }
    } catch (error) {
      setError("Offers are not showing due to some problem");
      console.error("Error fetching offers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOffers = offers
    .filter((offer) =>
      offer.offerName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const aMatch = a.offerName.toLowerCase().startsWith(searchQuery.toLowerCase());
      const bMatch = b.offerName.toLowerCase().startsWith(searchQuery.toLowerCase());
      return bMatch - aMatch;
    });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Image
            source={require("../../assets/images/icon10.png")}
            style={styles.logo}
          />
        </View>
        <TouchableOpacity style={styles.notificationIcon} onPress={() => { router.push('/(mainBusiness)/businessNotifications') }}>
          <Ionicons name="notifications-outline" size={24} color="orange" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <EvilIcons name="search" size={24} color="#FF7622" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search offers by name or rewards"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.offerHeader}>
        <Text style={styles.offerTitle}>Available Offers</Text>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFA500" />
        </View>
      ) : (
        <FlatList
          data={filteredOffers}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={1}
              style={styles.offerCard}
              onPress={() =>
                router.push({ pathname: "/offerDetails", params: { offerId: item._id } })
              }
            >
              <ImageBackground
                source={item.backgroundImage}
                style={styles.offerBackground}
                imageStyle={styles.offerBackgroundImage}
              >
                <View style={styles.offerDetails}>
                  <Text style={styles.offerText}>{item.offerName}</Text>
                  <Text style={styles.offerDate}>Due Date - {item.offerExpireDate}</Text>
                </View>
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: item.offerImg }}
                    style={styles.offerImage}
                    onError={(e) => console.error("Error loading image:", e.nativeEvent.error)}
                  />
                </View>
              </ImageBackground>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No offers found.</Text>
          }
        />
      )}
    </View>
  );
};

export default Popularize;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    marginBottom: 60,
  },
  header: {
    marginBottom: 30,
    // marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 80,
    resizeMode: "contain",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff6b00",
  },
  notificationIcon: {
    backgroundColor: "#FF76221A",
    padding: 4,
    borderRadius: 4,
  },
  searchBar: {
    backgroundColor: "#F6F8FA",
    padding: 12,
    borderRadius: 10,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  searchInput: {
    flex: 1,
  },
  offerHeader: {
    padding: 10,
  },
  offerTitle: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 10,
  },
  offerCard: {
    borderRadius: 20,
    marginVertical: 10,
    overflow: "hidden",
  },
  offerBackground: {
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
  },
  offerBackgroundImage: {
    borderRadius: 20,
  },
  offerDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  offerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  offerDate: {
    color: "#FFE6CC",
    fontSize: 14,
    marginBottom: 20,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: "#FFF",
  },
  offerImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
});