import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const notification = [
  {
    id: '1',
    title: 'New Cashback Offer Available!',
    description: 'Claim your $10 cashback on purchases above $50 before 30 Jan, 2025.',
    time: '2 hrs ago',
    category: 'Today',
  },
  {
    id: '2',
    title: 'New Cashback Offer Available!',
    description: 'Claim your $10 cashback on purchases above $50 before 30 Jan, 2025.',
    time: '2 hrs ago',
    category: 'Today',
  },
  {
    id: '3',
    title: 'New Cashback Offer Available!',
    description: 'Claim your $10 cashback on purchases above $50 before 30 Jan, 2025.',
    time: '2 hrs ago',
    category: 'Yesterday',
  },
  {
    id: '4',
    title: 'New Cashback Offer Available!',
    description: 'Claim your $10 cashback on purchases above $50 before 30 Jan, 2025.',
    time: '2 hrs ago',
    category: 'Yesterday',
  },
];

export default function notifications() {
  const groupedNotifications = notification.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.headerText}>Notifications</Text>
      </View>

      {/* Notifications List */}
      {Object.keys(groupedNotifications).map((category) => (
        <View key={category}>
          <Text style={styles.categoryTitle}>{category}</Text>
          <FlatList
            data={groupedNotifications[category]}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.notificationCard}>
                {/* Icon Instead of Image */}
                <Ionicons name="gift-outline" size={40} color="#FF7622" style={styles.icon} />

                <View style={styles.notificationText}>
                  <Text style={styles.notificationTitle}>{item.title}</Text>
                  <Text style={styles.notificationDescription}>{item.description}</Text>
                </View>
                <Text style={styles.time}>{item.time}</Text>
              </View>
            )}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginVertical: 10,
    marginTop: 15,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  icon: {
    marginRight: 10,
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
  notificationDescription: {
    fontSize: 12,
    color: 'gray',
  },
  time: {
    fontSize: 12,
    color: 'gray',
  },
});
