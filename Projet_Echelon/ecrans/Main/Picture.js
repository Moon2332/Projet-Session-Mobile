import React from 'react';
import { View, Text, StyleSheet,Image } from 'react-native';
import { Dimensions } from 'react-native';

const PictureScreen = () => {
    const { width, height } = Dimensions.get('window');

    return (
        <View style={styles.container}>
            <Image 
                source={{ uri: 'https://i.pinimg.com/736x/bf/14/ce/bf14ce834b53e339bfb21e0eddb767cd.jpg' }} 
                style={{ width: width, height: height }} 
            />
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
});

export default PictureScreen;