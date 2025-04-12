import { View, Text, Image,StyleSheet,TouchableOpacity, StatusBar  } from 'react-native'
import React from 'react'
import { router } from 'expo-router';
import {MaterialIcons} from '@expo/vector-icons';


export default function Welcomescreen() {
  return (
    <View style={styles.container}>
       <StatusBar backgroundColor='#FFFFFF'/>

        <Image source={require('../../assets/images/image.png')} style={styles.welcomeImage}/>
      <View style={styles.startContainer}>
        <View style={styles.textContainer}>
            <Text style={{color:"#FF7622", fontSize:30,fontWeight:"600"}}>POPULARIZE</Text>
            <Text style={{color:"#FF7622", fontSize:12,fontWeight:"500"}}>TAG,PROMOTE,SUCCEDE</Text>
        </View>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/welcome')}>
            <Text style={styles.btntext}>GET STARTED</Text> 
            <MaterialIcons name="keyboard-double-arrow-right" size={24} color="#FFFFFF"/> 
      </TouchableOpacity>
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
        height:600,
        width:"100%",
        marginTop:10,
        borderBottomStartRadius:10,
    },
    startContainer:{
        backgroundColor:"#FFFFFF",
        height:250,
        width:"100%",
        borderRadius:20,
        position: "absolute",  // Make it overlap
        bottom: 0,  // Stick it to the bottom
        left: 0,  
        right: 0,
        marginTop: -10, // Move it up to overlap the image
        alignItems: "center",
        justifyContent: "center",
    },
    textContainer:{
        height:150,
        width:"100%",
        justifyContent:"center",
        alignItems:"center",
        // backgroundColor:"#000"
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
    },
    btntext:{
        color:"#FFFFFF",
        fontSize:14,
        fontWeight:"600"
    }

});