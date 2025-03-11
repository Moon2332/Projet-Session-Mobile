import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faWarning } from '@fortawesome/free-solid-svg-icons';

const AlertModal = ({
  visible,
  setVisible,
  onPressConfirm,
  mode, 
  message,
}) => {
  const dynamicStyles = StyleSheet.create({
    container: {
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
    title: {
      fontSize: 25,
      fontWeight: 'bold',
      color: mode ? '#FFFFFF' : '#000000',
    },
    message: {
      fontSize: 16,
      color: mode ? '#FFFFFF' : '#333333',
      marginBottom: 10,
      textAlign: 'center'
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
    cancelButton: {
      backgroundColor: mode ? '#FF5733' : '#C70039', 
    },
    saveButton: {
      backgroundColor: mode ? '#4CAF50' : '#218838',
    },
    iconContainer: {
      flexDirection: 'row',
      alignContent: 'center',
      marginBottom: 10,
    },
    icon: {
      color: mode ? '#FFFFFF' : '#000000', 
      marginRight: 10,
    }
  });

  return (
    <View>
        <Modal transparent={true} animationType="fade" visible={visible} onRequestClose={() => setVisible(false)}>
        <View style={dynamicStyles.container}>
            <View style={dynamicStyles.modalContent}>
            <View style={dynamicStyles.iconContainer}>
                <FontAwesomeIcon icon={faWarning} size={30} style={dynamicStyles.icon} />
                <Text style={dynamicStyles.title}>Attention</Text>
            </View>

            <Text style={dynamicStyles.message}>{message}</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <TouchableOpacity
                style={[dynamicStyles.button, dynamicStyles.cancelButton]}
                onPress={() => setVisible(false)}
                >
                <Text style={dynamicStyles.buttonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                style={[dynamicStyles.button, dynamicStyles.saveButton]}
                onPress={() => onPressConfirm()}
                >
                <Text style={dynamicStyles.buttonText}>Yes</Text>
                </TouchableOpacity>
            </View>
            </View>
        </View>
        </Modal>
    </View>
  );
};

export default AlertModal;
