import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import init from 'react_native_mqtt';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MQTTContext = createContext();

export const useMQTT = () => useContext(MQTTContext);

export const MQTTProvider = ({ children }) => {
  const clientRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [notifications_mqtt, setNotifications_mqtt] = useState([])
  console.log(notifications_mqtt)

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

      const mqttClient = new Paho.MQTT.Client('172.16.207.140', 9002, 'UNAME2');


      clientRef.current.onMessageArrived = onMessageArrived; //ADDED 
      mqttClient.onConnectionLost = onConnectionLost;
      mqttClient.onMessageArrived = (message) => {
        console.log("Message arrived:", message.payloadString);
        if (message.payloadString === "Start" || message.payloadString === "Stop"){
          //
        } else {
          const newNotification = JSON.parse(message.payloadString);
          setNotifications_mqtt((prevNotifications) => [...prevNotifications, newNotification]);
        }
      };
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

  const onMessageArrived = (message) => { //Was not declared
    console.log("Message arrived:", message.payloadString);
    if (message.payloadString === "Start" || message.payloadString === "Stop"){
      //NOTHING IS HAPPENIONG HERE
    } else {
      const newNotification = JSON.parse(message.payloadString);
      setNotifications_mqtt((prevNotifications) => [...prevNotifications, newNotification]);
    }
  };

  const sendMessage = (topic, message) => { 
    console.log("Sending message to topic:", topic, message);
    if (clientRef.current && clientRef.current.isConnected()) {
      clientRef.current.publish(topic, message, 0, false);
    } else {
      console.log('Not connected, cannot send message');
    }
  };

  return (
    <MQTTContext.Provider value={{ client: clientRef.current, connected, notifications_mqtt, sendMessage, setNotifications_mqtt }}>
      {children}
    </MQTTContext.Provider>
  );
};




//mosquitto_sub -h 172.16.207.140 -p 9002 -t "echelon" -v
// USE THIS TO CHECK IF THE PI IS THE PROBLEM

//mosquitto_pub -h 172.16.207.140 -p 9002 -t "echelon" -m '{"test": "hello"}'
// TEST THIS TO SEE IF MQTT CAN READ