import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert, Button, Modal } from 'react-native';
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
    const [isChanged, setIsChanged] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
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
            setIsChanged(true);
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
            setIsChanged(false);
        } catch (e) {
            console.error('Error updating instructions:', e);
        }
    };

    const removeItem = (index) => {
        if (editedInstructions.length === 1) {
            Alert.alert(
                t("Account.confirmation"),
                t("Account.delete_last_item_warning"),
                [
                    {
                        text: t("Account.buttons.no"),
                        onPress: () => { },
                    },
                    {
                        text: t("Account.buttons.yes"),
                        onPress: () => {
                            deleteInstruction(item_edit.id);
                            setEditedInstructions([]);
                            navigation.popTo('Mapping', { modifier: "delete" });
                        },
                    },
                ],
                { cancelable: true }
            );
        } else {
            setEditedInstructions(prevItems => {
                const updatedItems = prevItems.filter((_, i) => i !== index);
                setIsChanged(true);
                return updatedItems;
            });
        }
    };

    const removeInstruction = async () => {
        try {
            const response = await deleteInstruction(item_edit.id)
            navigation.popTo('Mapping', { modifier: "delete" })
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: t(error)
            });
        }
    }

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
            backgroundColor: mode ? '#444444' : '#ffffff',
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
        overlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        modalContent: {
            backgroundColor: mode ? '#ffffff' : '#2c3e50',
            padding: 20,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
        },
        modalButtons: {
            flexDirection: 'row',
            marginTop: 20,
        },
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: mode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)',
          },
          modalContent: {
            width: '90%',
            padding: 20,
            backgroundColor: mode ? '#2F2F2F' : '#FFFFFF',
            borderRadius: 35,
            elevation: 5,
            shadowColor: mode ? '#fff' : '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
          },
          modalButtons: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 10,
          },
          button: {
            backgroundColor: mode ? '#FF5733' : '#33FF57',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 5,
            margin: 5,
            alignItems: 'center',
          },
          buttonText: {
            color: mode ? '#FFFFFF' : '#000000',
            fontSize: 16,
            fontWeight: 'bold',
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

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={() => saveUpdatedInstructions()}
                    style={[styles.saveButton, !isChanged && { opacity: 0.1 }]}
                    disabled={!isChanged}
                >
                    <Text style={styles.saveButtonText}>{t("Account.buttons.save")}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setIsModalVisible(true)}
                    style={styles.saveButton}
                >
                    <Text style={styles.saveButtonText}>{t("Account.buttons.delete")}</Text>
                </TouchableOpacity>
            </View>

            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={dynamicStyles.modalContainer}>
                    <View style={dynamicStyles.modalContent}>
                        <Text style={[{ fontSize: 18, textAlign: 'center' }, dynamicStyles.textLabel]}>{t("mapping")}</Text>
                        <Text style={[{ fontSize: 20, fontWeight: '900', textAlign: 'center'  }, dynamicStyles.textLabel]}>" {title} "</Text>
                        <View style={dynamicStyles.modalButtons}>
                            <TouchableOpacity
                                style={dynamicStyles.button}
                                onPress={() => setIsModalVisible(false)}
                            >
                                <Text style={dynamicStyles.buttonText}>{t("Account.buttons.no")}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={dynamicStyles.button}
                                onPress={() => removeInstruction()}
                            >
                                <Text style={dynamicStyles.buttonText}>{t("Account.buttons.yes")}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

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
    buttonContainer: {
        flexDirection: 'column',
        width: '80%',
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
        marginBottom: 10,
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
