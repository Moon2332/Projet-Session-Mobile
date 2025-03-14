import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import useBD from '../../useBD'; 
import { useNavigation } from '@react-navigation/native';
import { useParams } from '../../useParams';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';

const MappingEdit = ({ route }) => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const { editInstruction, deleteInstruction } = useBD();
    const { fontSize, mode } = useParams();

    const [title, setTitle] = useState("");
    const [editedInstructions, setEditedInstructions] = useState([]);
    const [isChanged, setIsChanged] = useState(false); // Track changes

    const { item_edit } = route.params;
    
    useEffect(() => {
        navigation.setOptions({
            headerTitle: t("titles_pages.mapping_edit"),
            headerTitleAlign: "left",
            headerTitleStyle: { fontSize: parseInt(fontSize) + 10 }
        });

        const parsedOrders = JSON.parse(item_edit.orders);
        setEditedInstructions(parsedOrders);
        setTitle(item_edit.title); 
    }, [route.params]);

    const updateInstructionValue = (index, newValue) => {
        setEditedInstructions(prevItems => {
            const updatedItems = [...prevItems];
            updatedItems[index].value = newValue;
            setIsChanged(true); // Set to true when there's a change
            return updatedItems;
        });
    }
    
    const saveUpdatedInstructions = () => {
        try {
            const instructionsData = editedInstructions.map(item => ({
                action: item.action,
                value: item.value,
            }));

            editInstruction(item_edit.title, instructionsData, item_edit.id);
            navigation.popTo('Mapping', { modifier: "modifier" });
            setIsChanged(false); // Reset after saving
        } catch (e) {
            console.error('Error updating instructions:', e);
        }
    };

    const removeItem = (index) => {
        setEditedInstructions(prevItems => {
            const updatedItems = prevItems.filter((_, i) => i !== index);
            
            if (updatedItems.length === 0) {
                deleteInstruction(item_edit.id); 

                navigation.popTo('Mapping', { modifier: "delete" });
            }

            setIsChanged(true); // Set to true when an item is removed
            return updatedItems;
        });
    };

    const renderInstructionItem = ({ item, index }) => (
        <TouchableOpacity onLongPress={() => removeItem(index)}>
            <View style={styles.itemContainer}>
                <Text style={styles.item}>{item.action}</Text>
                <TextInput
                    style={styles.input}
                    value={item.value}
                    onChangeText={(newValue) => updateInstructionValue(index, newValue)}
                    keyboardType="numeric"
                />
            </View>
        </TouchableOpacity>
    );

    const dynamicStyles = {
        container: {
            backgroundColor: mode ? '#f0f4f8' : '#181818',
        },
        textLabel: {
            color: mode ? '#ecf0f1' : '#2f3640',  
            fontSize: parseInt(fontSize)
        },
        flatlistContainer: {
            backgroundColor: mode ? '#333333' : '#f0f4f8',
        },
        card: {
            backgroundColor: mode  ? '#444444' : '#ffffff',
            shadowColor: mode ? '#fff' : '#000',
        },
        cardText: {
            fontSize: parseInt(fontSize),
            color: mode ? '#ffffff' : '#000000',
        },
        inputValue: {
            backgroundColor: mode ? '#222222' : '#ffffff',
            color: mode ? '#ffffff' : '#2f3640',
        },
        Button: {
            backgroundColor: mode ? '#333333' : '#eeeeee',  
        },
        ButtonText: {
            fontSize: parseInt(fontSize),
            color: mode ? '#ffffff' : '#2f3640', 
        },
    };

    return (
        <View style={[styles.container, dynamicStyles.container]}>
            <FlatList
                data={editedInstructions}
                renderItem={renderInstructionItem}
                keyExtractor={(item, index) => index.toString()}
                style={styles.flatList}
            />

            <TouchableOpacity 
                onPress={() => saveUpdatedInstructions()} 
                style={[styles.saveButton, !isChanged && { opacity: 0.1 }]}
                disabled={!isChanged}
            >
                <Text style={styles.saveButtonText}>{t("Account.buttons.save")}</Text>
            </TouchableOpacity>

            <Toast />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#000',
    },
    flatList: {
        width: '100%',
        marginBottom: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 5,
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 5,
    },
    item: {
        color: '#000',
        fontSize: 16,
        marginRight: 10,
        flex: 1,
    },
    input: {
        height: 40,
        width: 80,
        backgroundColor: '#d3d3d3',
        borderRadius: 5,
        textAlign: 'center',
        color: '#000',
    },
    saveButton: {
        backgroundColor: '#FF5733',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        marginBottom: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default MappingEdit;
