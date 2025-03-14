import React, { createContext, useContext, useState, useEffect } from 'react';
import init from 'react_native_mqtt';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MQTTContext = createContext();

export const useMQTT = () => useContext(MQTTContext);

export const MQTTProvider = ({ children }) => {
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);

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

      const mqttClient = new Paho.MQTT.Client('192.168.2.237', 9002, 'UNAME2');
      mqttClient.onConnectionLost = onConnectionLost;
      mqttClient.onMessageArrived = onMessageArrived;
      mqttClient.connect({
        onSuccess: onConnectSuccess,
        onFailure: onConnectFailure,
      });

      setClient(mqttClient);
    }

    return () => {
      if (client && client.isConnected()) {
        client.disconnect();
      }
    };
  }, []);

  const onConnectSuccess = () => {
    console.log('Connected successfully!');
    setConnected(true);
  };

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
    console.log('Message arrived: ', message.payloadString);
  };

  const sendMessage = (topic, message) => {
    if (client && client.isConnected()) {
      client.publish(topic, message, 0, false);
    } else {
      console.log('Not connected, cannot send message');
    }
  };

  return (
    <MQTTContext.Provider value={{ client, connected, sendMessage }}>
      {children}
    </MQTTContext.Provider>
  );
};
