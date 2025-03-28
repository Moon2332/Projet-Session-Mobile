import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import init from 'react_native_mqtt';
import AsyncStorage from '@react-native-async-storage/async-storage';
const MQTTContext = createContext();

export const useMQTT = () => useContext(MQTTContext);

export const MQTTProvider = ({ children }) => {
  const clientRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [notification_mqtt, setNotification_mqtt] = useState(null)

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
    }
  };

  const onMessageArrived = (message) => {
    console.log("Message arrived:", message.payloadString);
    try {
      if (message.payloadString === "Start" || message.payloadString === "Stop" || message.payloadString === "Test" || message.payloadString === "Start1" || message.payloadString === "Stop" || message.payloadString === "Test" || message.payloadString === "Binted") {
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
    </MQTTContext.Provider>
  );
};
