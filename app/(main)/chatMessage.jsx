import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, Modal, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChatMessage = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [influId, setInfluId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [hasMessages, setHasMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { userBusinessId } = useLocalSearchParams();
  const flatListRef = useRef(null);

  // Polling interval in milliseconds (e.g., 5000ms = 5 seconds)
  const POLLING_INTERVAL = 5000;
  const pollingRef = useRef(null);

  const getStoredData = async () => {
    try {
      const storedInfluId = await AsyncStorage.getItem("userinfluId");
      const storedUserId = userBusinessId;
      
      if (storedInfluId) setInfluId(storedInfluId);
      if (storedUserId) setUserId(storedUserId);
    } catch (error) {
      console.error("Error fetching data from AsyncStorage:", error);
    }
  };

  const fetchUserDetails = async () => {
    if (!influId) return;

    try {
      const token = await AsyncStorage.getItem("userInfluToken");
      const response = await axios.get(
        `https://popularizenode.apdux.tech/api/viewprofilebyid/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserDetails(response.data?.userDetails);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const fetchMessages = async () => {
    if (!userId || !influId) return;
  
    try {
      const token = await AsyncStorage.getItem("userInfluToken");
      const response = await axios.get(
        `https://popularizenode.apdux.tech/api/getmessage/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data?.messages && response.data.messages.length > 0) {
        const formattedMessages = response.data.messages.map(msg => ({
          id: msg._id,
          text: msg.text,
          time: new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          sender: msg.senderId === influId ? "me" : "other",
          createdAt: msg.createdAt
        }));
        
        const sortedMessages = formattedMessages.sort((a, b) => 
          new Date(a.createdAt) - new Date(b.createdAt)
        );
        
        setMessages(sortedMessages);
        setHasMessages(true);
        
        setTimeout(() => {
          if (flatListRef.current && sortedMessages.length > 0) {
            flatListRef.current.scrollToEnd({ animated: true });
          }
        }, 100);
      } else {
        setMessages([]);
        setHasMessages(false);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setHasMessages(false);
    } finally {
      setLoading(false);
    }
  };

  // Start polling for new messages
  const startPolling = useCallback(() => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = setInterval(fetchMessages, POLLING_INTERVAL);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [userId, influId]);

  useEffect(() => {
    const initialize = async () => {
      await getStoredData();
    };
    initialize();
  }, []);

  useEffect(() => {
    if (userId) fetchUserDetails();
    if (userId && influId) {
      fetchMessages();
      startPolling();
    }
    
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [userId, influId]);

  const sendMessage = async () => {
    if (message.trim().length === 0 || !userId || !influId || isSending) return;

    const tempId = Date.now().toString();
    const newMessage = {
      id: tempId,
      text: message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      sender: "me",
      createdAt: new Date().toISOString()
    };

    setIsSending(true);
    setMessages(prev => [...prev, newMessage]);
    setMessage("");
    setHasMessages(true);

    try {
      const token = await AsyncStorage.getItem("userInfluToken");
      await axios.post(
        `https://popularizenode.apdux.tech/api/sendmessage/${userId}`,
        {
          senderId: influId,
          reciverId: userId,
          text: message
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Refresh messages after sending
      await fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
      if (messages.length === 0) setHasMessages(false);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      {loading ? (
        <ActivityIndicator size="large" color="#FF7F00" style={{ flex: 1 }} />
      ) : (
        <>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Icon name="chevron-back" size={24} color="black" />
            </TouchableOpacity>
            <Image
              source={{ uri: userDetails?.profileImage }}
              style={styles.profileImage}
            />
            <View>
              <Text style={styles.username}>
                {userDetails?.companyName
                  ? userDetails.companyName.slice(0, 29)
                  : "Chat"}
              </Text>
              <Text style={styles.status}>Online</Text>
            </View>
            <TouchableOpacity 
              onPress={() => setMenuVisible(true)} 
              style={{ marginLeft: "auto" }}
            >
              <Icon name="ellipsis-vertical" size={24} color="#FF7F00" />
            </TouchableOpacity>
          </View>

          {hasMessages ? (
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={({ item }) => (
                <View style={[styles.messageContainer, item.sender === "me" ? styles.myMessage : styles.otherMessage]}>
                  <View style={[styles.messageBubble, item.sender === "me" ? styles.myBubble : styles.otherBubble]}>
                    <Text style={styles.messageText}>{item.text}</Text>
                  </View>
                  <Text style={styles.messageTime}>{item.time}</Text>
                </View>
              )}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.messagesList}
              onContentSizeChange={() => {
                if (flatListRef.current && messages.length > 0) {
                  flatListRef.current.scrollToEnd({ animated: true });
                }
              }}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="chatbox-outline" size={60} color="#CCCCCC" />
              <Text style={styles.emptyText}>No messages yet</Text>
              <Text style={styles.emptySubtext}>Start the conversation by sending a message</Text>
            </View>
          )}

          <View style={styles.inputContainer}>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Type your message..."
              style={styles.input}
              multiline
            />
            <TouchableOpacity 
              onPress={sendMessage} 
              style={styles.sendButton}
              disabled={message.trim().length === 0 || isSending}
            >
              {isSending ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Icon name="paper-plane" size={24} color="white" />
              )}
            </TouchableOpacity>
          </View>

          <Modal visible={menuVisible} transparent animationType="fade">
            <TouchableOpacity
              style={styles.modalOverlay}
              onPress={() => setMenuVisible(false)}
            >
              <View style={styles.menuContainer}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuVisible(false);
                    router.push({
                      pathname: "/influProfile",
                      params: { userId: influId },
                    });
                  }}
                >
                  <Text style={styles.menuText}>View Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuVisible(false);
                    setMessages([]); 
                    console.log("Chat deleted successfully.");
                  }}
                >
                  <Text style={[styles.menuText, { color: "red" }]}>Delete Chat</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
        </>
      )}
    </View>
  );
};

const styles = {
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
    shadowOpacity: 0.1,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10
  },
  username: {
    fontSize: 16,
    fontWeight: "bold"
  },
  status: {
    fontSize: 12,
    color: "#4CAF50"
  },
  messageContainer: {
    marginVertical: 4,
    paddingHorizontal: 12
  },
  myMessage: {
    alignItems: "flex-end"
  },
  otherMessage: {
    alignItems: "flex-start"
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: "75%"
  },
  myBubble: {
    backgroundColor: "#FF7F00"
  },
  otherBubble: {
    backgroundColor: "#F1F1F1"
  },
  messageText: {
    fontSize: 16
  },
  myMessageText: {
    color: "white"
  },
  otherMessageText: {
    color: "black"
  },
  messageTime: {
    fontSize: 12,
    color: "#999",
    marginTop: 2
  },
  messagesList: {
    paddingVertical: 10
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#F8F8F8",
    borderTopWidth: 1,
    borderTopColor: "#EAEAEA"
  },
  input: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 45,
    fontSize: 16,
    shadowOpacity: 0.1
  },
  sendButton: {
    backgroundColor: "#FF7F00",
    padding: 12,
    borderRadius: 25,
    marginLeft: 10
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center"
  },
  menuContainer: {
    backgroundColor: "white",
    width: 200,
    borderRadius: 10,
    padding: 15,
    elevation: 5
  },
  menuItem: {
    padding: 10
  },
  menuText: {
    fontSize: 16
  }
};

export default ChatMessage;

