import React from 'react';
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Mapping = () => {

    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate("MappingSaved")} style={styles.Button}><Text style={styles.ButtonText}>Utiliser un Chemin Sauvegardé</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("MappingEdit")} style={styles.Button}><Text style={styles.ButtonText}>Modifier un Chemin</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("MappingCreate")} style={styles.Button}><Text style={styles.ButtonText}>Créer un Nouveau Chemin</Text></TouchableOpacity>
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
    ButtonText: {
        fontSize: 16,
        color: '#ffffff',
        fontFamily: 'serif',
        textAlign:"center"
    },
    Button: {
        backgroundColor: '#333333',
        padding:20,
        borderRadius:10,
        margin:20,
        borderColor:'#ffffff',
        borderWidth: 0.2,
        minWidth: "80%",
        
    }
});

export default Mapping;