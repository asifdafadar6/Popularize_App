import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator, Image } from "react-native";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";

const SearchScreen = () => {
  const [offerList, setOfferList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const businessId = "67dd66aad10f119162eb765d"; 
      const response = await axios.get(`https://popularizenode.apdux.tech/api/getofferBybusinessId/${businessId}`);

      if (response.data.success && response.data.data) {
        const formattedOffers = response.data.data.map(offer => ({
          id: offer._id,
          name: offer.offerName,
          businessName: offer.businessId.companyName,
          startDate: offer.offerStartingDate,
          endDate: offer.offerExpireDate,
          discount: offer.discount,
          image: offer.offerImg,
          businessImage: offer.businessId.profileImage,
        }));

        setOfferList(formattedOffers);
      } else {
        setError("Failed to fetch offers");
      }
    } catch (error) {
      console.error("Error fetching offers:", error);
      setError("Failed to load offer data");
    } finally {
      setLoading(false);
    }
  };

  const isOfferExpired = (endDate) => {
    const dateParts = endDate.includes("/") ? endDate.split("/") : endDate.split("-");
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1; 
    const year = parseInt(dateParts[2], 10);
    
    const offerEndDate = new Date(year, month, day);
    const today = new Date();
    
    return offerEndDate < today;
  };

  const filteredOffers = offerList
    .filter(offer => isOfferExpired(offer.endDate))
    .filter(offer =>
      offer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.businessName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setRecentSearches([]);
    } else {
      if (!recentSearches.includes(query)) {
        setRecentSearches([query, ...recentSearches].slice(0, 5)); 
      }
    }
  };

  const handleDeleteSearch = (query) => {
    setRecentSearches(recentSearches.filter(item => item !== query));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expired Offers</Text>

      <View style={styles.searchBox}>
        <Icon name="search-outline" size={20} color="#A0A0A0" style={styles.searchIcon} />
        <TextInput
          placeholder="Search expired offers..."
          style={styles.input}
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch("")}>
            <Icon name="close-circle-outline" size={20} color="#A0A0A0" />
          </TouchableOpacity>
        )}
      </View>

      {recentSearches.length > 0 && (
        <View>
          <View style={styles.recentHeader}>
            <Text style={styles.recentTitle}>Recent Searches</Text>
            <TouchableOpacity onPress={clearRecentSearches}>
              <Text style={styles.clearText}>Clear All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={recentSearches}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.recentItem}>
                <Text style={styles.recentText}>{item}</Text>
                <TouchableOpacity onPress={() => handleDeleteSearch(item)}>
                  <Icon name="close-circle-outline" size={18} color="gray" />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}

      {filteredOffers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="time-outline" size={50} color="#ccc" />
          <Text style={styles.emptyText}>No expired offers found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredOffers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.offerItem}
              onPress={() => router.push(`/OfferDetails?offerId=${item.id}`)}
            >
              <Image 
                source={{ uri: item.image }} 
                style={styles.offerImage}
                resizeMode="cover"
              />
              <View style={styles.offerDetails}>
                <Text style={styles.offerName}>{item.name}</Text>
                <Text style={styles.offerBusiness}>{item.businessName}</Text>
                <View style={styles.offerMeta}>
                  <Text style={styles.expiredBadge}>EXPIRED</Text>
                </View>
                <Text style={styles.offerDates}>
                    {item.startDate} - {item.endDate}
                  </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = {
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  searchBox: { 
    flexDirection: "row", 
    alignItems: "center", 
    padding: 10, 
    borderWidth: 1, 
    borderColor: "#ccc", 
    borderRadius: 8,
    marginBottom: 10,
  },
  searchIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16 },
  recentHeader: { flexDirection: "row", justifyContent: "space-between", marginVertical: 10 },
  recentTitle: { fontSize: 18, fontWeight: "bold" },
  clearText: { color: "red", fontSize: 14 },
  recentItem: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    padding: 8, 
    borderBottomWidth: 1, 
    borderBottomColor: "#ccc" 
  },
  recentText: { fontSize: 16 },
  offerItem: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginBottom: 10,
    opacity: 0.7, 
  },
  offerImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  offerDetails: {
    flex: 1,
    justifyContent: "center",
  },
  offerName: { 
    fontSize: 16, 
    fontWeight: "bold",
    marginBottom: 4,
  },
  offerBusiness: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  offerMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  expiredBadge: {
    fontSize: 12,
    color: "red",
    fontWeight: "bold",
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: "#ffebee",
    borderRadius: 4,
  },
  offerDates: {
    fontSize: 12,
    color: "#888",
    marginTop:4
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    marginTop: 10,
  },
};

export default SearchScreen;