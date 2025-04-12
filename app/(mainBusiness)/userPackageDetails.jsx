import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';

const UserPackageDetails = () => {
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  const calculateRemainingDays = (expiryDate) => {
    if (!expiryDate) return 'N/A';
    
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? `${diffDays} days remaining` : 'Expired';
  };

  const fetchUserData = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (storedUserId) setUserId(storedUserId);

      const response = await axios.get('https://popularizenode.apdux.tech/api/getAllPayment');

      if (response.data.success) {
        const userPayments = response.data.payments.filter(
          (payment) => payment.userId === storedUserId
        );
        setPaymentDetails(userPayments);
      }
    } catch (error) {
      console.error('Error fetching payment details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AntDesign 
        name="left" 
        size={24} 
        color="black" 
        onPress={() => router.back()}
        style={styles.backButton}
      />
      
      {paymentDetails.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No Payment Details Found</Text>
        </View>
      ) : (
        paymentDetails.map((payment) => (
          <View key={payment._id} style={styles.card}>
            <Text style={styles.cardTitle}>Payment Details</Text>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Plan Name:</Text>
              <Text style={styles.detailValue}>
                {payment.productid?.subplanname || 'N/A'}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Plan Details:</Text>
              <Text style={styles.detailValue}>
                {payment.productid?.subplandetails || 'N/A'}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Amount:</Text>
              <Text style={styles.detailValue}>₹{payment.amount}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status:</Text>
              <Text style={[
                styles.detailValue, 
                { 
                  color: payment.status === 'success' ? '#4CAF50' : '#F44336',
                  fontWeight: 'bold'
                }
              ]}>
                {payment.status}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Plan Expiry:</Text>
              <Text style={styles.detailValue}>
                {payment.planExpire ? new Date(payment.planExpire).toDateString() : 'N/A'}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Duration:</Text>
              <Text style={styles.detailValue}>
                {payment.productid?.duration} {payment.productid?.durationTime || ''}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Remaining:</Text>
              <Text style={[
                styles.detailValue,
                { 
                  color: calculateRemainingDays(payment.planExpire).includes('Expired') 
                    ? '#F44336' 
                    : '#4CAF50',
                  fontWeight: 'bold'
                }
              ]}>
                {calculateRemainingDays(payment.planExpire)}
              </Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  noDataText: {
    fontSize: 18,
    color: '#666',
  },
  card: {
    backgroundColor: '#fff',
    marginVertical: 10,
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  backButton: {
    marginBottom: 15,
    padding: 5,
  },
});

export default UserPackageDetails;