import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";

const EditAddress = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [address, setAddress] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) {
            Alert.alert("Error", "No Address ID provided.");
            router.back();
            return;
        }

        const fetchAddress = async () => {
            try {
                console.log(`Fetching Address ID: ${id}`);
                const response = await axios.get(`https://popularizenode.apdux.tech/api/getAddressById/${id}`);

                if (response.status === 200 && response.data) {
                    setAddress(response.data);
                } else {
                    Alert.alert("Error", "Address not found.");
                    router.back();
                }
            } catch (error) {
                console.error("Error fetching address:", error);
                Alert.alert("Error", "Failed to load address.");
                router.back();
            } finally {
                setLoading(false);
            }
        };

        fetchAddress();
    }, [id]);

    const handleChange = (field, value) => {
        setAddress((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        try {
            console.log(`Updating Address ID: ${id}`, address);
            const response = await axios.put(`https://popularizenode.apdux.tech/api/editAddress/${id}`, address);

            if (response.status === 200) {
                Alert.alert("Success", "Address updated successfully!");
                router.back();
            } else {
                Alert.alert("Error", "Failed to update address.");
            }
        } catch (error) {
            console.error("Error updating address:", error);
            Alert.alert("Error", "Failed to update address. Please try again.");
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="orange" />;
    }

    if (!address) {
        return <Text style={{ padding: 20, fontSize: 18 }}>No address found.</Text>;
    }

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Edit Address</Text>

            <Text>Full Name</Text>
            <TextInput
                placeholder="Full Name"
                value={address.fullName}
                onChangeText={(text) => handleChange("fullName", text)}
                style={{ borderBottomWidth: 1, padding: 10, fontSize: 16 }}
            />

            <Text>Mobile No.</Text>
            <TextInput
                placeholder="Mobile No."
                value={address.mobileNo}
                onChangeText={(text) => handleChange("mobile", text)}
                style={{ borderBottomWidth: 1, padding: 10, fontSize: 16 }}
            />

            <Text>Street Address</Text>
            <TextInput
                placeholder="Street Address"
                value={address.streetAddress}
                onChangeText={(text) => handleChange("streetAddress", text)}
                style={{ borderBottomWidth: 1, padding: 10, fontSize: 16 }}
            />

            <Text>City</Text>
            <TextInput
                placeholder="City"
                value={address.city}
                onChangeText={(text) => handleChange("city", text)}
                style={{ borderBottomWidth: 1, padding: 10, fontSize: 16 }}
            />

            <Text>State</Text>
            <TextInput
                placeholder="State"
                value={address.state}
                onChangeText={(text) => handleChange("state", text)}
                style={{ borderBottomWidth: 1, padding: 10, fontSize: 16 }}
            />

            <Text>ZIP Code</Text>
            <TextInput
                placeholder="ZIP Code"
                keyboardType="numeric"
                value={address.zipCode}
                onChangeText={(text) => handleChange("zipCode", text)}
                style={{ borderBottomWidth: 1, padding: 10, fontSize: 16 }}
            />

            <Text>Country</Text>
            <TextInput
                placeholder="Country"
                value={address.country}
                onChangeText={(text) => handleChange("country", text)}
                style={{ borderBottomWidth: 1, padding: 10, fontSize: 16 }}
            />

            <TouchableOpacity onPress={handleSubmit} style={{ backgroundColor: "orange", padding: 15, borderRadius: 5, alignItems: "center", marginTop: 10 }}>
                <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>Save Address</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 10, alignItems: "center" }}>
                <Text style={{ color: "red", fontSize: 16 }}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );
};


const styles = {
    input: { borderBottomWidth: 1, padding: 10, marginBottom: 15 },
    saveButton: { backgroundColor: "#ff6600", padding: 15, borderRadius: 5, alignItems: "center" },
    saveButtonText: { color: "white", fontWeight: "bold" },
    backButton: { marginTop: 10, alignItems: "center" },
    backText: { color: "red", fontSize: 16 },
    inputContainer: { marginBottom: 15 },
    label: { fontSize: 16, fontWeight: "500", marginBottom: 5 },
};

export default EditAddress;
