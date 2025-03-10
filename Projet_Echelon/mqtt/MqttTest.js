import React, { useEffect } from "react";
import { View, Button } from "react-native";
import init from "react_native_mqtt";
import AsyncStorage from "@react-native-async-storage/async-storage";

const mqttTest = () => {
  var client = null;

  useEffect(() => {
     init({
       size: 10000,
       storageBackend: AsyncStorage,
       defaultExpires: 1000 * 3600 * 24,
       enableCache: true,
       reconnect: true,
       sync: {},
     });

    client = new Paho.MQTT.Client("172.16.87.91", 9002, "Mr.bean"); //make sure corret ip and port
    // console.log("client", client);
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    
  }, []);

  const connect = () => {
    console.log("onConnect");
    client.connect({ onSuccess: onSuccess, useSSL: false, onFailure: onFailure });
  };

  const onSuccess = () => {
    console.log("onSuccess");
    client.subscribe("test/topic", { qos: 0 });
  };

  const onFailure = (e) => {
    console.log("onFailure", e);

  };

  const onConnectionLost = (responseObject) => {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:" + responseObject.errorMessage);
    }
  };

  const onMessageArrived = (message) => {
    console.log("onMessageArrived:" + message.payloadString);
  };

  const sendData = () => {
    client.publish("test/topic", "data", 0, false);
  };

  return (
    <View>
      <Button title="Se connecter" onPress={connect} />
      <Button title="Send Data" onPress={sendData} />
    </View>
  );
};

export default mqttTest;
