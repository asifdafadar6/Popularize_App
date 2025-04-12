import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; // Importing for close icon
import { router } from "expo-router";

export default function AccountUpdate({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>POPULARIZE</Text>
        <Text style={styles.subTitle}>TAG, PROMOTE, SUCCEED</Text>
      </View>

      <View style={styles.modalBox}>
        <TouchableOpacity style={styles.closeButton}>
            <TouchableOpacity style={styles.button} onPress={()=>{
                        router.push("/DELETE")
                      }}>
                        <AntDesign name="close" size={22} color="#888" />
                      </TouchableOpacity>
          
        </TouchableOpacity>

        <Text style={styles.modalTitle}>Account Info Updated</Text>
        <Text style={styles.modalText}>Your account info has been successfully updated</Text>

        <TouchableOpacity style={styles.okButton} onPress={()=>{router.push('(tabs)')}}>
          <Text style={styles.okButtonText}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '35%',
    backgroundColor: '#FF7F27',
    alignItems: 'center',
    justifyContent: 'center',
    // borderBottomLeftRadius: 40,
    // borderBottomRightRadius: 40,
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top: 50,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  subTitle: {
    fontSize: 12,
    color: '#fff',
    marginTop: 5,
  },
  modalBox: {
    position: 'absolute',
    top: '32%', 
    width: '80%',
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 12,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  modalText: {
    fontSize: 16,
    color: 'grey',
    textAlign: 'center',
    marginVertical: 10,
  },
  okButton: {
    backgroundColor: '#FF7F27',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 20,
    width: '80%',
    maxWidth: 200,
    alignSelf: 'center',
  },
  okButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});
