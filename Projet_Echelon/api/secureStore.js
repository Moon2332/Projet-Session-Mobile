import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

export const saveUserInfo = async (user) => {
      try {
        await SecureStore.setItemAsync("user_echelon", JSON.stringify(user));
      } catch (e) {
        console.error("Erreur lors de la sauvegarde", e);
      }
};

export const getUserInfo = async () => {
  try {
    const user_json = await SecureStore.getItemAsync("user_echelon");
    const user = JSON.parse(user_json)
    if (user !== null) {
      return user;
    }
  } catch (e) {
    console.error("Erreur lors de la récupération", e);
  }
};

export const deleteUserInfo = async () => {
  try {
    await SecureStore.deleteItemAsync("user_echelon")
    await AsyncStorage.removeItem('fontSize')
    await AsyncStorage.removeItem('langue')
    await AsyncStorage.removeItem('mode')
  } catch (e) {
    console.error("Erreur lors de la suppression", e);
  }
}