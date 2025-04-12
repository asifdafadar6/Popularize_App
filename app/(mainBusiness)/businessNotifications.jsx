import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const notifications = [
  {
    id: '1',
    title: 'New Collaboration Opportunity!',
    description: 'A brand wants to collaborate with you for their upcoming campaign. Check it out now!',
    time: '2 hrs ago',
    category: 'Today',
  },
  {
    id: '2',
    title: 'Earnings Update',
    description: 'You’ve earned $150 from your recent collaborations. Payout will be processed by 25 Jan, 2025.',
    time: '3 hrs ago',
    category: 'Today',
  },
  {
    id: '3',
    title: 'New Feature Alert!',
    description: 'You can now track your engagement metrics in real-time. Explore the new analytics dashboard.',
    time: '1 day ago',
    category: 'Yesterday',
  },
  {
    id: '4',
    title: 'Exclusive Invitation',
    description: 'You’ve been invited to join an exclusive influencer network. Apply before 28 Jan, 2025.',
    time: '1 day ago',
    category: 'Yesterday',
  },
  {
    id: '5',
    title: 'Campaign Performance Report',
    description: 'Your recent campaign achieved 120% of its target reach. View the detailed report.',
    time: '2 days ago',
    category: 'Older',
  },
  {
    id: '6',
    title: 'New Payout Processed',
    description: 'Your earnings of $200 have been credited to your account. Check your balance now.',
    time: '3 days ago',
    category: 'Older',
  },
  {
    id: '7',
    title: 'Reminder: Pending Collaboration',
    description: 'You have a pending collaboration request. Respond before 27 Jan, 2025.',
    time: '4 days ago',
    category: 'Older',
  },
  {
    id: '8',
    title: 'Platform Update',
    description: 'We’ve improved our influencer dashboard for better usability. Explore the new features!',
    time: '5 days ago',
    category: 'Older',
  },
];

export default function BusinessNotifications() {
  const groupedNotifications = notifications.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="black" onPress={()=>{router.back()}}/>
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
