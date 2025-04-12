import { View, StyleSheet, TextInput, TouchableOpacity, Text, Alert, ActivityIndicator } from "react-native";
import React, { useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";

export default function OtpVerify() {
    const { token, email } = useLocalSearchParams();
    const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [focusedIndex, setFocusedIndex] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (index, value) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value.length === 1 && index < 3) {
            inputRefs[index + 1].current.focus();
        } else if (value.length === 0 && index > 0) {
            inputRefs[index - 1].current.focus();
        }
        setFocusedIndex(value.length === 1 ? index : null);
    };

    const handleVerifyOtp = async () => {
        const otpValue = otp.join(""); // Combine OTP digits into a string
        console.log("OTP", otpValue);

        if (otpValue.length !== 4) {
            Alert.alert("Error", "Please enter a valid 4-digit OTP.");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post("https://popularizenode.apdux.tech/api/checkotp", { otp_g: otpValue },
                {
                    headers: {
                        Authorization:`Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response) {
                Alert.alert("Success", "OTP verified successfully!");
                router.push({
                    pathname: "/newPass",
                    params: { token: token, email: email },
                });
            } else {
                Alert.alert("Error", response.data.message || "Invalid OTP. Please try again.");
            }
        } catch (error) {
            Alert.alert("Error", "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Enter OTP</Text>
            <Text style={styles.subText}>We've sent a verification code to your mobile number</Text>

            <View style={styles.inputsContainer}>
                {inputRefs.map((ref, index) => (
                    <TextInput
                        key={index}
                        style={[
                            styles.input,
                            focusedIndex === index ? styles.focusedInput : {},
                        ]}
                        maxLength={1}
                        keyboardType="numeric"
                        ref={ref}
                        value={otp[index]}
                        onChangeText={(text) => handleChange(index, text)}
                    />
                ))}
            </View>

            <TouchableOpacity style={styles.button} onPress={handleVerifyOtp} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify OTP</Text>}
            </TouchableOpacity>

            <TouchableOpacity>
                <Text style={styles.resendText}>Resend OTP</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F8F8",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    headerText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#FF6600",
        marginBottom: 5,
    },
    subText: {
        fontSize: 14,
        color: "gray",
        textAlign: "center",
        marginBottom: 30,
        width: "80%",
    },
    inputsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        width: "100%",
        marginBottom: 30,
        alignSelf: "center",
    },
    input: {
        borderWidth: 2,
        borderRadius: 12,
        minWidth: 55,
        height: 55,
        textAlign: "center",
        fontSize: 22,
        fontWeight: "bold",
        color: "#333",
        backgroundColor: "#FFFFFF",
        borderColor: "gray",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    focusedInput: {
        borderColor: "#FF6600",
        backgroundColor: "#FFF5F0",
        borderWidth: 3,
    },
    button: {
        backgroundColor: "#FF6600",
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 12,
        shadowColor: "#FF6600",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        width: "100%",
        alignItems: "center",
        marginTop: 20,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        textTransform: "uppercase",
    },
    resendText: {
        color: "#FF6600",
        fontWeight: "600",
        marginTop: 20,
        fontSize: 14,
    },
});