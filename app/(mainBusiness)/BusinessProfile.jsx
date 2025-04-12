import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from "expo-router";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const BusinessProfile = () => {
  const [userId, setUserId] = useState(null);
  const [followed, setFollowed] = useState(false);
  const [userData, setUserData] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { businessId } = useLocalSearchParams();


  const backgroundImages = [
    require("../../assets/images/offerbg1.png"),
    require("../../assets/images/offerbg2.png"),
    require("../../assets/images/offerbg3.png"),
  ];
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (!storedUserId) throw new Error('User ID not found');

        setUserId(storedUserId);
        const profileResponse = await axios.get(`https://popularizenode.apdux.tech/api/viewprofilebyid/${storedUserId}`);
        if (profileResponse.data && profileResponse.data.userDetails) {
          setUserData(profileResponse.data.userDetails);
        } else {
          setError("No user data found");
        }

        const offersResponse = await axios.get("https://popularizenode.apdux.tech/api/getAllOffers");
        if (offersResponse.data.success) {
          const businessOffers = offersResponse.data.data.filter(
            offer => offer.businessId?._id === storedUserId
          );
          setOffers(businessOffers);
        } else {
          console.warn("Failed to fetch offers");
        }
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to load data: " + (err.message || "Unknown error"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const connectWithInstagram = async () => {
      try {
        const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${instagramAppId}&redirect_uri=${encodeURIComponent(instagramRedirectUri)}&scope=user_profile,user_media&response_type=code`;
        const result = await WebBrowser.openAuthSessionAsync(authUrl, instagramRedirectUri);
  
        if (result.type === 'success') {
          console.log('Instagram Auth Code:', result.url);
          alert('Connected to Instagram');
        } else {
          alert('Instagram login canceled.');
        }
      } catch (error) {
        console.error('Instagram Login Error:', error);
        alert('Error connecting to Instagram.');
      }
    };

  const renderOfferCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.offerCard}
      onPress={() => router.push({
        pathname: '/offerDetails',
        params: { offerId: item._id }
      })}
    >
      <Image 
        source={{ uri: item.offerImg }} 
        style={styles.offerImage}
      />
      <View style={styles.offerTextContainer}>
        <Text style={styles.offerTitle}>{item.offerName}</Text>
        <Text style={styles.offerDiscount}>Discount: {item.discount}%</Text>
        <Text style={styles.offerValidity}>Valid until: {item.offerExpireDate}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7622" />
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
      <FlatList
        ListHeaderComponent={
          <>
             <View style={styles.header}>
                      <View style={styles.icon}>
                        <Image source={{ uri: userData.profileImage }} style={styles.profileImage} />
                      </View>
            
                      <Text style={styles.name}>{userData.companyName}</Text>
                      <Text style={styles.instaname}>@{userData.userEmail}</Text>
                      <Text style={styles.instaname}>@{userData.gstNumber}</Text>
                      <View style={styles.statsContainer}>
                          <View style={styles.statItem}>
                            <Text style={styles.statNumber}>50</Text>
                            <Text style={styles.statLabel}>Posts</Text>
                          </View>
                          <View style={styles.verticalLine} />
            
                          <View style={styles.statItem}>
                            <Text style={styles.statNumber}>2.5k</Text>
                            <Text style={styles.statLabel}>Following</Text>
                          </View>
            
                            <View style={styles.verticalLine} />
            
                          <View style={styles.statItem}>
                            <Text style={styles.statNumber}>1.5m</Text>
                            <Text style={styles.statLabel}>Followers</Text>
                          </View>
                      </View>
            
                <View style={styles.buttonContainer}>
                            <TouchableOpacity
                              style={[styles.socialButton, styles.facebookButton]}
                              // onPress={connectWithFacebook}
                            >
                              <Image source={require('../../assets/images/facebook.png')} style={styles.socialIcon} />
                              <Text style={styles.socialText}>Connect Facebook</Text>
                            </TouchableOpacity>
            
                            <TouchableOpacity
                              style={[styles.socialButton, styles.instagramButton]}
                              onPress={connectWithInstagram}
                            >
                              <Image source={require('../../assets/images/instagram.png')} style={styles.socialIcon} />
                              <Text style={styles.socialText}>Connect Instagram</Text>
                            </TouchableOpacity>
                          </View>
                      {/* <View style={[styles.statsContainer1, followed && styles.shiftRight]}>
                        <View style={styles.buttonContainer}>
                          <TouchableOpacity
                            style={[styles.followButton, followed && styles.followingButton]}
                            onPress={() => setFollowed(!followed)}
                          >
                            <Text style={[styles.buttonFollowText, followed && styles.followingText]}>
                              {followed ? "Following" : "Follow"}
                            </Text>
                          </TouchableOpacity>
            
                          <TouchableOpacity style={styles.messageButton} onPress={() => {
              router.push({
                pathname: '/chatMessage',
                params: { userBusinessId: businessId },
              });
            }}
            >
                            <Text style={styles.buttonText}>Message</Text>
                          </TouchableOpacity>
                                  <TouchableOpacity
                                      onPress={() => router.push('/givenReview')}
                                      style={styles.reviewButton}
                                    >
                                      <Text style={styles.reviewButtonText}>Reviews</Text>
                                  </TouchableOpacity>
                        </View>
                      </View> */}
                    </View>
            
            <View style={styles.horizontalLine} />
            
            <View style={styles.offersHeader}>
              <Text style={styles.offersTitle}>Current Offers</Text>
              {offers.length > 3 && (
                <TouchableOpacity>
                  <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        }
        data={offers}
        keyExtractor={(item) => item._id}
        renderItem={renderOfferCard}
        ListEmptyComponent={<Text style={styles.noOffersText}>No offers available</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: '#fff',
        },
        header: {
            alignItems: 'center',
          },
          icon: {
            position: "relative",
            width: "150%",
            height: 100,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#ff6600"
          },
          profileImage: {
            width: 120,
            height: 120,
            borderRadius: 100,
            borderWidth: 5,
            borderColor: '#fff',
            marginTop: 100,
            backgroundColor: "#fff"
          },
          editicon: {
            position: "absolute",
            bottom: 0,
            right: 5,
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: "#ff6600",
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 2,
            borderColor: "black",
          },
        profileImage: {
          width: 100,
          height: 100,
          borderRadius: 50,
          borderWidth: 3,
          borderColor: 'white',
          marginBottom: 10,
        },
        name: { fontSize: 18, fontWeight: 'bold', color: '#000', marginTop: 20 },
        instaname: { fontSize: 14, color: 'gray',padding:10},
        businessInfo: {
          fontSize: 14,
          color: 'white',
          marginBottom: 15,
        },
        statsContainer: {
            flexDirection: 'row', 
            justifyContent: 'space-around', 
            width: '60%', 
            marginVertical: 10,
           },
           statsContainer1: {
             flexDirection: 'row', 
             justifyContent: 'space-around', 
             width: '60%', 
             marginVertical: 10,
             marginRight:90 
            },
            shiftRight: {
             marginRight:70
           },
             verticalLine: {
               width: 1.5, 
               height: "50%", 
               backgroundColor: "#ccc", 
               marginHorizontal: 10, 
               marginTop:5
             },
         
         stat: { textAlign: 'center', color: '#fff' },
         buttonContainer: { flexDirection: 'row', gap: 10, },
         socialButton: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          height: 50,
          width: "45%",
          borderRadius: 25,
          paddingHorizontal: 15,
          elevation: 3,
          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 3,
        },
        facebookButton: {
          backgroundColor: "#1877F2",
        },
        instagramButton: {
          backgroundColor: "#E1306C",
        },
        socialIcon: {
          width: 20,
          height: 20,
          marginRight: 8,
          resizeMode: "contain",
        },
        socialText: {
          color: "#FFFFFF",
          fontSize: 12,
          fontWeight: "500",
        },
         followButton: { backgroundColor: '#ff6600', padding: 10, borderRadius: 5 , paddingHorizontal: 20,},
         messageButton: { borderWidth: 1, borderColor: '#ff6600', padding: 10, borderRadius: 5, fontWeight: 'bold',    paddingHorizontal: 20,
         },
         buttonText: { color: '#ff6600', fontWeight: 'bold' },
         buttonFollowText: { color: '#fff', fontWeight: 'bold' },
         reviewButton: {
            backgroundColor: "#ff6600",  
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 5,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 5,  
          },
          reviewButtonText: {
            color: "#fff",
            // fontSize: 16,
            fontWeight: "bold",
          },   
        followingText: {
          color: 'white',
        },
        horizontalLine: {
          height: 1,
          backgroundColor: '#e0e0e0',
          marginVertical: 10,
        },
        offersHeader: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 10,
        },
        offersTitle: {
          fontSize: 18,
          fontWeight: 'bold',
        },
        seeAll: {
          color: '#FF7622',
        },
        offerCard: {
          flexDirection: 'row',
          backgroundColor: '#f9f9f9',
          borderRadius: 10,
          padding: 15,
          marginHorizontal: 20,
          marginVertical: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        },
        offerImage: {
          width: 80,
          height: 80,
          borderRadius: 10,
          marginRight: 15,
        },
        offerTextContainer: {
          flex: 1,
          justifyContent: 'center',
        },
        offerTitle: {
          fontSize: 16,
          fontWeight: 'bold',
          marginBottom: 5,
        },
        offerDiscount: {
          fontSize: 14,
          color: '#FF7622',
          marginBottom: 5,
        },
        offerValidity: {
          fontSize: 12,
          color: '#666',
        },
        noOffersContainer: {
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        },
        noOffersText: {
          fontSize: 16,
          color: '#666',
        },
        loadingContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
        errorContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        },
        errorText: {
          color: 'red',
          fontSize: 16,
          marginBottom: 10,
          textAlign: 'center',
        },
        retryText: {
          color: '#FF7622',
          fontSize: 16,
          fontWeight: 'bold',
        },
      });
      
export default BusinessProfile;


