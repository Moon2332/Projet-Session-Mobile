import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, TextInput } from 'react-native';
import useBD from '../../useBD';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import CustomInput from '../../composants/CustomInput';
import { useNavigation } from '@react-navigation/native';
import { useParams } from '../../useParams';

const MappingCreate = () => {
    const flatListRef = useRef(null);
    const { t } = useTranslation();

    const navigation = useNavigation();
    const { addInstruction } = useBD();
    const { fontSize, mode } = useParams();

    const [items, setItems] = useState([]);
    const [title, setTitle] = useState("");
    const [error, setError] = useState([]);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: t("titles_pages.mapping_add"),
            headerTitleAlign: "left",
            headerTitleStyle: { fontSize: parseInt(fontSize) + 10 }
        });
    });

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

    const saveItems = () => {
        if (validateForm()) {
            try {
                const instructionsData = items.map(item => ({
                    action: item.action,
                    value: item.value,
                }));

                const response = addInstruction(title, instructionsData);
                setItems([]);
                setTitle("");

                navigation.popTo('Mapping', { ajouter: "nouveau" });

            } catch (e) {
                console.error(t("Errors.save.instructions"), e);
                Toast.show({
                    type: 'error',
                    text1: t(e.message)
                });
            }
        }
    };

    const renderItem = ({ item, index }) => (
        <TouchableOpacity onLongPress={() => removeItem(index)}>
            <View style={styles.itemContainer}>
                <Text style={styles.item}>{item.action}</Text>
            
                <TextInput
                    style={styles.inputValue}
                    value={item.value}
                    onChangeText={(newValue) => updateItemValue(index, newValue)}
                    keyboardType="numeric"
                />
            </View>
        </TouchableOpacity>
    );

    const removeItem = (index) => {
        setItems(prevItems => prevItems.filter((_, i) => i !== index));
        Toast.show({
            type: 'success',
            text1: t("Messages.instructions.delete")
        });
    };

    const onChangeText = (value, setInput) => {
        setInput(value);
    };

    const validateForm = () => {
        let tempErrors = [];

        if (title === "")
            tempErrors.errorTitle = t('Errors.required_fields.placeholder');

        setError(tempErrors);

        return Object.keys(tempErrors).length === 0;
    };

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
        flatlistContentContainer: {
            alignItems: 'center',
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
            color: mode === 'dark' ? '#ffffff' : '#2f3640',
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
            <View style={styles.header}>
                <View style={styles.inputTitle}>
                    <CustomInput
                        label={t("InputFields.placeholder")}
                        value={title}
                        onChangeText={(value) => onChangeText(value, setTitle)}
                        error={error.errorTitle}
                    />
                </View>

                <TouchableOpacity onPress={() => saveItems()}
                    style={[styles.saveButton, !items.length && { opacity: 0.1 }]}
                    disabled={!items.length}
                >
                    <Text style={styles.saveButtonText}>{t("Account.buttons.save")}</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                style={styles.flatList}
                ref={flatListRef}
            />

            <View style={styles.buttonsView}>
                <TouchableOpacity onPress={() => addItem(t("InputFields.backward"), "1")} style={styles.Button}>
                    <Text style={styles.ButtonText}>{t("InputFields.backward")}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => addItem(t("InputFields.forward"), "1")} style={styles.Button}>
                    <Text style={styles.ButtonText}>{t("InputFields.forward")}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.buttonsView}>
                <TouchableOpacity onPress={() => addItem(t("InputFields.left"), "90")} style={styles.Button}>
                    <Text style={styles.ButtonText}>{t("InputFields.left")}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => addItem(t("InputFields.right"), "90")} style={styles.Button}>
                    <Text style={styles.ButtonText}>{t("InputFields.right")}</Text>
                </TouchableOpacity>
            </View>

            <Toast />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#111111', 
        padding: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '95%',
        marginBottom: 10,
    },
    saveButton: {
        backgroundColor: '#FF5733',
        padding: 15,
        marginTop: '5%',
        width: '35%',
        borderRadius: 5,
    },
    saveButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontFamily: "serif",
        textAlign: 'center',
    },
    buttonsView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 10,
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
        fontFamily: "serif",
    },
    inputTitle: {
        height: 40,
        width: '60%',
        borderRadius: 5,
        fontFamily: "serif",
    },
    inputValue: {
        height: 40,
        width: 60,
        backgroundColor: '#222222', 
        color: '#ffffff',
        borderRadius: 5,
        textAlign: 'center',
        fontFamily: "serif",
    },
    Button: {
        height: 50,
        padding: 15,
        margin: 5,
        width: 150,
        backgroundColor: '#333333', 
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ButtonText: {
        color: '#ffffff', 
        fontFamily: 'serif',
    },
    flatList: {
        height: '60%',
        marginVertical: 20,
    },
});

export default MappingCreate;
