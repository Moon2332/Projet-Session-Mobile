import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useParams } from '../../useParams';
import { useTranslation } from 'react-i18next';
import useBD from '../../useBD';
import { useMQTT } from '../../useMQTT';

const Notification = () => {
    const { t } = useTranslation()
    const { fontSize, mode } = useParams();
    const navigation = useNavigation();

    const { client, connected } = useMQTT();
    const [lastFetched, setLastFetched] = useState(null);

    const { notifications, addNotification } = useBD()
    const [notifs, setNotifications] = useState([])
    const [change, setChange] = useState(false)
    const [nb, setNb] = useState(0)

    useEffect(() => {
        // setNotifications([])
        const formatDate = (date) => {
            const d = new Date(date);
            const formattedDate = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
            return formattedDate;
        };
        
        const formatTime = (date) => {
            const d = new Date(date);
            return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
        };

        if (client && connected) {
            console.log('Notifications: MQTT Client is connected');
            client.subscribe('echelon', { qos: 0 });

            client.onMessageArrived = (message) => {
                const newNotification = JSON.parse(message.payloadString);
                // console.log("New notification received:", newNotification);

                const type = newNotification.type;
                const image = newNotification.image || null
                const date = newNotification.date

                const formattedDate = formatDate(date);
                const time = formatTime(date);

                if (!lastFetched) {
                    setLastFetched(date);
                    addNotification(type, image, date);
                    // setChange(true);
                    setNb((prevNb) => (prevNb + 1));
                    setNotifications((prev) => [...prev, { ...newNotification, formatted_date: formattedDate, time }])
                } else {
                    if (new Date(date) > new Date(lastFetched)) {
                        addNotification(type, image, date);
                        setLastFetched(date); 
                        // setChange(true)
                        setNb((prevNb) => (prevNb + 1));
                        setNotifications((prev) => [...prev, { ...newNotification, formatted_date: formattedDate, time }])
                    }
                }
            } 
        } else {
            setNotifications([])
        }
    }, [client, connected]);

    const dynamicStyles = {
        container: {
            backgroundColor: mode ? '#f0f4f8' : '#181818',
        },
        textLabel: {
            color: mode ? '#2f3640' : '#ecf0f1',
        },
        card: {
            backgroundColor: mode ? '#ffffff' : '#444',
        },
        cardText: {
            color: mode ? '#333' : '#fff',
        },
    };

    useEffect(() => {
        // if (change) {
            // setNotifications(notifications);
            // setChange(false)
            navigation.setOptions({
                tabBarBadge: nb
            })
        // }
    }, [nb]);

    const renderItem = ({ item }) => {
        // console.log(item)
        return (
            <Pressable onPress={() => navigation.navigate('Picture')}>
            <View style={[styles.card, dynamicStyles.card]}>
                <Text style={[styles.cardText, dynamicStyles.cardText]}>Type: {item.type}</Text>
                <Text style={[styles.cardText, dynamicStyles.cardText]}>Date: {item.formatted_date}</Text>
                <Text style={[styles.cardText, dynamicStyles.cardText]}>Temps: {item.time}</Text>
            </View>
            </Pressable>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.containerView}>
                <FlatList
                    data={notifs}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index}
                    style={styles.flatlist}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerView: {
        paddingHorizontal: 10,
        paddingVertical: '10%'
    },
    card: {
        width: '100%',
        padding: 20,
        marginVertical: 10,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    cardText: {
        fontSize: 16,
        fontFamily: 'serif',
    },
});

//     return (
//         <View style={[styles.container, dynamicStyles.container]}>
//             <FlatList
//                 data={notifications}
//                 renderItem={({ item }) => (
//                     <Pressable onPress={() => navigation.navigate('Picture')}>
//                         <View style={[styles.card, dynamicStyles.card]}>
//                             <Text style={[styles.cardText, dynamicStyles.cardText]}>Type: {item.type}</Text>
//                             <Text style={[styles.cardText, dynamicStyles.cardText]}>Date: {item.date}</Text>
//                             <Text style={[styles.cardText, dynamicStyles.cardText]}>Temps: {item.time}</Text>
//                         </View>
//                     </Pressable>
//                 )}
//                 keyExtractor={item => item.id}
//                 style={styles.flatlist}
//                 contentContainerStyle={styles.flatlistContentContainer}
//             />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         width: '100%'
//     },
//     text: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         marginBottom: 20,
//         fontFamily: 'serif',
//     },
//     flatlist: {
//         padding: 10,
//     },
//     flatlistContentContainer: {
//         alignItems: 'center',
//     },
//     card: {
//         width: '50%',
//         padding: 20,
//         marginVertical: 10,
//         borderRadius: 5,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 5,
//         elevation: 3,
//     },
//     cardText: {
//         fontSize: 16,
//         fontFamily: 'serif',
//     },
// });

export default Notification;