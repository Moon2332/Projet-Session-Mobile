import React, { createContext, useContext, useState, useEffect } from 'react';
import init from 'react_native_mqtt';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MQTTContext = createContext();

export const useMQTT = () => useContext(MQTTContext);

export const MQTTProvider = ({ children }) => {
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [notifications_mqtt, setNotifications_mqtt] = useState([])

  useEffect(() => {
    if (client === null) {
      init({
        size: 10000,
        storageBackend: AsyncStorage,
        defaultExpires: 1000 * 3600 * 24,
        enableCache: true,
        reconnect: true,
        sync: {},
      });

      const mqttClient = new Paho.MQTT.Client('172.16.207.140', 9002, 'UNAME2');
      mqttClient.onConnectionLost = onConnectionLost;
      mqttClient.onMessageArrived = onMessageArrived;
      mqttClient.connect({
        onSuccess: () => {
          console.log('Connected successfully!');
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
      

      setClient(mqttClient);
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

    setTimeout(() => {
      if (client) {
          console.log("Attempting to reconnect...");
          client.connect({
              onSuccess: () => {
                  console.log("Reconnected!");
                  client.subscribe('echelon');
              },
              onFailure: onConnectFailure,
          });
      }
  }, 5000);
  };

  const onMessageArrived = (message) => {
    console.log("Message arrived:", message.payloadString);
    if (message.payloadString === "Start" || message.payloadString === "Stop"){
      //
    } else {
      const newNotification = JSON.parse(message.payloadString);
      setNotifications_mqtt((prevNotifications) => [...prevNotifications, newNotification]);
    }
  };

  const sendMessage = (topic, message) => {
    console.log("Sending message to topic:", topic, message);
    if (client && client.isConnected()) {
      client.publish(topic, message, 0, false);
    } else {
      console.log('Not connected, cannot send message');
    }
  };

  return (
    <MQTTContext.Provider value={{ client, connected, notifications_mqtt, sendMessage, setNotifications_mqtt }}>
      {children}
    </MQTTContext.Provider>
  );
};
