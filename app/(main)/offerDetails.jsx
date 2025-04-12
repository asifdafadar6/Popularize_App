import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Image, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OfferDetails() {
  const [businessId, setBusinessId] = useState();
  const { offerId } = useLocalSearchParams();
  const router = useRouter();

  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [userOffers, setUserOffers] = useState([]);

  useEffect(() => {
    fetchOfferDetails();
    fetchUserOffers();
  }, []);

  const fetchOfferDetails = async () => {
    try {
      const userInfluToken = await AsyncStorage.getItem('userInfluToken');
  
      const response = await axios.get(`https://popularizenode.apdux.tech/api/getOfferById/${offerId}`, {
        headers: {
          Authorization: `Bearer ${userInfluToken}`,
        },
      });
  
      if (response.data.success) {
        setOffer(response.data.data);
        setBusinessId(response.data.data.businessId._id)
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

  const fetchUserOffers = async () => {
    try {
      const userInfluToken = await AsyncStorage.getItem('userInfluToken');
      const response = await axios.get('https://popularizenode.apdux.tech/api/getofferbyinflu', {
        headers: {
          Authorization: `Bearer ${userInfluToken}`,
        },
      });

      if (response.data.success) {
        setUserOffers(response.data.offersWithBusinessDetails);
        const completedOffer = response.data.offersWithBusinessDetails.find(
          offer => offer.offerId._id === offerId && offer.isComplete === "Complete"
        );
        if (completedOffer) {
          setIsCompleted(true);
        }
      }
    } catch (error) {
      console.error("Error fetching user offers:", error);
    }
  };
  
  const handleClaimOffer = async () => {
    try {
      const userInfluId = await AsyncStorage.getItem('userinfluId');
      const userInfluToken = await AsyncStorage.getItem('userInfluToken');
  
      if (!userInfluId) throw new Error("userInfluId not found");
  
      const response = await axios.post(
        'https://popularizenode.apdux.tech/api/acceptoffer',
        {
          userId: userInfluId,
          offerId: offerId,
          businessId
        },
        {
          headers: {
            Authorization: `Bearer ${userInfluToken}`,
          },
        }
      );
  
      if (response.data.success) {
        alert("Offer accepted");
        console.log("Offer accepted:", response.data);
        await AsyncStorage.setItem('claimedOfferId', offerId);
        setIsCompleted(true);
      } else {
        alert("Error accepting offer");
        console.error("Error accepting offer:", response.data.msg);
      }
    } catch (error) {
      console.error("Error handling offer acceptance:", error);
    }
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

  return (
    <ScrollView 
    contentContainerStyle={styles.scrollContainer}
    showsVerticalScrollIndicator={false}
    >
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
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

        {!isCompleted && (
          <TouchableOpacity style={styles.claimButton} onPress={handleClaimOffer}>
            <Text style={styles.claimButtonText}>Accept Offer</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FF7622',
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 40,
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
});


// import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Image, ScrollView } from 'react-native';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export default function OfferDetails() {
//   const [businessId, setBusinessId] = useState();
//   const { offerId } = useLocalSearchParams();
//   const router = useRouter();

//   const [offer, setOffer] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isCompleted, setIsCompleted] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const userInfluToken = await AsyncStorage.getItem('userInfluToken');
        
//         const offerResponse = await axios.get(
//           `https://popularizenode.apdux.tech/api/getOfferById/${offerId}`,
//           { headers: { Authorization: `Bearer ${userInfluToken}` } }
//         );
        
//         if (offerResponse.data.success) {
//           setOffer(offerResponse.data.data);
//           setBusinessId(offerResponse.data.data.businessId._id);
//         }

//         // Check if offer is already completed
//         const userOffersResponse = await axios.get(
//           'https://popularizenode.apdux.tech/api/getofferbyinflu',
//           { headers: { Authorization: `Bearer ${userInfluToken}` } }
//         );

//         if (userOffersResponse.data.success) {
//           const completedOffer = userOffersResponse.data.offersWithBusinessDetails.find(
//             offer => offer.offerId._id === offerId && offer.isComplete === "Complete"
//           );
//           if (completedOffer) setIsCompleted(true);
//         }
//       } catch (error) {
//         setError("Error retrieving data");
//         console.error("Fetch error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [offerId]);

//   const handleClaimOffer = async () => {
//     try {
//       const userInfluId = await AsyncStorage.getItem('userinfluId');
//       const userInfluToken = await AsyncStorage.getItem('userInfluToken');
  
//       const response = await axios.post(
//         'https://popularizenode.apdux.tech/api/acceptoffer',
//         { userId: userInfluId, offerId, businessId },
//         { headers: { Authorization: `Bearer ${userInfluToken}` } }
//       );
  
//       if (response.data.success) {
//         alert("Offer accepted successfully");
//         setIsCompleted(true);
//         await AsyncStorage.setItem('claimedOfferId', offerId);
//       } else {
//         alert(response.data.msg || "Error accepting offer");
//       }
//     } catch (error) {
//       alert("An error occurred. Please try again.");
//       console.error("Error:", error);
//     }
//   };

//   const handleBusinessProfilePress = () => {
//     if (offer?.businessId?._id) {
//       router.push({
//         pathname: '/(mainBusiness)/BusinessProfileDetails',
//         params: { businessId: offer.businessId._id }
//       });
//     }
//   };

//   if (loading) return <ActivityIndicator size="large" color="#FF7622" style={styles.loader} />;
//   if (error) return <Text style={styles.errorText}>{error}</Text>;

//   return (
//     <ScrollView 
//       contentContainerStyle={styles.scrollContainer}
//       showsVerticalScrollIndicator={false}
//     >
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
//           <Ionicons name="arrow-back" size={24} color="white" />
//         </TouchableOpacity>
//         {offer?.offerImg && (
//           <Image 
//             source={{ uri: offer.offerImg }} 
//             style={styles.offerImage} 
//             resizeMode="contain"
//           />
//         )}
//         <Text style={styles.headerText}>{offer?.offerName}</Text>
//         <Text style={styles.subHeaderText}>Earn rewards and discounts</Text>
//       </View>

//       <View style={styles.content}>
//         <Text style={styles.sectionTitle}>Offer Overview</Text>

//         <View style={styles.card}>
//           <TouchableOpacity 
//             style={styles.businessContainer} 
//             onPress={handleBusinessProfilePress}
//           >
//             <Image
//               source={{ uri: offer?.businessId?.profileImage }}
//               style={styles.businessImage}
//             />
//             <View style={styles.businessTextContainer}>
//               <Text style={styles.businessName}>{offer?.businessId?.brandName}</Text>
//               <Text style={styles.businessDetails}>{offer?.businessId?.companyName}</Text>
//             </View>
//           </TouchableOpacity>

//           <View style={styles.divider} />

//           <Text style={styles.detailsTitle}>Key Details</Text>

//           <View style={styles.detailItem}>
//             <Text style={styles.detailLabel}>Offer Validity: </Text>
//             <Text style={styles.detailValue}>{offer?.offerExpireDate}</Text>
//           </View>

//           <View style={styles.detailItem}>
//             <Text style={styles.detailLabel}>Discount: </Text>
//             <Text style={[styles.detailValue, styles.discount]}>
//               {offer?.discount}%
//             </Text>
//           </View>
//         </View>

//         {!isCompleted && (
//           <TouchableOpacity 
//             style={styles.actionButton} 
//             onPress={handleClaimOffer}
//             activeOpacity={0.8}
//           >
//             <Text style={styles.actionButtonText}>Accept Offer</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   scrollContainer: {
//     flexGrow: 1,
//     backgroundColor: '#fff',
//   },
//   loader: {
//     marginTop: 50,
//     alignSelf: 'center',
//   },
//   errorText: {
//     color: 'red',
//     textAlign: 'center',
//     marginTop: 50,
//     fontSize: 16,
//   },
//   header: {
//     backgroundColor: '#FF7622',
//     padding: 20,
//     paddingTop: 50,
//     alignItems: 'center',
//   },
//   backButton: {
//     position: 'absolute',
//     left: 20,
//     top: 50,
//     zIndex: 1,
//   },
//   offerImage: {
//     width: 200,
//     height: 200,
//     borderRadius: 10,
//     marginBottom: 15,
//   },
//   headerText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: 'white',
//     textAlign: 'center',
//     marginBottom: 5,
//   },
//   subHeaderText: {
//     fontSize: 16,
//     color: 'white',
//     textAlign: 'center',
//     marginBottom: 15,
//   },
//   content: {
//     padding: 20,
//     paddingBottom: 40,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color: '#333',
//   },
//   card: {
//     backgroundColor: '#f9f9f9',
//     borderRadius: 12,
//     padding: 20,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   businessContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   businessImage: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     marginRight: 15,
//   },
//   businessTextContainer: {
//     flex: 1,
//   },
//   businessName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 3,
//   },
//   businessDetails: {
//     fontSize: 14,
//     color: '#666',
//   },
//   divider: {
//     height: 1,
//     backgroundColor: '#eee',
//     marginVertical: 15,
//   },
//   detailsTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 15,
//     color: '#333',
//   },
//   detailItem: {
//     flexDirection: 'row',
//     marginBottom: 12,
//     alignItems: 'center',
//   },
//   detailLabel: {
//     fontSize: 16,
//     color: '#666',
//   },
//   detailValue: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//   },
//   discount: {
//     color: '#FF7622',
//     fontWeight: 'bold',
//   },
//   actionButton: {
//     backgroundColor: '#FF7622',
//     padding: 16,
//     borderRadius: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 10,
//   },
//   actionButtonText: {
//     color: 'white',
//     fontSize: 18,
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