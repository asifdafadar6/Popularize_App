import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch } from "react-native";
import { router } from "expo-router";

const CardPaymentScreen = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiry, setExpiry] = useState("");
  const [fullName, setFullName] = useState("");
  const [saveDetails, setSaveDetails] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Method</Text>
      <View style={styles.cardContainer}>
        <Text style={styles.cardTitle}>Debit / Credit Card</Text>

        <Text style={styles.label}>Card Number</Text>
        <TextInput
          style={styles.input}
          placeholder="1234 5678 9012 3456"
          keyboardType="numeric"
          value={cardNumber}
          onChangeText={setCardNumber}
        />

        <View style={styles.row}>
          <View style={[styles.halfInputContainer, { marginRight: 10 }]}>
            <Text style={styles.label}>CVV/CVC No.</Text>
            <TextInput
              style={styles.input}
              placeholder="000"
              keyboardType="numeric"
              secureTextEntry
              value={cvv}
              onChangeText={setCvv}
            />
          </View>
          <View style={styles.halfInputContainer}>
            <Text style={styles.label}>Valid Thru</Text>
            <TextInput
              style={styles.input}
              placeholder="MM/YYYY"
              keyboardType="numeric"
              value={expiry}
              onChangeText={setExpiry}
            />
          </View>
        </View>

        <Text style={styles.label}>Full Name</Text>

        <TextInput
          style={styles.input}
          placeholder="John Doe"
          value={fullName}
          onChangeText={setFullName}
        />     

        <TouchableOpacity style={styles.button} onPress={()=>{router.push("/Congratulation")}}>
            <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
         
        <View style={styles.checkboxContainer}>
          <Switch
            value={saveDetails}
            onValueChange={setSaveDetails}
          />
          <Text style={styles.checkboxText}>Save details for future</Text>
        </View>
      </View>
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
    fontSize: 30,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 80,
  },
  cardContainer: {
    backgroundColor: "#F9F9F9",
    padding: 15,
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 10,
    padding:5
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    paddingHorizontal: 20 ,
    backgroundColor: "#FFFFFF",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInputContainer: {
    flex: 1,
  },
  button: {
    backgroundColor: "#ff6b00",
    paddingVertical: 3,
    borderRadius: 5,
    marginTop: 8,
    alignItems: "center",
    height:40,
    marginTop:20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginTop:5
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  checkboxText: {
    fontSize: 12,
    marginLeft: 8,
  },
});

export default CardPaymentScreen;
