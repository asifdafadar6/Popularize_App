import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, Modal, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChatMessageBusiness = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [influId, setInfluId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [hasMessages, setHasMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const pollingIntervalRef = useRef(null);
  // const [socket, setSocket] = useState(null); // For WebSocket implementation

  const getStoredData = async () => {
    try {
      const storedInfluId = await AsyncStorage.getItem("influId");
      const storedUserId = await AsyncStorage.getItem("userId");
      
      if (storedInfluId) setInfluId(storedInfluId);
      if (storedUserId) setUserId(storedUserId);
    } catch (error) {
      console.error("Error fetching data from AsyncStorage:", error);
    }
  };

  const fetchUserDetails = async () => {
    if (!influId) return;

    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await axios.get(
        `https://popularizenode.apdux.tech/api/viewprofilebyid/${influId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserDetails(response.data?.userDetails);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const fetchMessages = async (lastMessageTime = null) => {
    if (!userId || !influId) return;

    try {
      const token = await AsyncStorage.getItem("userToken");
      let url = `https://popularizenode.apdux.tech/api/getmessage/${influId}`;
      
      if (lastMessageTime) {
        url += `?since=${encodeURIComponent(lastMessageTime)}`;
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data?.messages) {
        const formattedMessages = response.data.messages.map(msg => ({
          id: msg._id,
          text: msg.text,
          time: new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          sender: msg.senderId === userId ? "me" : "other",
          createdAt: msg.createdAt
        }));

        const sortedMessages = formattedMessages.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );

        if (lastMessageTime) {
          setMessages(prev => {
            const existingIds = prev.map(m => m.id);
            const newMsgs = sortedMessages.filter(m => !existingIds.includes(m.id));
            return [...newMsgs, ...prev];
          });
        } else {
          setMessages(sortedMessages);
        }

        setHasMessages(sortedMessages.length > 0);
      } else {
        setMessages([]);
        setHasMessages(false);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const startPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    pollingIntervalRef.current = setInterval(() => {
      if (messages.length > 0) {
        const lastMessageTime = messages[0].createdAt;
        fetchMessages(lastMessageTime);
      } else {
        fetchMessages();
      }
    }, 5000);
  };

  // WebSocket implementation (commented out - requires backend support)
  /*
  const setupWebSocket = () => {
    if (socket) socket.close();
    
    const newSocket = new WebSocket(`wss://your-websocket-endpoint?userId=${userId}&token=${token}`);
    
    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'new_message' && data.message.senderId === influId) {
        const newMsg = {
          id: data.message._id,
          text: data.message.text,
          time: new Date(data.message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          sender: "other",
          createdAt: data.message.createdAt
        };
        setMessages(prev => [newMsg, ...prev]);
        setHasMessages(true);
      }
    };

    setSocket(newSocket);
    return () => newSocket.close();
  };
  */

  useEffect(() => {
    const initialize = async () => {
      await getStoredData();
    };
    initialize();

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      // if (socket) socket.close();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (influId) fetchUserDetails();
      if (userId && influId) {
        fetchMessages();
        startPolling();
        // setupWebSocket(); 
      }

      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
        // if (socket) socket.close();
      };
    }, [userId, influId])
  );

  const sendMessage = async () => {
    if (message.trim().length === 0 || !userId || !influId) return;

    const tempId = `temp-${Date.now()}`;
    const newMessage = {
      id: tempId,
      text: message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      sender: "me",
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [newMessage, ...prev]);
    setMessage("");
    setHasMessages(true);
    setIsSending(true);

    try {
      const token = await AsyncStorage.getItem("userToken");
      await axios.post(
        `https://popularizenode.apdux.tech/api/sendmessage/${influId}`,
        {
          senderId: userId,
          reciverId: influId,
          text: message
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
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
                {userDetails?.userName ? userDetails.userName.slice(0, 29) : "Chat"}
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
              data={messages}
              renderItem={({ item }) => (
                <View style={[
                  styles.messageContainer, 
                  item.sender === "me" ? styles.myMessage : styles.otherMessage
                ]}>
                  <View style={[
                    styles.messageBubble,
                    item.sender === "me" ? styles.myBubble : styles.otherBubble
                  ]}>
                    <Text style={styles.messageText}>{item.text}</Text>
                  </View>
                  <Text style={styles.messageTime}>{item.time}</Text>
                </View>
              )}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.messagesList}
              inverted
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

export default ChatMessageBusiness;

