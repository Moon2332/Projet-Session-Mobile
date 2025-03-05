import React from 'react';
import { View, Text, StyleSheet,FlatList,TouchableOpacity } from 'react-native';

const MappingSaved = () => {
    const paths = [
            { id: '1', name: 'Basment'},
            { id: '2', name: 'Hall A'},
            { id: '3', name: 'Hall B'},
            { id: '4', name: 'Woords'},
            { id: '5', name: 'Vault'},
        ];
        //Swap this with the names of whats saved on the laravel server
    
        //const navigation = useNavigation();
    
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Notification</Text>
                <FlatList
                    data={paths}
                    renderItem={({ item }) => (
                        <TouchableOpacity>
                            <View style={styles.card}>
                                <Text style={styles.cardText}>{item.name}</Text>
                            </View>
                        </TouchableOpacity>
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

export default MappingSaved;