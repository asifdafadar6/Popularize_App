import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";

const SearchScreen = () => {
  const [searchText, setSearchText] = useState("");
  const [offers, setOffers] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Offers");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [offersResponse, businessesResponse] = await Promise.all([
          axios.get("https://popularizenode.apdux.tech/api/getAllOffers"),
          axios.get("https://popularizenode.apdux.tech/api/viewallprofile"),
        ]);

        if (offersResponse.data.success) {
          setOffers(offersResponse.data.data || []);
        } else {
          console.warn("Failed to fetch offers");
        }

        if (businessesResponse.data.all_data) {
          const validBusinesses = businessesResponse.data.all_data.filter(
            (business) => business.role === "business" && business.brandName
          );
          setBusinesses(validBusinesses);
        } else {
          console.warn("Failed to fetch businesses");
        }
      } catch (error) {
        setError("Error fetching data");
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = activeTab === "Offers"
    ? offers.filter((offer) => 
        offer?.offerName?.toLowerCase().includes(searchText.toLowerCase()) ||
        offer?.businessId?.brandName?.toLowerCase().includes(searchText.toLowerCase())
      )
    : businesses.filter((business) =>
        business?.brandName?.toLowerCase().includes(searchText.toLowerCase()) ||
        business?.companyName?.toLowerCase().includes(searchText.toLowerCase())
      );

  const handleItemPress = (id) => {
    if (activeTab === "Offers") {
      router.push({ pathname: "/offerDetails", params: { offerId: id } });
    } else {
      router.push({ pathname: "/BusinessProfileDetails", params: { businessId: id } });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D4A373" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => {
          setLoading(true);
          setError(null);
          fetchData();
        }}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Icon name="chevron-back-outline" size={24} color="#FF7622" />
      </TouchableOpacity>

      <View style={styles.tabContainer}>
        {["Offers", "Business"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.title}>
        {activeTab === "Offers" ? "Result For Offer Search" : "Result For Business Search"}
      </Text>

      <View style={styles.searchBox}>
        <Icon name="search-outline" size={20} color="#A0A0A0" style={styles.searchIcon} />
        <TextInput
          placeholder="Search here"
          style={styles.input}
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText("")}>
            <Icon name="close-circle-outline" size={20} color="#A0A0A0" />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.recentTitle}>Recent Search</Text>

      {filteredData.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>
            No {activeTab === "Offers" ? "Offers" : "Businesses"} Found
            {searchText.length > 0 ? ` for "${searchText}"` : ""}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.searchItem}
              onPress={() => handleItemPress(item._id)}
            >
              {activeTab === "Offers" ? (
                <>
                  <Image
                    source={{ uri: item.offerImg || "https://via.placeholder.com/50" }}
                    style={styles.itemImage}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemName}>{item.offerName}</Text>
                    <Text style={styles.itemDescription}>
                      By: {item.businessId?.brandName || 'Unknown'} | Discount: {item.discount}% | Expires: {item.offerExpireDate}
                    </Text>
                  </View>
                </>
              ) : (
                <>
                  <Image
                    source={{ uri: item.profileImage || "https://via.placeholder.com/50" }}
                    style={styles.itemImage}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemName}>{item.brandName}</Text>
                    <Text style={styles.itemDescription}>
                      Company: {item.companyName}
                    </Text>
                  </View>
                </>
              )}
              <Icon name="chevron-forward-outline" size={20} color="#FF7622" />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 40,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: "#FF7622",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF7622",
    marginBottom: 20,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F8FA",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF7622",
    marginBottom: 10,
  },
  searchItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 15,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  itemDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
  retryText: {
    fontSize: 16,
    color: "#D4A373",
    marginTop: 10,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  noResultsText: {
    fontSize: 18,
    color: "#666",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default SearchScreen;