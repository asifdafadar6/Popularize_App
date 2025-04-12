import { useState, useEffect, useCallback } from "react";
import {
  View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import axios from "axios";
import { Feather, MaterialIcons, AntDesign } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

const InfluAddress = () => {
  const router = useRouter();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userinfluId, setUserinfluId] = useState(null);

  const fetchAddresses = async (userId) => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await axios.get("https://popularizenode.apdux.tech/api/getAllAddress");
      if (response.status === 200) {
        const filteredAddresses = response.data.filter(
          (address) => address.userId && address.userId._id === userId
        );
        setAddresses(filteredAddresses);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      Alert.alert("Error", "Failed to load addresses. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserId = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("userinfluId");
      if (storedUserId) {
        setUserinfluId(storedUserId);
      } else {
        Alert.alert("Error", "User ID not found. Please log in again.");
      }
    } catch (error) {
      console.error("Error fetching userinfluId:", error);
      Alert.alert("Error", "Failed to retrieve user information.");
    }
  };

  useEffect(() => {
    fetchUserId();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (userinfluId) fetchAddresses(userinfluId);
    }, [userinfluId])
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
              const response = await axios.delete(
                `https://popularizenode.apdux.tech/api/deleteAddress/${id}`
              );
              if (response.status === 200) {
                fetchAddresses(userinfluId);
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
                <Text style={styles.addressText}>{item.mobileNo}</Text>
                <Text style={styles.addressText}>{item.streetAddress}</Text>
                <Text style={styles.addressText}>
                  {item.city}, {item.state} {item.zipCode}
                </Text>
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
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/AddAddress")}
      >
        <Text style={styles.addButtonText}>+ Add New Address</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backProfileContainer}
      >
        <AntDesign name="left" size={22} color="#ff6600" style={styles.backIcon} />
        <Text style={styles.backText}>BACK TO PROFILE</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  backArrow: {
    marginBottom: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  addressCard: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addressInfo: {
    flex: 1,
  },
  addressName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  addressText: {
    fontSize: 14,
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
  },
  editButton: {
    backgroundColor: "orange",
    padding: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 8,
    borderRadius: 4,
  },
  listContainer: {
    paddingBottom: 16,
  },
  addButton: {
    backgroundColor: "orange",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backProfileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    marginRight: 8,
  },
  backText: {
    color: "#ff6600",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default InfluAddress;