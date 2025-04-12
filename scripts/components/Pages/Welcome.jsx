import { View, Text, Image,StyleSheet,TouchableOpacity, StatusBar, activeIndex } from 'react-native'
import React from 'react'
import { router } from 'expo-router';
import {MaterialIcons} from '@expo/vector-icons';


export default function Welcome() {
  return (
    <View style={styles.container}>
       <StatusBar backgroundColor='#FFFFFF'/>

        <Image source={require('../../assets/images/image.png')} style={styles.welcomeImage}/>
      <View style={styles.startContainer}>
        <View style={styles.textContainer}>
            <Text style={{color:"#FF7622", fontSize:25,fontWeight:"500"}}>Sing Up As</Text>
        </View>
        <View style={{width:"100%", justifyContent:"space-between",alignItems:"center",padding:10,}}>
            <TouchableOpacity style={styles.button} onPress={() => router.push('/(authBusiness)')}>
                    <Text style={styles.btntext}>A BUSINESS</Text> 
            </TouchableOpacity>
            <Text style={{margin:10,fontSize:18}}>Or</Text>
            <TouchableOpacity style={styles.button} onPress={() => router.push('/(auth)')}>
                    <Text style={styles.btntext}>A INFLUENCER</Text> 
            </TouchableOpacity>
      </View>
      <View style={styles.container1}>
      <View style={[styles.dot, activeIndex === 0 && styles.activeDot]} />
      <View style={[styles.dot, activeIndex === 1 && styles.activeDot]} />
    </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({

    container:{
        flex:1,
        backgroundColor:"#FFFFFF",
        justifyContent: "flex-start", // Aligns image to the top
        alignItems: "center",
    },
    welcomeImage:{
        height:400,
        width:"100%",
        marginTop:10,
        borderBottomStartRadius:10,
    },
    startContainer:{
        backgroundColor:"#FFFFFF",
        height:400,
        width:"100%",
        borderRadius:20,
        position: "absolute",  // Make it overlap
        bottom: 0,  // Stick it to the bottom
        left: 0,  
        right: 0,
        marginTop: -20, // Move it up to overlap the image
        alignItems: "center",
        justifyContent: "center",
    },
    textContainer:{
        height:50,
        width:"100%",
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"",
        marginTop:-120,
    },
    button:{
        backgroundColor:"#FF7622",
        margin:10,
        height:50,
        width:"90%",
        justifyContent:"center",
        alignItems:"center",
        borderRadius:10,
        gap: 10,
        flexDirection:"row",
        borderWidth:1,
        borderColor:"#FFFFFF"
    },
    btntext:{
        color:"#",
        fontSize:14,
        fontWeight:"600"
    },
    container1: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
      },
      dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#FFD1A9", // Light color for inactive
        marginHorizontal: 5,
      },
      activeDot: {
        backgroundColor: "#FF7F00", // Active orange color
      },

});