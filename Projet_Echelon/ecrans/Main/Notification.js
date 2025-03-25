import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Image, SafeAreaView } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useParams } from '../../useParams';
import { useTranslation } from 'react-i18next';
import useBD from '../../useBD';
import { useMQTT } from '../../useMQTT';
import { useDispatch, useSelector } from 'react-redux';
import { incrementNotificationCount, resetNotificationCount } from '../../store/sliceNotification';
import AlertModal from '../../composants/AlertModal';

const Notification = () => {
    const { t } = useTranslation()
    const { fontSize, mode } = useParams();
    const dispatch = useDispatch()
    const navigation = useNavigation();

    const { client, connected, notification_mqtt } = useMQTT();
    const [lastFetched, setLastFetched] = useState(null);

    const { addNotification } = useBD()
    const [notifs, setNotifications] = useState([])
    const [visible, setVisible] = useState(false)
    const [visibleL, setVisibleL] = useState(false)
    const [visibleAlert, setVisibleAlert] = useState(true)
    const [image, setImage] = useState(null)
    const nb = useSelector((state) => state.notificationSlice.nb)

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
                if (type !== "sound" && type !== "distance") {
                    setVisibleL(true)
                    setVisibleAlert(true)
                } else {
                    dispatch(incrementNotificationCount())
                    setNotifications((prev) => [...prev, { ...newNotification, formatted_date: formattedDate, time }]);
                }
            } else {
                if (new Date(date) > new Date(lastFetched)) {
                    addNotification(type, image, date);
                    setLastFetched(date);
                    if (type !== "sound" && type !== "distance") {
                        setVisibleAlert(true)
                        setVisibleL(true)
                    } else {
                        dispatch(incrementNotificationCount())
                        setNotifications((prev) => [...prev, { ...newNotification, formatted_date: formattedDate, time }]);
                    }
                }
            }
        } else {
            setNotifications([]);
            dispatch(resetNotificationCount())
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

    useFocusEffect(
        React.useCallback(() => {
            navigation.setOptions({
                tabBarBadge: null
            })
            
            return () => dispatch(resetNotificationCount())
        }, [nb])
    );

    const dynamicStyles = {
        container: {
            backgroundColor: mode ? '#f0f4f8' : '#181818',
        },
        card: {
            backgroundColor: mode ? '#ffffff' : '#444',
        },
        cardText: {
            color: mode ? '#333' : '#fff',
            fontSize: (parseInt(fontSize) + 10),
        },
    };

    const getImageForType = (type) => {
        switch (type) {
            case "distance":
                return require('../../assets/Distance.png');
            case "sound":
                return require('../../assets/Sound.png')
        }
    };

    const renderItem = ({ item }) => {
        const speedStyle = item.type === "speed" ? { backgroundColor: 'red' } : {};
        return (
            <Pressable onPress={() => renderPicture(item)}>
                <View style={[styles.card, dynamicStyles.card, speedStyle]}>
                    <Image source={getImageForType(item.type)} style={styles.icon} />

                    <View style={styles.textContainer}>
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
            <Text style={[styles.cardText, dynamicStyles.cardText, {alignSelf: 'center'}]}>{t("Notifications.text.no_notifications")}</Text>
        );
    }

    return (
        <SafeAreaView style={[styles.container, dynamicStyles.container]}>
            <View style={styles.containerView}>
                {
                    !visible &&
                    <FlatList
                        data={notifs}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index}
                        style={styles.flatlist}
                        ListEmptyComponent={listEmptyComponent}
                    />
                }
                {
                    visible &&
                    <>
                        <Pressable onPress={() => setVisible(false)}>
                            <Text style={{ color: 'blue', fontSize: parseInt(fontSize) }}>{t("Account.buttons.return")}</Text>
                        </Pressable>
                        <Image source={{ uri: `data:image/png;base64,${image}` }} style={styles.image} />
                    </>
                }
            </View>
            {
                visibleL && 
                (
                    <AlertModal
                        visible={visibleAlert}
                        setVisible={setVisibleAlert}
                    />
                )
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
        fontFamily: 'serif',
    },
    image: {
        width: 300,
        height: 300,
        marginBottom: 30,
    },
    icon: {
        width: 30,
        height: 30,
        marginRight: 10,
        position: 'absolute',
        top: 25,
        right: 10,
    },
    textContainer: {
        flex: 1,
    },
});


export default Notification;