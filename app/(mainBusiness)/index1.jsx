import React, { useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from "expo-router";
import { MaterialIcons, Feather } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const offers = [
  { id: "1", color: "#FF6B00", text: "Get $10 cashback on purchases above $50.", date: "30 Jan, 2025" },
  { id: "2", color: "#007BFF", text: "Get $10 cashback on purchases above $50.", date: "30 Jan, 2025" },
  { id: "3", color: "#005F3D", text: "Get $10 cashback on purchases above $50.", date: "30 Jan, 2025" },
];

const Popularize = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOffers = offers.filter((offer) =>
    offer.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF", padding: 20 }}>
      <View style={styles.header}>
        <View>
        <Text style={styles.title}>POPULARIZE</Text>
        <Text style={{fontSize:10,color:"#FF7622"}}>TAG,PROMOTE,SUCCEDE</Text>
        </View>
        <TouchableOpacity style={styles.notificationIcon}>
          <Ionicons name="notifications-outline" size={24} color="orange" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <EvilIcons name="search" size={28} color="#FF7622" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search offers by name or rewards"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.offersHeader}>
        <Text style={styles.offersTitle}>Ongoing Offers</Text>
      </View>

            <View style={{ flex: 1, }}>
                <FlatList
                  data={filteredOffers}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <View style={[styles.offerCard, { backgroundColor: item.color }]}>
                      <Text style={styles.offerText}>{item.text}</Text>
                      <Text style={styles.offerDate}>Due Date: {item.date}</Text>
                      <TouchableOpacity style={styles.claimButton}>
                        <Text style={{ color: item.color, fontWeight: "bold" }}>Claim Offer</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  showsVerticalScrollIndicator={false} 
                  keyboardShouldPersistTaps="handled"
                />
            </View>

      {/* Bottom Navigation */}
      {/* <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.push("/")}>
          <Feather name="home" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/Search")}>
        <FontAwesome name="history" size={24} color="black" />
            </TouchableOpacity>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => router.push("/Profile")}>
          <Feather name="user" size={24} color="#ff8500" />
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

export default Popularize;

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff6b00",
  },
  notificationIcon: {
    backgroundColor: "#FF76221A",
    padding: 4,
    borderRadius: 4,
  },
  searchContainer: {
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
  offersHeader: {
    padding: 10,
  },
  offersTitle: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 10,
  },
  offerCard: {
    padding: 20,
    borderRadius: 15,
    marginVertical: 10,
    gap: 30,
  },
  offerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  offerDate: {
    color: "#fff",
    fontSize: 12,
    marginVertical: 5,
  },
  claimButton: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
