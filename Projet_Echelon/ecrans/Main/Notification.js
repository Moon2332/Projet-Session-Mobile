import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet,FlatList,Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native'


const Notification = () => {
    const notifications = [
        { id: '1', type: 'Alert', date: '2023-10-01', time: '10:00 AM' },
        { id: '2', type: 'Reminder', date: '2023-10-02', time: '11:00 AM' },
        { id: '3', type: 'Update', date: '2023-10-03', time: '12:00 PM' },
        { id: '4', type: 'Alert', date: '2023-10-04', time: '01:00 PM' },
        { id: '5', type: 'Reminder', date: '2023-10-05', time: '02:00 PM' },
        { id: '6', type: 'Update', date: '2023-10-06', time: '03:00 PM' },
        { id: '7', type: 'Alert', date: '2023-10-07', time: '04:00 PM' },
        { id: '8', type: 'Reminder', date: '2023-10-08', time: '05:00 PM' },
        { id: '9', type: 'Update', date: '2023-10-09', time: '06:00 PM' },
    ];
    //Swap this with mqtt alerts

    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Notification</Text>
            <FlatList
                data={notifications}
                renderItem={({ item }) => (
                    <Pressable onPress={() => navigation.navigate('Picture')}>
                        <View style={styles.card}>
                            <Text style={styles.cardText}>Type: {item.type}</Text>
                            <Text style={styles.cardText}>Date: {item.date}</Text>
                            <Text style={styles.cardText}>Time: {item.time}</Text>
                        </View>
                    </Pressable>
                )}
                keyExtractor={item => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#111111',
        paddingTop: 50,
    },
    text: {
        fontSize: 36,
        color: '#ffffff',
        fontFamily: 'serif',
        marginBottom: 20,
    },
    card: {
        minWidth: '70%',
        padding: 20,
        marginVertical: 10,
        backgroundColor: '#333333',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    cardText: {
        fontSize: 16,
        color: '#ffffff',
        fontFamily: 'serif',
    },
});

export default Notification;