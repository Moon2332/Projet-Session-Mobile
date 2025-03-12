import React, { useEffect, useState, useRef } from "react";
import { View, Button, StyleSheet, Text } from "react-native";
import init from "react_native_mqtt";
import AsyncStorage from "@react-native-async-storage/async-storage";

const mqttTest = () => {
  const clientRef = useRef(null); 

  const [selectedValue, setSelectedValue] = useState(null);
  const [positionData, setPositionData] = useState([]); 

  useEffect(() => {
    init({
      size: 10000,
      storageBackend: AsyncStorage,
      defaultExpires: 1000 * 3600 * 24,
      enableCache: true,
      reconnect: true,
      sync: {},
    });

    clientRef.current = new Paho.MQTT.Client("172.16.74.69", 9002, "uname1");

    clientRef.current.onConnectionLost = onConnectionLost;
    clientRef.current.onMessageArrived = onMessageArrived;
  }, []);

  const connect = () => {
    console.log("Connecting...");
    clientRef.current.connect({
      onSuccess: onSuccess,
      useSSL: false,
      onFailure: onFailure
    });
  };

  const onSuccess = () => {
    console.log("Connected successfully!");
    clientRef.current.subscribe("test/topic", { qos: 0 });
    clientRef.current.subscribe("sql/mobile/return/positions", { qos: 0 });
  };

  const onFailure = (e) => {
    console.log("Connection failed", e);
  };

  const onConnectionLost = (responseObject) => {
    if (responseObject.errorCode !== 0) {
      console.log("Connection lost:", responseObject.errorMessage);
    }
  };

  const onMessageArrived = (message) => {
    console.log("Message received on topic:", message.destinationName);
    console.log("Message:", message.payloadString);
};

  const sendData = (topic, data) => {
    if (clientRef.current && clientRef.current.isConnected()) {
      clientRef.current.publish(topic, data, 0, false);
    } else {
      console.warn("MQTT client is not connected. Cannot send data.");
    }
  };

  /*
  return (
    <View>
      <Button title="Se connecter" onPress={connect} />
      <Button title="Send Data" onPress={() => sendData("traybot/pi/goToPosition", selectedValue)} />

      <View style={styles.container}>
        <Text style={styles.text}>Select an option:</Text>
        <Dropdown
          data={positionData}
          labelField="label"
          valueField="value"
          value={selectedValue}
          onChange={(item) => setSelectedValue(item.value)}
          style={styles.dropdown}
        />
        {selectedValue && <Text>You selected: {selectedValue}</Text>}
      </View>
    </View>
  );
  */

};

export default mqttTest;
