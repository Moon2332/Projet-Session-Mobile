import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {  Text, Button, View, Modal } from 'react-native'
import init from 'react_native_mqtt';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

const MQTTContext = createContext();

export const useMQTT = () => useContext(MQTTContext);

export const MQTTProvider = ({ children }) => {
  const clientRef = useRef(null);
  const {t } = useTranslation()
  const [connected, setConnected] = useState(false);
  const [notification_mqtt, setNotification_mqtt] = useState(null)
  const [reconnectTimeout, setReconnectTimeout] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)

  useEffect(() => {
    if (!clientRef.current) {
      init({
        size: 10000,
        storageBackend: AsyncStorage,
        defaultExpires: 1000 * 3600 * 24,
        enableCache: true,
        reconnect: true,
        sync: {},
      });

      const mqttClient = new Paho.MQTT.Client('172.16.203.149', 9002, 'UNAME2');
      // const mqttClient = new Paho.MQTT.Client('192.168.2.237', 9002, 'UNAME2');
      mqttClient.onMessageArrived = onMessageArrived;
      mqttClient.onConnectionLost = onConnectionLost;
      mqttClient.connect({
        onSuccess: () => {
          console.log('Connected successfully to MQTT!');
          setConnected(true);
          clearTimeout(reconnectTimeout)

          mqttClient.subscribe('echelon', {
            qos: 0,
            onSuccess: () => {
              console.log('Subscribed to echelon topic');
            },
            onFailure: (error) => {
              console.log('Failed to subscribe to echelon topic', error);
            },
          });
        },
        onFailure: onConnectFailure,
      });

      clientRef.current = mqttClient;
    }
  }, []);

  const onConnectFailure = (error) => {
    console.log('Connection failed', error);
    setConnected(false);
  };

  const onConnectionLost = (responseObject) => {
    if (responseObject.errorCode !== 0) {
      console.log('Connection lost: ' + responseObject.errorMessage);
      setConnected(false);

      const reconnectDelay = 5000; 
      console.log(`Reconnecting in ${reconnectDelay / 1000} seconds...`);

      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }

      const timeoutId = setTimeout(() => {
        console.log('Attempting to reconnect...');
        clientRef.current.connect({
          onSuccess: () => {
            console.log('Reconnected successfully to MQTT!');
            setConnected(true);
            setReconnectTimeout(null);
          },
          onFailure: onConnectFailure,
        });
      }, reconnectDelay);

      setReconnectTimeout(timeoutId);
    }
  };

  const onMessageArrived = (message) => {
    console.log("Message arrived:", message.payloadString);
    try {
      if (message.payloadString === "Start" || message.payloadString === "Stop" || message.payloadString === "Test" || message.payloadString === "Start1" || message.payloadString === "Stop" || message.payloadString === "Stop1" || message.payloadString === "Binted") {
        // 
      } else {
        const newNotification = JSON.parse(message.payloadString);
        setNotification_mqtt(newNotification);
      }
    } catch (error) {
      console.error('Error parsing message:', error, message.payloadString);
    }
  };

  const sendMessage = (topic, message) => {
    console.log("Sending message to topic:", topic, message);
    if (clientRef.current && clientRef.current.isConnected()) {
      clientRef.current.send(topic, message, 0, false);
    } else {
      console.log('Not connected, cannot send message');
    }
  };

  return (
    <MQTTContext.Provider value={{ client: clientRef.current, connected, notification_mqtt, sendMessage }}>
      {children}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
          <View style={{
            width: 300,
            padding: 20,
            backgroundColor: 'white',
            borderRadius: 10,
            alignItems: 'center',
          }}>
            <Text style={{ fontSize: 18, marginBottom: 20 }}>
              {t("connectionLost")}
            </Text>
            <Button title={("Notifications.button)")} onPress={() => setIsModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </MQTTContext.Provider>
  );
};
