import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OnGoingOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userInfluId = await AsyncStorage.getItem('userinfluId');
      if (!userInfluId) {
        throw new Error('User ID not found');
      }

      const token = await AsyncStorage.getItem('userInfluToken');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.get(
        'https://popularizenode.apdux.tech/api/getofferbyinflu',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log('token',token);
      

      if (response.data && response.data.success) {
        const formattedOffers = response.data.offersWithBusinessDetails.map((offer, index) => ({
          id: offer._id || `offer-${index}`, 
          offerId: offer.offerId,
          businessDetails: offer.businessDetails,
          isComplete: offer.isComplete || 'ongoing', 
          createdAt: offer.createdAt
        }));
        setOffers(formattedOffers);
      } else {
        throw new Error(response.data?.message || 'No offers found');
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
      setError(error.response?.data?.message || error.message || 'Failed to fetch offers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.offerCard}
      onPress={() => router.push({
        pathname: '/offerDetails',
        params: { 
          offerId: item.offerId._id,
          businessDetails: JSON.stringify(item.businessDetails)
        }
      })}
    >
      <Image 
        source={{ uri: item.offerId.offerImg || 'https://via.placeholder.com/70' }} 
        style={styles.offerImage} 
        resizeMode="cover"
      />
      <View style={styles.offerInfo}>
        <Text style={styles.offerName} numberOfLines={1}>
          {item.offerId.offerName || 'No Name'}
        </Text>
        <Text style={styles.businessName} numberOfLines={1}>
          {item.businessDetails.companyName || item.businessDetails.userName || 'Unknown Business'}
        </Text>
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusBadge,
            item.isComplete.toLowerCase() === 'complete' ? styles.completedBadge : styles.ongoingBadge
          ]}>
            <Text style={styles.statusText}>
              {item.isComplete.toLowerCase() === 'complete' ? 'Completed' : 'Ongoing'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7622" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="warning-outline" size={40} color="#FF7622" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchOffers}
        >
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FF7622" />
        </TouchableOpacity>
        <Text style={styles.header}>Ongoing Offers</Text>
      </View>

      {offers.length > 0 ? (
        <FlatList
          data={offers}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={60} color="#CCCCCC" />
              <Text style={styles.emptyText}>No offers available</Text>
            </View>
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={60} color="#CCCCCC" />
          <Text style={styles.emptyText}>No ongoing offers found</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchOffers}
          >
            <Text style={styles.retryText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 8,
  },
  backButton: {
    marginRight: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  listContent: {
    paddingBottom: 20,
  },
  offerCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  offerImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  offerInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  offerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  businessName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ongoingBadge: {
    backgroundColor: '#FFF3E0',
  },
  completedBadge: {
    backgroundColor: '#E8F5E9',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginVertical: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#FF7622',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryText: {
    color: '#FFF',
    fontWeight: '600',
  },
});