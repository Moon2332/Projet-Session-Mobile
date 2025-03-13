import { useEffect, useRef, useState } from "react";
import init from "react_native_mqtt";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useMQTTClient = (clientId, host, port, topics, onMessageReceived) => {
  const clientRef = useRef(null);
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

  const onMessageArrived = (message) => {
    try {
      const messagePayload = message.payloadString;
      if (isBase64(messagePayload)) {
        onMessageReceived({ type: 'image', data: messagePayload });
      } else {
        onMessageReceived({ type: 'text', data: messagePayload });
      }
    } catch (error) {
      console.error("Error handling message:", error);
    }
  };

  const isBase64 = (str) => {
    try {
      return btoa(atob(str)) === str;
    } catch (e) {
      return false;
    }
  };


  return { sendData, connected };
};

export default useMQTTClient;
