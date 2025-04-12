import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Switch, StyleSheet, StatusBar, FlatList, ActivityIndicator } from "react-native";
import { Fontisto, Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const SubscriptionPlan = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get("https://popularizenode.apdux.tech/api/getAllPlans");
        console.log("Fetched Plans:", response.data);
        setPlans(response.data.data);
      } catch (err) {
        console.error("Error fetching plans:", err);
        setError("Failed to load plans. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSubscription = async () => {
    if (!selectedPlan) {
      Alert.alert("Select a Plan", "Please select a plan before proceeding.");
      return;
    }

    const selectedPlanDetails = plans.find(plan => plan._id === selectedPlan);
    if (selectedPlanDetails) {
      try {
        await AsyncStorage.setItem("plantype", selectedPlanDetails.plantype);
        console.log("Plan type stored successfully:", selectedPlanDetails.plantype);

        console.log("Navigating with Plan ID:", selectedPlan, "and Plan Type:", selectedPlanDetails.plantype);
        router.push({
          pathname: '/subscribeSubPlans',
          params: { planId: selectedPlan, plantype: selectedPlanDetails.plantype }
        });
      } catch (storageError) {
        console.error("Failed to store plantype in AsyncStorage:", storageError);
        Alert.alert("Error", "Failed to save plan details. Please try again.");
      }
    }
  };

  const handleSkip = () => {
    console.log("Skipping subscription...");
    router.push('/(tabs)'); // Navigates to (tabs)
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" />
      <View style={{ marginTop: 50 }}>
        <Text style={styles.title}>Choose Your Plan</Text>
        <Text style={styles.subtitle}>
          Be the chance to get exclusive offers and the latest news on our product directly in application.
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#ff6b00" style={{ marginTop: 30 }} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <View style={{ marginTop: 30 }}>
          <FlatList
            data={plans}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.planContainer,
                  selectedPlan === item._id && styles.selectedPlan,
                ]}
                onPress={() => setSelectedPlan(item._id)}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {selectedPlan === item._id ? (
                    <Feather name="check-circle" size={24} color="#ff6b00" style={{ marginRight: 15, marginBottom: 30 }} />
                  ) : (
                    <Fontisto name="radio-btn-passive" size={24} color="gray" style={{ marginRight: 15, marginBottom: 30 }} />
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 20, fontWeight: "600" }}>{item.plantype}</Text>
                    {item.plantype !== "Free" && <Text style={styles.discount}>{item.discount} OFF</Text>}

                    <Text style={{ fontSize: 14, color: "gray", margin: 2 }}>{item.planname} - {item.duration}</Text>
                    <Text style={{ fontSize: 14 }}>
                      {item.plantype !== "Free" ? (
                        <>
                          <Text style={{ textDecorationLine: "line-through", color: "gray" }}>₹{item.originalprice}</Text> → ₹{item.sellingprice}
                        </>
                      ) : (
                        <Text>₹{item.sellingprice}</Text>
                      )}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscription}>
        <Text style={styles.subscribeText}>Subscribe Now</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
    color: "gray",
  },
  planContainer: {
    borderRadius: 20,
    padding: 15,
    borderWidth: 2,
    borderColor: "#E5E5E5",
    marginTop: 20,
  },
  selectedPlan: {
    borderColor: "#ff6b00",
    backgroundColor: "#FFF2E9",
  },
  planTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  planPrice: {
    fontSize: 14,
    color: "gray",
  },
  discountBadge: {
    backgroundColor: "#ff6347",
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
  },
  discount: {
    position: "absolute",
    top: 0,
    left: 200,
    backgroundColor: "#ff6b00",
    borderRadius: 20,
    width: "30%",
    textAlign: "center",
    padding: 4,
    marginRight:18
  },
  discountText: {
    color: "#fff",
    fontWeight: "bold",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,

  },
  subscribeButton: {
    backgroundColor: "#ff6b00",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  subscribeText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",

  },
  skipButton: {
    backgroundColor: "gray",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  skipText: {
    color: "#fff",
    // fontSize: 16,
    fontWeight: "bold",
  },
});

export default SubscriptionPlan