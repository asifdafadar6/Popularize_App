// import React, { useState } from "react";
// import { 
//   View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet 
// } from "react-native";
// import { EvilIcons, Ionicons, Feather } from "@expo/vector-icons";
// import { router } from "expo-router";

// const offers = [
//   { id: "1", color: "#FF6B00", text: "Get $10 cashback on purchases above $50.", date: "30 Jan, 2025" },
//   { id: "2", color: "#007BFF", text: "Get $10 cashback on purchases above $50.", date: "30 Jan, 2025" },
//   { id: "3", color: "#005F3D", text: "Get $10 cashback on purchases above $50.", date: "30 Jan, 2025" },
// ];

// const indexInflu = () => {
//   const [searchQuery, setSearchQuery] = useState("");

//   const filteredOffers = offers.filter((offer) =>
//     offer.text.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <View style={styles.container}>
//       {/* Header Section */}
//       <View style={styles.header}>
//         <Text style={styles.headerText}>POPULARIZE</Text>
//         <TouchableOpacity style={styles.notificationIcon}>
//           <Ionicons name="notifications-outline" size={24} color="orange" />
//         </TouchableOpacity>
//       </View>

//       {/* Search Bar */}
//       <View style={styles.searchBar}>
//         <EvilIcons name="search" size={24} color="#FF7622" />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search offers by name or rewards"
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//         />
//       </View>

//       {/* Available Offers Section */}
//       <View style={styles.offerHeader}>
//         <Text style={styles.offerTitle}>Available Offers</Text>
//       </View>

//       <FlatList
//         data={filteredOffers}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View style={[styles.offerCard, { backgroundColor: item.color }]}>
//             <Text style={styles.offerText}>{item.text}</Text>
//             <Text style={styles.offerDate}>Due Date: {item.date}</Text>
//             <TouchableOpacity style={styles.claimButton}>
//               <Text style={[styles.claimText, { color: item.color }]}>Claim Offer</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       />

//       {/* Bottom Navigation */}
//       <View style={styles.bottomNav}>
//         <TouchableOpacity onPress={() => router.push("index")}>
//           <Feather name="home" size={24} color="#ccc" />
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => router.push("/search")}>
//           <EvilIcons name="search" size={24} color="black" />
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => router.push("/profile")}>
//           <Feather name="user" size={24} color="#ff8500" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default indexInflu;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "white",
//     padding: 20,
//   },
//   header: {
//     marginBottom: 20,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   headerText: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#ff6b00",
//   },
//   notificationIcon: {
//     backgroundColor: "#FF76221A",
//     padding: 4,
//     borderRadius: 4,
//   },
//   searchBar: {
//     backgroundColor: "#F6F8FA",
//     padding: 12,
//     borderRadius: 10,
//     elevation: 3,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },
//   searchInput: {
//     flex: 1,
//   },
//   offerHeader: {
//     padding: 10,
//   },
//   offerTitle: {
//     fontSize: 25,
//     fontWeight: "bold",
//     marginTop: 10,
//   },
//   offerCard: {
//     padding: 20,
//     borderRadius: 15,
//     marginVertical: 10,
//     gap: 10,
//   },
//   offerText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   offerDate: {
//     color: "#fff",
//     fontSize: 12,
//   },
//   claimButton: {
//     backgroundColor: "#fff",
//     paddingVertical: 8,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//     alignSelf: "flex-start",
//   },
//   claimText: {
//     fontWeight: "bold",
//   },
//   bottomNav: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     position: "absolute",
//     bottom: 20,
//     left: 20,
//     right: 20,
//     backgroundColor: "#fff",
//     padding: 5,
//     borderRadius: 20,
//     elevation: 5,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
// });


import { View, Text } from 'react-native'
import React from 'react'
import Popularize from '../(main)'

export default function index() {
  return (
    <Popularize/>
  )
}