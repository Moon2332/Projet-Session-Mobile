import { useEffect, useRef, useState } from "react";
import init from "react_native_mqtt";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useMQTTClient = (clientId, host, port, topics) => {
  const clientRef = useRef(null);
  const [positions, setPositions] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    init({
      size: 10000,
      storageBackend: AsyncStorage,
      defaultExpires: 1000 * 3600 * 24,
      enableCache: true,
      reconnect: true,
      sync: {},
    });

    clientRef.current = new Paho.MQTT.Client(host, port, clientId);
    clientRef.current.onConnectionLost = onConnectionLost;
    clientRef.current.onMessageArrived = onMessageArrived;

    connect();

    return () => {
      if (clientRef.current && clientRef.current.isConnected()) {
        clientRef.current.disconnect();
      }
    };
  }, [clientId, host, port, topics]);

  const connect = () => {
    console.log("Connecting...");
    clientRef.current.connect({
      onSuccess: onSuccess,
      useSSL: false,
      onFailure: onFailure,
    });
  };

  const onSuccess = () => {
    console.log("Connected successfully!");
    topics.forEach((topic) => {
      clientRef.current.subscribe(topic, { qos: 0 });
    });
    setConnected(true);
  };

  const onConnectionLost = (responseObject) => {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:" + responseObject.errorMessage);
      setConnected(false);
    }
  };

  const onFailure = (e) => {
    console.log("Connection failed", e);
    setConnected(false);
  };

  const sendData = (topic, data) => {
    if (clientRef.current && clientRef.current.isConnected()) {
      clientRef.current.publish(topic, data, 0, false);
    } else {
      console.warn("MQTT client is not connected. Cannot send data.");
    }
  };

  const requestPosition = () => {
    sendData("traybot/sql/getAllPosition", "ඞ");
  };

  const onMessageArrived = (message) => {
    console.log("onMessageArrived:", message.payloadString);
    console.log("Message received on topic:", message.destinationName);

    if (message.destinationName === "sql/mobile/return/positions") {
      try {
        const parsedData = JSON.parse(message.payloadString); 
        if (Array.isArray(parsedData)) {
          const formattedData = parsedData.map(([id, name]) => ({
            label: name,      
            value: id.toString(), 
          }));

          setPositions(formattedData);
        }
      } catch (error) {
        console.error("Error parsing MQTT data:", error);
      }
    }
  };


  return { sendData, requestPosition, positions, connected };
};

export default useMQTTClient;
