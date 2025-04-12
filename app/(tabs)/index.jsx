import React, { useCallback, useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image, ImageBackground } from "react-native";
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useFocusEffect } from "expo-router";
import axios from "axios";


const backgroundImages = [
  require("../../assets/images/offerbg1.png"),
  require("../../assets/images/offerbg2.png"),
  require("../../assets/images/offerbg3.png"),
];

const Popularize = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [userList, setUserList] = useState([]);
  const [offerList, setOfferList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeTab, setActiveTab] = useState("offers");

  const getRandomColor = () => {
    const colors = ["#FFD7B5"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getRandomBackground = () => {
    return backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
  };

  const handleUserCardPress = (userId) => {
    router.push({ pathname: '/influProfile', params: { influId: userId } });
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    try {
      setLoading(true);

      const usersResponse = await axios.get("https://popularizenode.apdux.tech/api/viewallprofile");
      if (usersResponse.data.all_data) {
        const formattedUsers = usersResponse.data.all_data.map(user => ({
          id: user._id,
          name: user.userName || user.companyName,
          email: user.userEmail,
          instaID: user.intraID,
          role: user.role,
          type: user.type,
          image: user.profileImage,
        }));
        setUserList(formattedUsers);
      }

      const offersResponse = await axios.get("https://popularizenode.apdux.tech/api/getAllOffers");
      if (offersResponse.data.success && offersResponse.data.data) {
        const formattedOffers = offersResponse.data.data.map(offer => ({
          id: offer._id,
          title: offer.offerName,
          businessName: offer.businessId.companyName,
          brandName: offer.businessId.brandName,
          discount: offer.discount,
          startDate: offer.offerStartingDate,
          endDate: offer.offerExpireDate,
          image: offer.offerImg,
          businessImage: offer.businessId.profileImage,
        }));
        setOfferList(formattedOffers);
      }
    } catch (error) {
      setError("Failed to load data");
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const isOfferExpired = (endDate) => {
    const today = new Date();
    const expiryDate = new Date(endDate);
    return expiryDate < today;
  };

  const filteredUsers = userList
    .filter(user => user.role === "influencer")
    .filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const filteredOffers = offerList
    .filter(offer => !isOfferExpired(offer.endDate))
    .filter(offer =>
      offer.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.brandName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const displayedUsers = showAll ? filteredUsers : filteredUsers.slice(0, 4);
  const displayedOffers = showAll ? filteredOffers : filteredOffers.slice(0, 4);

  const renderItem = ({ item, index }) => {
    if (activeTab === "influencers") {
      return (
        <TouchableOpacity activeOpacity={1} onPress={() => handleUserCardPress(item.id)}>
          <View style={[styles.userCard, { backgroundColor: getRandomColor() }]}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userEmail}>{item.instaID}</Text>
              <Text style={styles.userRole}>{item.type}</Text>
            </View>
            <Image source={{ uri: item.image }} style={styles.userImage} />
          </View>
        </TouchableOpacity>
      );
    } else {
      const bgImage = backgroundImages[index % backgroundImages.length];

      return (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push({ pathname: '/OfferDetails', params: { offerId: item.id } })}
          style={styles.offerCardContainer}
        >
          <ImageBackground
            source={bgImage}
            style={styles.offerCard}
            imageStyle={styles.offerCardBackground}
          >
            <View style={styles.offerContent}>
              <View style={styles.offerTextContainer}>
                <Text style={styles.offerTitle} numberOfLines={2}>{item.title}</Text>
                {/* <Text style={styles.offerBusiness} numberOfLines={1}>{item.businessName}</Text> */}
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>{item.discount}% OFF</Text>
                </View>
                <Text style={styles.offerDates}>Valid till - {item.endDate}</Text>
              </View>
              {item.image && (
                <View style={styles.offerImageContainer}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.offerImage}
                    resizeMode="cover"
                  />
                </View>
              )}
            </View>
          </ImageBackground>
        </TouchableOpacity>
      );
    }
  };

  const renderEmptyComponent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#FF7622" style={{ marginTop: 20 }} />;
    }
    return <Text style={styles.noOffersText}>No {activeTab === "influencers" ? "Influencers" : "Offers"} Found</Text>;
  };

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

      <View style={styles.searchContainer}>
        <EvilIcons name="search" size={28} color="#FF7622" />
        <TextInput
          style={styles.searchBar}
          placeholder={`Search ${activeTab === "influencers" ? "Influencers" : "Offers"}...`}
          placeholderTextColor="gray"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "offers" && styles.activeTab]}
          onPress={() => setActiveTab("offers")}
        >
          <Text style={[styles.tabText, activeTab === "offers" && styles.activeTabText]}>Offers</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "influencers" && styles.activeTab]}
          onPress={() => setActiveTab("influencers")}
        >
          <Text style={[styles.tabText, activeTab === "influencers" && styles.activeTabText]}>Influencers</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.offersHeader}>
        <Text style={styles.offersTitle}>
          {activeTab === "influencers" ? "Top Rated Influencers" : "Available Offers"}
        </Text>
        {(activeTab === "influencers" ? filteredUsers : filteredOffers).length > 4 && (
          <TouchableOpacity onPress={() => {
            setLoadingMore(true);
            setTimeout(() => {
              setShowAll(!showAll);
              setLoadingMore(false);
            }, 1000);
          }}>
            {loadingMore ? (
              <ActivityIndicator size="small" color="#000" style={{ marginTop: 15 }} />
            ) : (
              <Text style={styles.seeAllButton}>
                {showAll ? "See Less" : "See All"}
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={activeTab === "influencers" ? displayedUsers : displayedOffers}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmptyComponent}
      />

      {activeTab === "offers" && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            router.push('/(mainBusiness)/AddOffers');
          }}
        >
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    marginBottom: 80,
  },
  header: {
    marginBottom: 30,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 80,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff6b00",
  },
  tagline: {
    fontSize: 10,
    color: "#FF7622",
    marginTop: 6,
  },
  notificationIcon: {
    backgroundColor: "#FF76221A",
    padding: 4,
    borderRadius: 4,
  },
  searchContainer: {
    backgroundColor: "#F6F8FA",
    padding: 5,
    borderRadius: 10,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 15,
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  seeAllButton: { fontSize: 16, color: "#FF7622", marginTop: 15 },
  offersHeader: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  errorText: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
  },
  noOffersText: {
    textAlign: "center",
    fontSize: 18,
    color: "gray",
    marginTop: 20,
  },
  userCard: {
    borderRadius: 15,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  offerCardContainer: {
    marginVertical: 8,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 4,
  },
  offerCard: {
    height: 130,
    padding: 14,
  }, offerCardBackground: {
    borderRadius: 15,
  },
  offerContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  offerTextContainer: {
    flex: 1,
    paddingRight: 10,
    justifyContent: 'center',
  },
  offerCardBackground: {
    borderRadius: 15,
  },
  offerContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  offerTextContainer: {
    flex: 1,
    paddingRight: 10,
    justifyContent: 'center',
  },
  offerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  offerBusiness: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  discountBadge: {
    backgroundColor: '#FF7622',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  discountText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  offerDates: {
    color: "#fff",
    fontSize: 12,
    fontStyle: "italic",
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  offerImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  offerImage: {
    width: '100%',
    height: '100%',
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  userEmail: {
    color: "#000",
    fontSize: 14,
    paddingTop: 5,
    paddingBottom: 5,
  },
  userRole: {
    color: "#000",
    fontSize: 12,
    opacity: 0.8,
    fontWeight: "600"
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#FF7622',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    zIndex: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#FF7622',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FF7622',
    fontWeight: '600',
  },
  offersTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginTop: 15,
    marginBottom: 8,
    paddingBottom: 5,
    alignSelf: 'flex-start',
  },
});

export default Popularize;




// const offers = [
//   { id: "1", color: "#FF6B00", text: "Get $10 cashback on purchases above $50.", date: "30 Jan, 2025" },
//   { id: "2", color: "#007BFF", text: "Exclusive New Year discounts available now!", date: "30 Jan, 2025" },
//   { id: "3", color: "#005F3D", text: "Save big with our flash sale event!", date: "30 Jan, 2025" },
//   { id: "4", color: "#FF1493", text: "Valentine’s Day Special - 20% off on all items!", date: "14 Feb, 2025" },
//   { id: "5", color: "#8A2BE2", text: "Buy 1 Get 1 Free on selected items.", date: "10 March, 2025" },
//   { id: "6", color: "#32CD32", text: "Student Discount - Extra 15% off with student ID.", date: "15 April, 2025" },
//   { id: "7", color: "#FFD700", text: "Loyalty Members - Earn double reward points this week!", date: "5 May, 2025" },
//   { id: "8", color: "#DC143C", text: "Summer Sale - Up to 50% off on fashion!", date: "20 June, 2025" },
//   { id: "9", color: "#4682B4", text: "Midnight Madness - Extra 10% off after 10 PM!", date: "30 July, 2025" },
//   { id: "10", color: "#FF4500", text: "Weekend Bonanza - Flat 30% off this weekend only!", date: "15 August, 2025" },
//   { id: "11", color: "#2E8B57", text: "Free Shipping on all orders above $25.", date: "1 September, 2025" },
//   { id: "12", color: "#4B0082", text: "Diwali Special - Buy more, save more!", date: "20 October, 2025" },
//   { id: "13", color: "#B22222", text: "Black Friday Blowout - The biggest sale of the year!", date: "29 November, 2025" },
//   { id: "14", color: "#008080", text: "Cyber Monday - Exclusive online deals up to 70% off!", date: "2 December, 2025" },
//   { id: "15", color: "#20B2AA", text: "Holiday Special - Get gifts for everyone at great prices!", date: "25 December, 2025" }
// ];