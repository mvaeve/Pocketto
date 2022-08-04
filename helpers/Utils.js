import AsyncStorage from "@react-native-async-storage/async-storage";

export function storeData(key, value) {
  const jsonValue = JSON.stringify(value);
  try {
    AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    //console.log("storeData error: " + e)
  }
}

export async function getData(key) {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return JSON.parse(value);
    } else {
      return null;
    }
  } catch (e) {
    //console.log("getData error: " + e)
  }
}