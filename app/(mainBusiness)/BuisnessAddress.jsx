import { useState, useEffect, useCallback } from "react";
import { 
  View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, StyleSheet 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect
import axios from "axios";
import { Feather, MaterialIcons, AntDesign } from "@expo/vector-icons";

const Addresses = () => {
  const router = useRouter();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  // Fetch user ID from AsyncStorage
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) {
          setUserId(storedUserId);
        } else {
          Alert.alert("Error", "User ID not found. Please log in again.");
        }
      } catch (error) {
        console.error("Error fetching userId:", error);
      }
    };

    fetchUserId();
  }, []);

  const fetchAddresses = async () => {
    if (!userId) return;
  
    try {
      setLoading(true);
      const response = await axios.get("https://popularizenode.apdux.tech/api/getAllAddress");
      if (response.status === 200) {
        const filteredAddresses = response.data.filter(
          (address) => address.userId && address.userId._id === userId
        );
        setAddresses(filteredAddresses);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      Alert.alert("Error", "Failed to load addresses.");
    } finally {
      setLoading(false);
    }
  };
  

  useFocusEffect(
    useCallback(() => {
      fetchAddresses();
    }, [userId])
  );

  const handleDelete = (id) => {
    Alert.alert(
      "Delete Address",
      "Are you sure you want to delete this address?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await axios.delete(`https://popularizenode.apdux.tech/api/deleteAddress/${id}`);
              if (response.status === 200) {
                fetchAddresses(); 
                Alert.alert("Success", "Address deleted successfully!");
              } else {
                Alert.alert("Error", "Failed to delete the address.");
              }
            } catch (error) {
              console.error("Error deleting address:", error);
              Alert.alert("Error", "Something went wrong.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backArrow} onPress={() => router.back()}>
        <Feather name="arrow-left" size={24} color="orange" />
      </TouchableOpacity>
      <Text style={styles.header}>My Address</Text>

      {loading ? (
        <ActivityIndicator size="large" color="orange" />
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.addressCard}>
              <View style={styles.addressInfo}>
                <Text style={styles.addressName}>{item.fullName}</Text>
                <Text style={styles.addressName}>{item.mobileNo}</Text>
                <Text style={styles.addressText}>{item.streetAddress}</Text>
                <Text style={styles.addressText}>{item.city}, {item.state} {item.zipCode}</Text>
                <Text style={styles.addressText}>{item.country}</Text>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={styles.editButton} 
                  onPress={() => router.push(`/editAddress?id=${item._id}`)}
                >
                  <Feather name="edit" size={20} color="white" />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.deleteButton} 
                  onPress={() => handleDelete(item._id)}
                >
                  <MaterialIcons name="delete" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<Text style={styles.noAddressText}>No Addresses Found</Text>}
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={() => router.push("/AddAddress")}>
        <Text style={styles.addButtonText}>+ Add New Address</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()} style={styles.backProfileContainer}>
        <AntDesign name="left" size={22} color="#ff6600" style={styles.backIcon} />
        <Text style={styles.backText}>BACK TO PROFILE</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', backgroundColor: '#f8f8f8', paddingVertical: 40, paddingHorizontal: 20 },
  backArrow: { position: 'absolute', left: 20, top: 40 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  listContainer: { paddingBottom: 20, width: "100%" },

  addressCard: {
    backgroundColor: "#fff",
    width: "100%",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    borderWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  addressInfo: { flex: 1 },
  addressName: { fontSize: 18, fontWeight: "bold", marginBottom: 5, color: "#333" },
  addressText: { fontSize: 14, color: "#555", marginBottom: 2 },

  buttonContainer: { flexDirection: "row" },

  editButton: { 
    backgroundColor: "#ffcc00", 
    padding: 10, 
    borderRadius: 8, 
    marginRight: 5 
  },

  deleteButton: { 
    backgroundColor: "#ff4444", 
    padding: 10, 
    borderRadius: 8 
  },

  addButton: { backgroundColor: '#ff6600', padding: 15, borderRadius: 10, alignItems: 'center', width: '100%', marginTop: 10 },
  addButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

  backProfileContainer: { flexDirection: "row", alignItems: "center", marginTop: 20 },
  backIcon: { marginRight: 5 },
  backText: { color: '#ff6600', fontSize: 14, fontWeight: 'bold' },
});

export default Addresses;
