import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, ActivityIndicator, StatusBar, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { SimpleLineIcons } from '@expo/vector-icons';
import RazorpayCheckout from 'react-native-razorpay';

const SubscriptionPlanPage = () => {
  const router = useRouter();
  const { planId, plantype } = useLocalSearchParams();
  console.log('Plan Id:', planId);

  const localPlans = [
    { id: 1, image: require('../../assets/images/Rectangle 4971.png'), offerName: "1 Extra Show each week", subheading: "Stand out from the crowd! Be seen by more people with an extra show each week" },
  ];

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");

        if (storedUserId && storedUserId.trim() !== "") {
          if (storedUserId !== userId) {
            setUserId(storedUserId.trim());
            console.log("Retrieved User ID:", storedUserId.trim());
          }
        } else {
          console.warn("No valid userId found in AsyncStorage.");
        }
      } catch (error) {
        console.error("Error retrieving userId:", error);
      }
    };

    getUserId();
  }, []);

  console.log('SubPlan id:', selectedPlan);

  const fetchPlans = useCallback(async () => {
    if (!userId || !planId) return; 
    setLoading(true);
  
    try {
      const response = await axios.get('https://popularizenode.apdux.tech/api/allsubplans');
      console.log("API Response:", response.data.data); 
  
      const filteredPlans = response.data.data.filter(plan => {
        if (!plan.planId) {
          return true;
        }
        return String(plan.planId._id) === String(planId);
      });
  
      setPlans(filteredPlans);
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
    } finally {
      setLoading(false);
    }
  }, [planId, userId]);

  useEffect(() => {
    if (userId) {
      fetchPlans();
    }
  }, [userId, fetchPlans]);

  if (loading) {
    return <ActivityIndicator size="large" color="#ff6b00" />;
  }

  const checkoutHandler = async (productid, amount, duration, userId) => {
    console.log("Selected Plan:", productid);
    console.log("Amount:", amount);
    console.log("User ID:", userId);
    console.log("Duration:", duration);

    try {
      if (amount == 0) {
        await axios.post("https://popularizenode.apdux.tech/api/paymentVerification", {
          amount,
          userId,
          productid,
          duration,
          status: "success",
        });
        router.push({ pathname: '/Congratulation', params: { plantype } });
      } else {
        const { data: keyData } = await axios.get("https://popularizenode.apdux.tech/api/getkey");
        const { key } = keyData;

        const { data: orderData } = await axios.post("https://popularizenode.apdux.tech/api/payment/process", {
          amount,
        });

        const { order } = orderData;
        console.log("Order Data:", order);

        var options = {
          description: 'Credits towards consultation',
          image: 'https://i.imgur.com/3g7nmJC.jpg',
          currency: 'INR',
          key: key,
          amount: amount * 100,
          name: 'Acme Corp',
          order_id: order.id,
          prefill: {
            email: 'gaurav.kumar@example.com',
            contact: '9191919191',
            name: 'Gaurav Kumar'
          },
          theme: { color: '#53a20e' }
        };

        RazorpayCheckout.open(options)
          .then(async (data) => {
            console.log('Payment Successful:', data);

            await AsyncStorage.setItem("paymentStatus", "success");

            await axios.post("https://popularizenode.apdux.tech/api/paymentVerification", {
              amount,
              userId,
              productid,
              duration,
              razorpay_payment_id: data.razorpay_payment_id,
              razorpay_order_id: data.razorpay_order_id,
              razorpay_signature: data.razorpay_signature,
              status: "success",
            });

            router.push('/Congratulation');
          })
          .catch(async (error) => {
            console.error(`Payment Error: ${error.code} | ${error.description}`);
            alert(`Payment Failed: ${error.description}`);
          });
      }
    } catch (error) {
      console.error("Error in checkoutHandler:", error);
      alert("Payment Failed. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor='#FFFFFF' />
      <Text style={styles.title}>{plantype} Plan</Text>

      <View>
        {localPlans.map((item) => (
          <View key={item.id} style={styles.planCard}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.offerName}>{item.offerName}</Text>
            <Text style={styles.subheading}>{item.subheading}</Text>
          </View>
        ))}
      </View>

      <FlatList
        data={plans}
        keyExtractor={(item) => item._id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedPlan(item._id);
              console.log("Selected Plan ID:", item._id);
            }}
          >
            <View style={[styles.subscriptionCard, selectedPlan === item._id && styles.selectedCard]}>
              <View style={styles.iconWrapper}>
                <SimpleLineIcons name="calendar" size={26} color="#FF6B00" />
              </View>
              <Text style={styles.planName}>{item.subplanname}</Text>
              <Text style={styles.planDetails}>{item.subplandetails}</Text>
              <Text style={styles.planPrice}>₹{item.subsellingprice}/month</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.subscribeButton}
        onPress={() => {
          const selectedPlanDetails = plans.find(plan => plan._id === selectedPlan);

          console.log("User ID:", userId);
          console.log("Selected Plan ID:", selectedPlan);
          console.log("Selected Plan Price:", selectedPlanDetails ? selectedPlanDetails.subsellingprice : "N/A");

          if (!userId) {
            console.warn("No user ID found. Please log in again.");
            return;
          }

          if (!selectedPlanDetails) {
            console.warn("No subscription plan selected. Please choose a plan.");
            return;
          }

          checkoutHandler(selectedPlan, selectedPlanDetails.subsellingprice, selectedPlanDetails.duration, userId);
        }}
      >
        <Text style={styles.subscribeText}>Subscribe Now</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
  planCard: {
    alignItems: "center",
    marginVertical: 15,
  },
  image: {
    marginTop: 40,
    width: 200,
    height: 200,
  },
  offerName: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  subheading: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
    marginBottom: 20,
  },
  subscriptionCard: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#F2F2F2",
    marginHorizontal: 10,
    alignItems: "center",
    width: 200,
    height: 160,
    marginTop: 60
  },
  selectedCard: {
    borderColor: "#FF6B00",
    borderWidth: 2,
    backgroundColor: "#FFF3E0",
  },
  iconWrapper: {
    marginBottom: 10,
  },
  planName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  planDetails: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
  },
  planPrice: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  subscribeButton: {
    backgroundColor: "#FF6B00",
    paddingVertical: 15,
    width: "90%",
    borderRadius: 10,
    alignItems: "center",
    marginBottom:20
  },
  subscribeText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SubscriptionPlanPage;
