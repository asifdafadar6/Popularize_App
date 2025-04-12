import React, { useState } from "react";
import { View, Text, TouchableOpacity, Switch, StyleSheet } from "react-native";

const SubscriptionPlan = () => {
  const [selectedPlan, setSelectedPlan] = useState("premium");
  const [autoRecurring, setAutoRecurring] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Plan</Text>
      <Text style={styles.subtitle}>
        Be the chance to get exclusive offers and the latest news on our product directly in application.
      </Text>

      <TouchableOpacity
        style={[styles.plan, selectedPlan === "basic" && styles.selectedPlan]}
        onPress={() => setSelectedPlan("basic")}
      >
        <Text style={styles.planTitle}>Basic</Text>
        <Text style={styles.planT}>Lorem Ipum</Text>
        <Text style={styles.planPrice}>$9.99/year</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.plan, selectedPlan === "premium" && styles.selectedPlan]}
        onPress={() => setSelectedPlan("premium")}
      >
        <Text style={styles.planTitle}>Premium</Text>
        <Text style={styles.planPrice}>$39.99/year</Text>
        <View style={styles.discountBadge}><Text style={styles.discountText}>50% OFF</Text></View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.plan, selectedPlan === "free" && styles.selectedPlan]}
        onPress={() => setSelectedPlan("free")}
      >
        <Text style={styles.planTitle}>Free</Text>
        <Text style={styles.planPrice}>$0 / 7 Day trials</Text>
      </TouchableOpacity>

      <View style={styles.switchContainer}>
        <Text>Auto recurring</Text>
        <Switch value={autoRecurring} onValueChange={setAutoRecurring} />
      </View>

      <Text style={styles.discountText}>$79.99/year → $39.99/year (50% OFF)</Text>
      
      <TouchableOpacity style={styles.subscribeButton}>
        <Text style={styles.subscribeText}>Subscribe Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginVertical: 10,
    color: "gray",
  },
  plan: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: 5,
    borderColor: "#ccc",
  },
  selectedPlan: {
    backgroundColor: "#ff9f43",
    borderColor: "#ff9f43",
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
});

export default SubscriptionPlan