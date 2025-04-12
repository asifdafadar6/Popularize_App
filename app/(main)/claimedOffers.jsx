import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

const claimedOffersData = [
  {
    id: '1',
    offerName: 'Earn $20 bonus for every 1,000 followers!',
    claimedDate: '22/03/2025',
    discount: '20%',
    image: 'https://example.com/images/bonus.jpg',
  },
  {
    id: '2',
    offerName: 'Flash Sale - Get 40% off on all products!',
    claimedDate: '25/03/2025',
    discount: '40%',
    image: 'https://example.com/images/flash-sale.jpg',
  },
  {
    id: '3',
    offerName: 'Buy One Get One Free - Limited Time!',
    claimedDate: '28/03/2025',
    discount: '50%',
    image: 'https://example.com/images/bogo.jpg',
  },
];

export default function ClaimedOffers() {
  const renderOfferItem = ({ item }) => (
    <View style={styles.offerCard}>
      <Image source={{ uri: item.image }} style={styles.offerImage} />
      <View style={styles.offerDetails}>
        <Text style={styles.offerName}>{item.offerName}</Text>
        <Text style={styles.claimedDate}>Claimed on: {item.claimedDate}</Text>
        <Text style={styles.discount}>Discount: {item.discount}</Text>

        <TouchableOpacity style={styles.taskButton} onPress={() => alert('Task Started!')}>
          <Text style={styles.taskButtonText}>Start Task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
         <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                  <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
      <Text style={styles.header}>Accepted Offers</Text>
      <FlatList
        data={claimedOffersData}
        keyExtractor={(item) => item.id}
        renderItem={renderOfferItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  offerCard: {
    flexDirection: 'row',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  offerImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  offerDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  offerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  claimedDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  discount: {
    fontSize: 14,
    color: '#FF6B00',
    fontWeight: 'bold',
  },
  taskButton: {
    marginTop: 8,
    backgroundColor: '#FF6B00',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  taskButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
