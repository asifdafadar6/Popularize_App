import { View, Text, Image, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Swiper from 'react-native-swiper'; 

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" />

      <View style={styles.sliderContainer}>
        <Swiper autoplay={true} autoplayTimeout={3} showsPagination={true} dotStyle={styles.dot} activeDotStyle={styles.activeDot}>
          <Image source={require('../../assets/images/image.png')} style={styles.welcomeImage} />
          <Image source={require('../../assets/images/welcomeimage.jpg')} style={styles.welcomeImage} />
          <Image source={require('../../assets/images/welcomeImage1.jpg')} style={styles.welcomeImage} />
        </Swiper>
      </View>

      <View style={styles.startContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>POPULARIZE</Text>
          <Text style={styles.subtitle}>TAG, PROMOTE, SUCCEED</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/welcome')}>
          <Text style={styles.btnText}>GET STARTED</Text>
          <MaterialIcons name="keyboard-double-arrow-right" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  sliderContainer: {
    height: 600,
    width: "100%",
  },
  welcomeImage: {
    height: 600,
    width: "100%",
    resizeMode: "cover",
  },
  startContainer: {
    backgroundColor: "#FFFFFF",
    height: 250,
    width: "100%",
    borderRadius: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    height: 150,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#FF7622",
    fontSize: 30,
    fontWeight: "600",
  },
  subtitle: {
    color: "#FF7622",
    fontSize: 12,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#FF7622",
    margin: 10,
    height: 50,
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    flexDirection: "row",
  },
  btnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 5,
  },
  dot: {
    backgroundColor: "#D3D3D3",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: "#FF7622",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
