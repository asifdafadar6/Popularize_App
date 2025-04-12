import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";

export default function DeleteAccount({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>POPULARIZE</Text>
        <Text style={styles.subTitle}>TAG, PROMOTE, SUCCEDE</Text>
      </View>

      <View style={styles.modalBox}>
        <TouchableOpacity style={styles.closeButton}>
          <AntDesign name="close" size={20} color="#888" />
        </TouchableOpacity>

        <Text style={styles.modalTitle}>Delete Account</Text>
        <Text style={styles.modalText}>
          Are you sure you want to delete your account? you can undo this?
        </Text>

        <TouchableOpacity style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>DELETE MY ACCOUNT</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton}>
          <TouchableOpacity style={styles.button} onPress={() => {
            router.push("/offer")
          }}>
            <Text style={styles.cancelButtonText}>CANCEL</Text>
          </TouchableOpacity>

        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "40%",
    backgroundColor: "#FF7F27",
    alignItems: "center",
    justifyContent: "center",
    // borderBottomLeftRadius: 40,
    // borderBottomRightRadius: 40,
  },
  backButton: {
    position: "absolute",
    left: 15,
    top: 50,
  },
  backText: {
    color: "#fff",
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  subTitle: {
    fontSize: 12,
    color: "#fff",
    marginTop: 5,
  },
  modalBox: {
    position: "absolute",
    top: "35%",
    width: "80%",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 12,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    fontSize: 15,
    color: "grey",
    textAlign: "center",
    marginVertical: 10,
  },
  deleteButton: {
    backgroundColor: "#FF7F27",
    paddingVertical: 12,
    width: "90%",
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#FF7F27",
    backgroundColor: "#fff",
    paddingVertical: 12,
    width: "90%",
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButtonText: {
    color: "#FF7F27",
    fontWeight: "bold",
    fontSize: 16,
  },
});
