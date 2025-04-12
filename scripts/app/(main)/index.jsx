import React, { useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from "expo-router";


const offers = [
  { id: "1", color: "#FF6B00", text: "Get $10 cashback on purchases above $50.", date: "30 Jan, 2025" },
  { id: "2", color: "#007BFF", text: " Get $10 cashback on purchases above $50.", date: "30 Jan, 2025" },
  { id: "3", color: "#005F3D", text: " Get $10 cashback on purchases above $50.", date: "30 Jan, 2025" },
];

const Popularize = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOffers = offers.filter((offer) =>
    offer.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: "White", padding: 20 }}>
      <View style={{ marginBottom: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: "#ff6b00" }}>POPULARIZE</Text>
        
        <TouchableOpacity style={{backgroundColor:"#FF76221A",padding:4,borderRadius:4,}}>
        <Ionicons name="notifications-outline" size={24} color="orange" />

        </TouchableOpacity>
        
      </View>
      
<View style={{ backgroundColor: "#F6F8FA", padding: 12, borderRadius: 10, elevation: 3,flexDirection:"row",alignItems:"center",gap:6, }}>
<EvilIcons name="search" size={24} color="#FF7622" />
      <TextInput
        style={{ flex:1, }}
       
        placeholder="Search offers by name or rewards"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      </View>
<View style={{padding:10,}}>
      <Text style={{ fontSize: 25, fontWeight: "bold", marginTop: 10 }}>Available Offers</Text>
      
      
      </View>

      <FlatList
        data={filteredOffers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: item.color, padding: 20, borderRadius: 15, marginVertical: 10 ,gap:30,}}>
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>{item.text}</Text>
            <Text style={{ color: "#fff", fontSize: 12, marginVertical: 5 }}>Due Date: {item.date}</Text>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <TouchableOpacity style={{ backgroundColor: "#fff", paddingVertical: 8, paddingHorizontal: 20, borderRadius: 5 }}>
                <Text style={{ color: item.color, fontWeight: "bold" }}>Claim Offer</Text>
              </TouchableOpacity>

              
            </View>
            
          </View>
        )}
      />
      <View style={styles.socialContainer}>
                <TouchableOpacity>
                  
                            
                               <Image source={require("../../assets/images/homeicon.png")} style={styles.socialIcons} />
                            
                 
                </TouchableOpacity>
                
                <TouchableOpacity>
                  
                            <TouchableOpacity onPress={()=>{
                              router.push("/search")
                            }}>
                               <Image source={require("../../assets/images/magnifying-glass.png")} style={styles.socialIcons} />
                            </TouchableOpacity>
                  
                 
                </TouchableOpacity>
                <TouchableOpacity>
                  <TouchableOpacity onPress={()=>{ router.push("/profile")
                   }}>
 <Image source={require("../../assets/images/user.png")} style={styles.socialIcons} />
                   </TouchableOpacity>
                 
                </TouchableOpacity>
              </View>
    </View>
  );
};

export default Popularize;


const styles = StyleSheet.create({
  socialIcons: {
    height: 30,
    width: 30,
    resizeMode: "contain",
  },
  socialContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 20,
  },
});
