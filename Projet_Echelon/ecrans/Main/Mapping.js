import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import useBD from '../../useBD';
import { useNavigation } from '@react-navigation/native';
import { useParams } from '../../useParams';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPenToSquare, faPlus } from '@fortawesome/free-solid-svg-icons';
import Toast from 'react-native-toast-message';
import { useMQTT } from '../../useMQTT';

const Mapping = ({ route }) => {

    const { t } = useTranslation();
    const navigation = useNavigation()

    const { fontSize, mode } = useParams();
    const { instructions, getInstructions, deleteInstruction } = useBD();

    const { client, connected, sendMessage } = useMQTT();
    
      useEffect(() => {
        if (client && connected) {
          console.log('Mapping: MQTT Client is connected');
        }
      }, [client, connected]);
    

    useEffect(() => {
        getInstructions();
        console.log("In use effect mapping", instructions);

        navigation.setOptions({
            headerTitle: t("titles_pages.mapping"),
            headerTitleAlign: "left",
            headerTitleStyle: {fontSize: parseInt(fontSize) + 10},
            headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate("MappingCreate")} style={{marginBottom: 20}}>
                    <FontAwesomeIcon icon={faPlus} size={parseInt(fontSize)} color='green' />
                </TouchableOpacity>
            ),
        });
    }, []);

    useEffect(() => {
        console.log(route.params?.message)
        if (route.params?.ajouter) {
          try {
            Toast.show({
                type: 'success',
                text1: t("Messages.mapping.add")
            });
            getInstructions()
          } catch (e) {
            console.log(e)
          }
        } else if (route.params?.modifier) {
            if (route.params?.modifier === "modifier") {
                try {
                    Toast.show({
                        type: 'success',
                        text1: t("Messages.mapping.edit")
                    });
                    getInstructions()
                } catch (e) {
                    console.log(e)
                }
            } else {
                try {
                    Toast.show({
                        type: 'success',
                        text1: t("Messages.mapping.delete")
                    });
                    getInstructions()
                } catch (e) {
                    console.log(e)
                }
            }
        }
    }, [route.params])

    const useRoute = ({item}) => {
        sendMessage("echelon", JSON.stringify(item))
    }

    const renderItem = ({ item }) => {
        return (
            <View style={styles.itemContainer}>
                <TouchableOpacity
                    style={[styles.card, dynamicStyles.card]}
                    onPress={() => useRoute(item)}
                >
                    <Text style={[styles.cardText, dynamicStyles.cardText]}>{item.title}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.navigate("MappingEdit", { item_edit: item })}
                >
                    <FontAwesomeIcon icon={faPenToSquare} size={20} color='green' />
                </TouchableOpacity>
            </View>
        )
    }

    const listEmptyComponent = () => {
        return (
            <Text>{t('Liste vide')}</Text>
        )
    }

    const dynamicStyles = {
        container: {
            backgroundColor: mode ? '#f0f4f8' : '#181818',
        },
        textLabel: {
            color: mode ? '#2f3640' : '#ecf0f1',
            fontSize: parseInt(fontSize)
        },
        flatlistContainer: {
            backgroundColor: mode ? '#f0f4f8' : '#333333',
        },
        flatlistContentContainer: {
            alignItems: 'center',
        },
        card: {
            backgroundColor: mode ? '#ffffff' : '#444444',
            shadowColor: mode ? '#000' : '#fff',
        },
        cardText: {
            fontSize: parseInt(fontSize),
            color: mode ? '#000000' : '#ffffff',
        },
        ButtonText: {
            fontSize: parseInt(fontSize),
        },
    };

    return (
        <View style={[styles.container, dynamicStyles.container]}>
            <FlatList
                data={instructions}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                style={[styles.flatlist, dynamicStyles.flatlistContainer]}
                numColumns={2}
                contentContainerStyle={dynamicStyles.flatlistContentContainer}
                ListEmptyComponent={listEmptyComponent}
            />
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
    },
    itemContainer: {

    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#fff',
    },
    flatlist: {
        width: '100%',
    },
    flatlistContentContainer: {
        alignItems: 'center',
    },
    card: {
        width: '45%',
        padding: 20,
        margin: 10,
        backgroundColor: '#333333',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardText: {
        color: '#ffffff',
        fontFamily: 'serif',
        textAlign: 'center'
    },
    ButtonText: {
        color: '#ffffff',
        fontFamily: 'serif',
        textAlign: "center"
    },
    Button: {
        backgroundColor: '#333333',
        padding: 10,
        borderRadius: 10,
        margin: 20,
        borderColor: '#ffffff',
        borderWidth: 0.2,
        minWidth: "80%",
    },
});

export default Mapping;
