import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, TextInput } from 'react-native';

const MappingCreate = () => {
    const [items, setItems] = useState([]);
    const flatListRef = useRef(null);

    const addItem = (action, value) => {
        setItems(prevItems => {
            const newItems = [...prevItems, { action, value }];
            if (flatListRef.current) {
                flatListRef.current.scrollToEnd({ animated: true });
            }
            return newItems;
        });
    };

    const updateItemValue = (index, newValue) => {
        setItems(prevItems => {
            const updatedItems = [...prevItems];
            updatedItems[index].value = newValue;
            return updatedItems;
        });
    };

    const renderItem = ({ item, index }) => (
        <View style={styles.itemContainer}>
            <TouchableOpacity onLongPress={() => removeItem(index)} >
                <Text style={styles.item}>{item.action}</Text>
            </TouchableOpacity>
            <TextInput
                style={styles.input}
                value={item.value}
                onChangeText={(newValue) => updateItemValue(index, newValue)}
                keyboardType="numeric"
            />
        </View>
    );

    const removeItem = (index) => {
        setItems(prevItems => prevItems.filter((_, i) => i !== index));
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                style={styles.flatList}
                ref={flatListRef}
            />

            <ScrollView horizontal style={styles.horizontalScrollView}>
                <View>
                    <TouchableOpacity onPress={() => addItem("Backwards", "1")} style={styles.Button}>
                        <Text style={styles.ButtonText}>Backwards</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => addItem("Left", "90")} style={styles.Button}>
                        <Text style={styles.ButtonText}>Left</Text>
                    </TouchableOpacity>
                </View>

                <View>
                    <TouchableOpacity onPress={() => addItem("Forwards", "1")} style={styles.Button}>
                        <Text style={styles.ButtonText}>Forwards</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => addItem("Right", "90")} style={styles.Button}>
                        <Text style={styles.ButtonText}>Right</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#111111',
        paddingTop: 50,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    horizontalScrollView: {
        flex: 1,
        width: '100%',
        maxHeight: '20%',
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 5,
        backgroundColor: '#333333',
        padding: 10,
        borderRadius: 5,
    },
    item: {
        color: '#ffffff',
        fontSize: 16,
        marginRight: 10,
    },
    input: {
        height: 40,
        width: 60,
        backgroundColor: '#222222',
        color: '#ffffff',
        borderRadius: 5,
        textAlign: 'center',
    },
    Button: {
        height: 50,
        padding: 15,
        margin: 5,
        backgroundColor: '#333333',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: '78%',
    },
    ButtonText: {
        color: '#ffffff',
        fontFamily: 'serif',
    },
    flatList: {
        height: '60%',
    },
});

export default MappingCreate;
