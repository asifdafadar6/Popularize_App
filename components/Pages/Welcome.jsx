import { View, Text, Image, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import Swiper from 'react-native-swiper';
import { LinearGradient } from 'expo-linear-gradient';

export default function Welcome() {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" />

      <View style={styles.sliderContainer}>
        <Swiper autoplay={true} autoplayTimeout={3} showsPagination={true} dotStyle={styles.dot} activeDotStyle={styles.activeDot}>
          <Image source={require('../../assets/images/image.png')} style={styles.welcomeImage} />
          <Image source={require('../../assets/images/welcomeImage2.jpg')} style={styles.welcomeImage} />
        </Swiper>
      </View>

      <View style={styles.startContainer}>
        <Text style={styles.title}>Join Us As</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => router.push({ pathname: '/(authBusiness)', params: { userType: "business" } })}>
            <LinearGradient colors={["#FF7622", "#FF9A5A"]} style={styles.button}>
              <Text style={styles.btnText}>A BUSINESS</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push({ pathname: '/(auth)', params: { userType: "influencer" } })}>
            <LinearGradient colors={["#FF7622", "#FF9A5A"]} style={styles.button}>
              <Text style={styles.btnText}>AN INFLUENCER</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  sliderContainer: {
    flex: 1, 
  },
  welcomeImage: {
    width: "100%",
    height: "75%",
    resizeMode: "cover",
  },
  startContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "30%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5, 
    shadowColor: "#000", 
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 5,
  },
  title: {
    color: "#FF7622",
    fontSize: 25,
    fontWeight: "500",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    height: 50,
    width: 150, 
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25, 
    shadowColor: "#FF7622",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  btnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
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
