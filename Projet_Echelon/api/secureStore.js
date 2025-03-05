import * as SecureStore from "expo-secure-store";

export const saveLocalUser = async (user) => {
      try {
        user_json = JSON.stringify(user);
        await SecureStore.setItemAsync("user_echelon", user_json);
      } catch (e) {
        console.error("Erreur lors de la sauvegarde", e);
      }
};

export const getLocalUser = async () => {
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

export const deleteLocalUser = async () => {
  try {
    await SecureStore.deleteItemAsync("user_echelon");
  } catch (e) {
    console.error("Erreur lors de la suppression", e);
  }
}