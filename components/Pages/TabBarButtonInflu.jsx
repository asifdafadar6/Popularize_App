import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import React from "react";

export function TabBarButtonInflu({ onPress, isFocused, icon, label }) {
  return (
         <TouchableOpacity onPress={onPress} style={styles.button}>
             <View style={styles.iconContainer}>
                 {icon &&
                     typeof icon === "function" &&
                     icon({
                         size: isFocused ? 30 : 24, 
                         color: isFocused ? '#fff' : 'lightgray',
                     })}
                 {isFocused && <Text style={styles.label}>{label}</Text>}
             </View>
         </TouchableOpacity>
     );
}

const styles = StyleSheet.create({
  button: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
  },
  iconContainer: {
      flexDirection: "column",
      alignItems: "center",
      marginTop: 16,
  },
  label: {
      fontSize: 14,
      fontWeight: "bold",
      color: "orange",
      marginLeft: 5,
  },
});