import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PremiumConfirmation = () => {
  const { plantype: planTypeFromParams } = useLocalSearchParams(); // Get plantype from navigation params
  const [plantype, setPlantype] = useState(planTypeFromParams || ''); // Use params if available
  const router = useRouter();

  // Fetch plantype from AsyncStorage if not available in params
  useEffect(() => {
    const fetchPlantype = async () => {
      try {
        const storedPlantype = await AsyncStorage.getItem('plantype');
        if (storedPlantype) {
          setPlantype(storedPlantype);
        }
      } catch (error) {
        console.error('Failed to fetch plantype from AsyncStorage:', error);
      }
    };

    // Only fetch from AsyncStorage if plantype is not available in params
    if (!planTypeFromParams) {
      fetchPlantype();
    }
  }, [planTypeFromParams]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Congratulations</Text>
      <Image source={require('../../assets/images/cheackmark.png')} style={styles.image} />
      <Text style={styles.heading}>You're now a {plantype} Member!</Text>
      <Text style={styles.subtext}>
        Congratulations, You have successfully activated your premium plan. Enjoy it.
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/(tabs)')}>
        <Text style={styles.buttonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  
  },
  title: {
    fontSize: 30,
    fontWeight: "600",
    // marginTop: -80, 
    marginBottom: 50,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
    tintColor: "#FF7F00", 
  },
  heading: {
    fontSize: 25,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 5,
  },
  subtext: {
    fontSize: 14,
    textAlign: "center",
    color: "#888",
    marginBottom: 30,
    paddingHorizontal: 30,
  },
  button: {
    backgroundColor: "#ff6b00",
    borderRadius: 10,
    width:"100%",
    height:50,
    padding:12,  
    marginTop:200,  
  },
  buttonText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default PremiumConfirmation;