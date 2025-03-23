import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, KeyboardAvoidingView, ScrollView, Image, SafeAreaView } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useParams } from '../../useParams';
import { useTranslation } from 'react-i18next';
import useBD from '../../useBD';
import AlertModal from '../../composants/AlertModal';
import { useMQTT } from '../../useMQTT';
import { useDispatch, useSelector } from 'react-redux';
import { setValue } from '../../store/sliceAlertModal';

const Notification = () => {
    const { t } = useTranslation()
    const { fontSize, mode } = useParams();
    const dispatch = useDispatch()
    const navigation = useNavigation();

    const { client, connected, notification_mqtt } = useMQTT();
    const [lastFetched, setLastFetched] = useState(null);

    const { addNotification } = useBD()
    const [notifs, setNotifications] = useState([])
    const [nb, setNb] = useState(0)
    const [visible, setVisible] = useState(false)
    const [image, setImage] = useState(null);
    const message = t("Notifications.type.speed")
    const setAlert = useSelector((state) => state.alertModalSlice.value)
    const [modalVisible, setModalVisible] = useState(setAlert);

    useEffect(() => {
        const formatDate = (date) => {
            const d = new Date(date);
            return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
        };

        const formatTime = (date) => {
            const d = new Date(date);
            return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
        };

        if (client && connected) {
            console.log('Notifications: MQTT Client is connected');

            const newNotification = notification_mqtt;
            console.log("New notification received:", newNotification);

            if (!newNotification || !newNotification.type) {
                return;
            }

            const type = newNotification.type;
            const image = newNotification.image || null;
            const date = newNotification.date;

            const formattedDate = formatDate(date);
            const time = formatTime(date);

            if (!lastFetched) {
                setLastFetched(date);
                addNotification(type, image, date);
                setNb((prevNb) => (prevNb + 1));
                setNotifications((prev) => [...prev, { ...newNotification, formatted_date: formattedDate, time }]);
            } else {
                if (new Date(date) > new Date(lastFetched)) {
                    addNotification(type, image, date);
                    setLastFetched(date);
                    setNb((prevNb) => (prevNb + 1));
                    setNotifications((prev) => [...prev, { ...newNotification, formatted_date: formattedDate, time }]);
                }
            }
        } else {
            setNotifications([]);
        }
    }, [notification_mqtt]);


    useEffect(() => {
        if (nb > 0) {
            navigation.setOptions({
                tabBarBadge: nb
            });
        } else {
            navigation.setOptions({
                tabBarBadge: null
            });
        }
    }, [nb]);

    useEffect(() => {
        setModalVisible(setAlert);
    }, [setAlert]);

    useFocusEffect(
        React.useCallback(() => {
            navigation.setOptions({
                tabBarBadge: null
            });
            setNb(0)
        }, [nb, navigation])
    );

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

    const renderItem = ({ item }) => {
        const speedStyle = item.type === "speed" ? { backgroundColor: 'red' } : {};
        console.log("Item type in renderItem", item.type)
        if (item.type !== "sound" && item.type !== "distance") {
            dispatch(setValue(true));
            return null;
        }

        console.log("Set ALERT IN NOTIFICATION", setAlert)
        console.log("Modal visible value notifs", modalVisible)

        return (
            <Pressable onPress={() => renderPicture(item)}>
                <View style={[styles.card, dynamicStyles.card, speedStyle]}>
                    <Text style={[styles.cardText, dynamicStyles.cardText]}>{t("Notifications.text.type")}: 
                        {
                            item.type === "distance" ? t("Notifications.type.distance") :
                            item.type === "sound" ? t("Notifications.type.sound") : 
                            t("Notifications.type.speed")
                        }
                    </Text>
                    <Text style={[styles.cardText, dynamicStyles.cardText]}>{t("Notifications.text.date")}: {item.formatted_date}</Text>
                    <Text style={[styles.cardText, dynamicStyles.cardText]}>{t("Notifications.text.time")}: {item.time}</Text>
                </View>
            </Pressable>
        );
    };

    const renderPicture = (item) => {
        setVisible(true)
        setImage(item.image)
    }

    const listEmptyComponent = () => {
        return (
            <Text style={[styles.cardText, {alignSelf: 'center'}]}>{t("Notifications.text.no_notifications")}</Text>
        );
    }


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.containerView}>
                {
                    !visible &&
                    <FlatList
                        data={notifs}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        style={styles.flatlist}
                        ListEmptyComponent={listEmptyComponent}
                    />
                }
                {
                    visible &&
                    <>
                        <Pressable onPress={() => setVisible(false)}>
                            <Text style={{ color: 'blue' }}>{t("Account.buttons.return")}</Text>
                        </Pressable>
                        <Image source={{ uri: `data:image/png;base64,${image}` }} style={styles.image} />
                    </>
                }
            </View>

            {
                modalVisible &&
                <AlertModal
                    visible={modalVisible}
                    onClose={() => dispatch(setValue(false))}
                    mode={mode}
                    message={message}
                />
            }
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
    image: {
        width: 300,
        height: 300,
        marginBottom: 30,
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