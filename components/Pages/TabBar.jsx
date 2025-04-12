import { Feather, MaterialIcons, FontAwesome5, Entypo, FontAwesome } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';
import { TabBarButton } from '@/components/Pages/TabBarButton';

export function TabBar({ state, descriptors, navigation }) {
    const icon = {
        index: (props) => <Feather name="home" size={24} color="#fff" {...props} />,
        chatBusiness: (props) => <FontAwesome name="wechat" size={24} color="#fff" {...props} />,
        history: (props) => <MaterialIcons name="history" size={24} color="#fff" {...props} />,
        profile: (props) => <FontAwesome5 name="user-alt" size={24} color="#fff" {...props} />,
    };

    // const isChatBusinessScreen = state.routes[state.index].name === 'chatBusiness';
    // if (isChatBusinessScreen) {
    //     return null;  
    // }

    return (
        <View style={styles.tabbar}>
            {state.routes.map((route, index) => {
                const options = descriptors[route.key]?.options || {};
                const title = options.title || route.name;
                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                return (
                    <View key={route.key} style={styles.tabButtonContainer}>
                        <View style={[styles.iconContainer, isFocused && styles.activeIcon]}>
                            <TabBarButton
                                onPress={onPress}
                                isFocused={isFocused}
                                icon={icon[route.name]}
                            />
                        </View>
                        <Text style={[styles.label, isFocused && styles.activeLabel]}>
                            {title}
                        </Text>
                    </View>
                );
            })}
        </View>
    );
}



const styles = StyleSheet.create({
    tabbar: {
        position: 'absolute',
        bottom: 10,
        left: 14,
        right: 14,
        height: 80, // Increased height to accommodate floating effect
        flexDirection: 'row',
        backgroundColor: '#051937',
        borderRadius: 16,
        alignItems: 'flex-end', // Align icons to the bottom to float when active
        justifyContent: 'space-around',
        paddingBottom: 10,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    tabButtonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        transition: 'margin-top 0.2s ease-in-out',
        color:'#fff'
    },
    activeIcon: {
        backgroundColor: '#EB6A39',
        color:'#fff',
        marginTop: -50, // Moves active icon higher instead of absolute positioning
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    label: {
        color: '#fff',
        fontSize: 12,
        marginTop: 4,
    },
    activeLabel: {
        color: '#fff',
        fontSize: 12,
        marginTop: 4,
        fontWeight: 'bold',
    },
});
