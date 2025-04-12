import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OfferDetails() {
  const { offerId } = useLocalSearchParams();
  const router = useRouter();

  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userList, setUserList] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isExpired, setIsExpired] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const userId = await AsyncStorage.getItem('userId');
        setCurrentUserId(userId);
        await fetchOfferDetails();
        await fetchacceptofferinfludetails();
      };
      fetchData();
    }, [])
  );

  const fetchOfferDetails = async () => {
    try {
      const response = await axios.get(`https://popularizenode.apdux.tech/api/getOfferById/${offerId}`);
      if (response.data.success) {
        setOffer(response.data.data);
        const expired = isOfferExpired(response.data.data.offerExpireDate);
        setIsExpired(expired);
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

  const isOfferExpired = (endDate) => {
  
    const dateParts = endDate.includes("/") ? endDate.split("/") : endDate.split("-");
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1; 
    const year = parseInt(dateParts[2], 10);
    
    const offerEndDate = new Date(year, month, day);
    const today = new Date();
    
    return offerEndDate < today;
  };

  const getRandomColor = () => {
    const colors = ["#FFD7B5"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleUserCardPress = (userId) => {
    router.push({ pathname: '/influProfile', params: { influId:userId } });
  };

  const fetchacceptofferinfludetails = async () => {
    try {
      const businessId = await AsyncStorage.getItem('userId');
      if (!businessId) {
        throw new Error('Business ID not found');
      }
      const token = await AsyncStorage.getItem('userToken');

      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.get('https://popularizenode.apdux.tech/api/getofferbybusiness',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      let result = response.data.userlist.filter((offerresult) => {
        if (offerId === offerresult.offerId._id) {
          return offerresult;
        }
      });
      setUserList(result);
    } catch (err) {
      setError("Error retrieving accepted influencer details.");
      console.error("accepted influencer Fetch error:", err);
    }
  };

  const handleEditOffer = () => {
    if (!isExpired && userList.length > 0) {
      Alert.alert(
        "Cannot Edit Offer",
        "This active offer cannot be edited because it has already been accepted by influencers.",
        [{ text: "OK" }]
      );
      return;
    }
    
    router.push({
      pathname: '/Editoffer',
      params: { 
        offerId: offerId,
        offerName: offer?.offerName,
        discount: offer?.discount,
        offerStartingDate: offer?.offerStartingDate,
        offerExpireDate: offer?.offerExpireDate,
        offerImg: offer?.offerImg,
        isExpired: isExpired // Pass expiration status to edit screen
      }
    });
  };

  const handleDeleteOffer = async () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this offer?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('userToken');
              if (!token) {
                throw new Error('Authentication token not found');
              }
              
              setLoading(true);
              const response = await axios.delete(
                `https://popularizenode.apdux.tech/api/deleteOffer/${offerId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                }
              );
              
              if (response.data.success) {
                Alert.alert("Success", "Offer deleted successfully");
                router.push('/ListOffers');
              } else {
                router.back();
              }
            } catch (error) {
              console.error("Delete error:", error);
              Alert.alert("Error", "An error occurred while deleting the offer");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleBusinessProfilePress = () => {
    if (offer?.businessId?._id) {
      router.push({
        pathname: '/(mainBusiness)/BusinessProfileDetails',
        params: { businessId: offer.businessId._id }
      });
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#FF7622" style={{ marginTop: 50 }} />;
  if (error) return <Text style={styles.errorText}>{error}</Text>;

  const isOfferOwner = currentUserId && offer?.businessId?._id === currentUserId;
  const canEditDelete = isOfferOwner && (!userList.length || isExpired);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          {offer?.offerImg && (
            <Image source={{ uri: offer.offerImg }} style={styles.offerImage} />
          )}
          <Text style={styles.headerText}>{offer?.offerName}</Text>
          <Text style={styles.subHeaderText}>Earn rewards and discounts</Text>
        </View>

        <View style={styles.offerContainer}>
          <Text style={styles.offerTitle}>Offer Overview</Text>

          <View style={styles.detailsCard}>
            <TouchableOpacity 
              style={styles.businessDetails} 
              onPress={handleBusinessProfilePress}
            >
              <Image
                source={{ uri: offer?.businessId?.profileImage }}
                style={styles.profileImage}
              />
              <View style={styles.businessInfo}>
                <Text style={styles.brandName}>{offer?.businessId?.brandName}</Text>
                <Text style={styles.businessId}>{offer?.businessId?.companyName}</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.horizontalLine} />
            <Text style={styles.keyDetailsTitle}>Key Details</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Offer Validity Period - </Text>
              <Text style={styles.detailValue}>{offer?.offerExpireDate}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Discount - </Text>
              <Text style={[styles.detailValue, { color: "#FF7622" }]}>{offer?.discount}%</Text>
            </View>
          </View>

          {isOfferOwner && (
          <View style={{width:"100%", flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 10, gap:3}}>
            <TouchableOpacity 
              style={[
                styles.claimButton, 
                styles.editButton,
                !isExpired && userList.length > 0 ? styles.disabledButton : null
              ]} 
              onPress={handleEditOffer}
              disabled={!isExpired && userList.length > 0}
            >
              <Text style={styles.claimButtonText}>
                {isExpired ? "Recreate Offer" : "Edit Offer"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.claimButton, 
                styles.deleteButton
              ]} 
              onPress={handleDeleteOffer}
            >
              <Text style={styles.claimButtonText}>Delete Offer</Text>
            </TouchableOpacity>
          </View>
        )}
        </View>

        <View style={styles.offerContainer}>
          <Text style={styles.offerTitle}>Accepted Offers</Text>
        </View>

        {userList.length === 0 ? (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No One Accepted the Offer</Text>
          </View>
        ) : (
          <View>
            {userList.map((item, index) => (
              <TouchableOpacity key={index} onPress={() => handleUserCardPress(item.userId._id)}>
                <View style={[styles.userCard, { backgroundColor: getRandomColor() }]}>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{item.userId.userName}</Text>
                    <Text style={styles.userEmail}>{item.userId.intraID}</Text>
                    <Text style={styles.userRole}>{item.userId.type}</Text>
                  </View>
                  <Image source={{ uri: item.userId.profileImage }} style={styles.userImage} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FF7622',
    paddingVertical: 40,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    position: 'relative',
    // height:350
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 20,
    zIndex: 1,
  },
  offerImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  headerText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 60,
  },
  subHeaderText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
  offerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  offerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  detailsCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderColor: '#FF7622',
    borderWidth: 1,
  },
  businessDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  businessInfo: {
    flex: 1,
    // marginBottom:50,
  },
  brandName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  businessId: {
    fontSize: 14,
    color: '#666',
  },
  horizontalLine: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
  },
  keyDetailsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  claimButton: {
    backgroundColor: '#FF7622',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    width:"50%",
  },
  claimButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  userCard: {
    // backgroundColor: "#000",
    borderRadius: 15,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 5,
    marginHorizontal:15,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4, 
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
    paddingTop:5,
    paddingBottom:5,
  },

  userRole: {
    color: "#000",
    fontSize: 12,
    opacity: 0.8,
    fontWeight:"600"
  },

  userImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  disabledButton: {
    backgroundColor: '#cccccc', 
},
disabledButtonText: {
    color: '#666666', 
},
noDataContainer: {
  padding: 20,
  alignItems: 'center',
  justifyContent: 'center',
},
noDataText: {
  fontSize: 16,
  color: '#666',
  textAlign: 'center',
  marginTop: 10,
},
});



// import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Image } from 'react-native';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export default function OfferDetails() {
//   const { offerId } = useLocalSearchParams();
//   const router = useRouter();

//   const [offer, setOffer] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchOfferDetails();
//   }, []);

//   const fetchOfferDetails = async () => {
//     try {
//       const response = await axios.get(https://popularizenode.apdux.tech/api/getOfferById/${offerId});
//       if (response.data.success) {
//         setOffer(response.data.data);
//       } else {
//         setError("Failed to fetch offer details.");
//       }
//     } catch (error) {
//       setError("Error retrieving offer details.");
//       console.error("Fetch error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClaimOffer = async () => {
//     try {
//       await AsyncStorage.setItem('claimedOfferId', offerId);
//       router.push('/claimedOffers');
//     } catch (error) {
//       console.error("Error storing offer ID:", error);
//     }
//   };

//   if (loading) return <ActivityIndicator size="large" color="#FF7622" style={{ marginTop: 50 }} />;
//   if (error) return <Text style={styles.errorText}>{error}</Text>;

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//       <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
//           <Ionicons name="arrow-back" size={24} color="white" />
//         </TouchableOpacity>
//         {offer?.offerImg && (
//           <Image source={{ uri: offer.offerImg }} style={styles.offerImage} />
//         )}
//         <Text style={styles.headerText}>{offer?.offerName}</Text>
//         <Text style={styles.subHeaderText}>Earn rewards and discounts</Text>
//       </View>

//       <View style={styles.offerContainer}>
//         <Text style={styles.offerTitle}>Offer Overview</Text>

//         <View style={styles.detailsCard}>
//           <View style={styles.businessDetails}>
//             <Image
//               source={{ uri: offer?.businessId?.profileImage }}
//               style={styles.profileImage}
//             />
//             <View style={styles.businessInfo}>
//               <Text style={styles.brandName}>{offer?.businessId?.brandName}</Text>
//               <Text style={styles.businessId}>{offer?.businessId?.companyName}</Text>
//             </View>
//           </View>
//           <View style={styles.horizontalLine} />
//           <Text style={styles.keyDetailsTitle}>Key Details</Text>

//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>Offer Validity Period - </Text>
//             <Text style={styles.detailValue}>{offer?.offerExpireDate}</Text>
//           </View>

//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>Discount - </Text>
//             <Text style={[styles.detailValue, { color: "#FF7622" }]}>{offer?.discount}%</Text>
//           </View>
//         </View>

//         <TouchableOpacity style={styles.claimButton} onPress={handleClaimOffer}>
//           <Text style={styles.claimButtonText}>Accept Offer</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   header: {
//     backgroundColor: '#FF7622',
//     paddingVertical: 40,
//     paddingHorizontal: 20,
//     borderBottomLeftRadius: 15,
//     borderBottomRightRadius: 15,
//     alignItems: 'center',
//   },
//   backButton: {
//     position: 'absolute',
//     left: 20,
//     top: 20,
//   },
//   headerText: {
//     color: 'white',
//     fontSize: 22,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginTop: 20,
//   },
//   subHeaderText: {
//     color: 'white',
//     fontSize: 14,
//     textAlign: 'center',
//     marginTop: 5,
//   },
//   offerImage: {
//     width: '100%',
//     height: 200,
//     borderRadius: 10,
//     marginTop: 20,
//   },
//   offerContainer: {
//     paddingHorizontal: 20,
//     paddingTop: 20,
//   },
//   offerTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#000',
//     marginBottom: 10,
//   },
//   businessDetails: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   profileImage: {
//     width: 30,
//     height: 30,
//     borderRadius: 20,
//     marginRight: 10,
//   },
//   businessInfo: {
//     flex: 1,
//   },
//   brandName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#000',
//   },
//   businessId: {
//     fontSize: 14,
//     color: '#666',
//   },
//   detailsCard: {
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 15,
//     marginTop: 10,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     borderColor: '#FF7622',
//     borderWidth: 1,
//   },
//   horizontalLine: {
//     width: '100%',
//     height: 1,
//     backgroundColor: '#D3D3D3',
//     marginVertical: 10,
//     alignSelf: 'center',
//   },
//   keyDetailsTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: '#000',
//   },
//   detailRow: {
//     flexDirection: 'row',
//     marginBottom: 5,
//   },
//   detailLabel: {
//     fontSize: 14,
//     color: '#000',
//     fontWeight: '500',
//   },
//   detailValue: {
//     fontSize: 14,
//     color: '#333',
//     fontWeight: '500',
//   },
//   claimButton: {
//     backgroundColor: '#FF7622',
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   claimButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });



// import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Image } from 'react-native';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export default function OfferDetails() {
//   const { offerId } = useLocalSearchParams();
//   const router = useRouter();

//   const [offer, setOffer] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchOfferDetails();
//   }, []);

//   const fetchOfferDetails = async () => {
//     try {
//       const response = await axios.get(https://popularizenode.apdux.tech/api/getOfferById/${offerId});
//       if (response.data.success) {
//         setOffer(response.data.data);
//       } else {
//         setError("Failed to fetch offer details.");
//       }
//     } catch (error) {
//       setError("Error retrieving offer details.");
//       console.error("Fetch error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClaimOffer = async () => {
//     try {
//       await AsyncStorage.setItem('claimedOfferId', offerId);
//       router.push('/claimedOffers');
//     } catch (error) {
//       console.error("Error storing offer ID:", error);
//     }
//   };

//   if (loading) return <ActivityIndicator size="large" color="#FF7622" style={{ marginTop: 50 }} />;
//   if (error) return <Text style={styles.errorText}>{error}</Text>;

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//       <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
//           <Ionicons name="arrow-back" size={24} color="white" />
//         </TouchableOpacity>
//         {offer?.offerImg && (
//           <Image source={{ uri: offer.offerImg }} style={styles.offerImage} />
//         )}
//         <Text style={styles.headerText}>{offer?.offerName}</Text>
//         <Text style={styles.subHeaderText}>Earn rewards and discounts</Text>
//       </View>

//       <View style={styles.offerContainer}>
//         <Text style={styles.offerTitle}>Offer Overview</Text>

//         <View style={styles.detailsCard}>
//           <View style={styles.businessDetails}>
//             <Image
//               source={{ uri: offer?.businessId?.profileImage }}
//               style={styles.profileImage}
//             />
//             <View style={styles.businessInfo}>
//               <Text style={styles.brandName}>{offer?.businessId?.brandName}</Text>
//               <Text style={styles.businessId}>{offer?.businessId?.companyName}</Text>
//             </View>
//           </View>
//           <View style={styles.horizontalLine} />
//           <Text style={styles.keyDetailsTitle}>Key Details</Text>

//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>Offer Validity Period - </Text>
//             <Text style={styles.detailValue}>{offer?.offerExpireDate}</Text>
//           </View>

//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>Discount - </Text>
//             <Text style={[styles.detailValue, { color: "#FF7622" }]}>{offer?.discount}%</Text>
//           </View>
//         </View>

//         <TouchableOpacity style={styles.claimButton} onPress={handleClaimOffer}>
//           <Text style={styles.claimButtonText}>Accept Offer</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   header: {
//     backgroundColor: '#FF7622',
//     paddingVertical: 40,
//     paddingHorizontal: 20,
//     borderBottomLeftRadius: 15,
//     borderBottomRightRadius: 15,
//     alignItems: 'center',
//   },
//   backButton: {
//     position: 'absolute',
//     left: 20,
//     top: 20,
//   },
//   headerText: {
//     color: 'white',
//     fontSize: 22,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginTop: 20,
//   },
//   subHeaderText: {
//     color: 'white',
//     fontSize: 14,
//     textAlign: 'center',
//     marginTop: 5,
//   },
//   offerImage: {
//     width: '100%',
//     height: 200,
//     borderRadius: 10,
//     marginTop: 20,
//   },
//   offerContainer: {
//     paddingHorizontal: 20,
//     paddingTop: 20,
//   },
//   offerTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#000',
//     marginBottom: 10,
//   },
//   businessDetails: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   profileImage: {
//     width: 30,
//     height: 30,
//     borderRadius: 20,
//     marginRight: 10,
//   },
//   businessInfo: {
//     flex: 1,
//   },
//   brandName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#000',
//   },
//   businessId: {
//     fontSize: 14,
//     color: '#666',
//   },
//   detailsCard: {
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 15,
//     marginTop: 10,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     borderColor: '#FF7622',
//     borderWidth: 1,
//   },
//   horizontalLine: {
//     width: '100%',
//     height: 1,
//     backgroundColor: '#D3D3D3',
//     marginVertical: 10,
//     alignSelf: 'center',
//   },
//   keyDetailsTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: '#000',
//   },
//   detailRow: {
//     flexDirection: 'row',
//     marginBottom: 5,
//   },
//   detailLabel: {
//     fontSize: 14,
//     color: '#000',
//     fontWeight: '500',
//   },
//   detailValue: {
//     fontSize: 14,
//     color: '#333',
//     fontWeight: '500',
//   },
//   claimButton: {
//     backgroundColor: '#FF7622',
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   claimButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });