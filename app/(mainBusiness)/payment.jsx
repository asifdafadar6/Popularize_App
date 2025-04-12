import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { router } from "expo-router";

const PaymentMethodScreen = () => {
  const [selectedMethod, setSelectedMethod] = useState("Credit Card");

  const paymentMethods = [
    { id: "Credit Card", icon: require("../../assets/images/mastercard.png") },
    { id: "Paypal", icon: require("../../assets/images/Paypal.png") },
    { id: "UPI", icon: require("../../assets/images/Google pay.png") }, // Ensure it's a PNG or JPEG
  ];

  const cost = 20.0;
  const tax = 5.0;
  const discount = 0.1 * cost; 
  const total = (cost + tax - discount).toFixed(2); 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Method</Text>

      {paymentMethods.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={[
            styles.paymentOption,
            selectedMethod === method.id && styles.selectedOption,
          ]}
          onPress={() => setSelectedMethod(method.id)}
        >
          <View style={styles.optionContent}>
            <Image source={method.icon} style={styles.icon} />
            <Text style={styles.paymentText}>{method.id}</Text>
          </View>
          <View style={selectedMethod === method.id ? styles.selectedCircle : styles.circle} />
        </TouchableOpacity>
      ))}

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Pricing Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Cost</Text>
          <Text style={styles.summaryText}>${cost.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Tax</Text>
          <Text style={styles.summaryText}>${tax.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Discount</Text>
          <Text style={styles.summaryText}>10% (-${discount.toFixed(2)})</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.summaryRow}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalPrice}>${total}</Text>
        </View>
      </View>

        <TouchableOpacity style={styles.button} onPress={()=>{
                    router.push("/paymentMethod")
                  }}>
                    <Text style={styles.buttonText}>Confirm Payment</Text>
                  </TouchableOpacity>
        
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    // marginBottom: 20,
    paddingBottom:80
  },
  paymentOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedOption: {
    borderColor: "#FF7F00",
    backgroundColor: "#FFF3E0",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  paymentText: {
    fontSize: 16,
    fontWeight: "500",
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#888",
  },
  selectedCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FF7F00",
    backgroundColor: "#FF7F00",
  },
  summaryContainer: {
    backgroundColor: "#F9F9F9",
    padding: 15,
    borderRadius: 10,
    marginTop: 100,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  summaryText: {
    fontSize: 10,
    color: "#666",
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc", 
    marginVertical: 10,
    width: "100%",
  },
  totalText: {
    fontSize: 16,
    fontWeight: "600",
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF7F00",
  }, 
  button: {
    backgroundColor: "#ff6b00",
    paddingVertical: 15 ,
    borderRadius: 10,
    marginTop: 50,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PaymentMethodScreen;
