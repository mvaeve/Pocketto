
import { StyleSheet, Text, View } from 'react-native';
import CalendarHome from './screens/CalendarHome';
import ThemeSelector from './screens/ThemeSelector';
import { ThemeProvider } from './themes/theme-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDeDxtLTAaqsgfweKEFnWI1vuGYpnXeiSw",
  authDomain: "pocketto-2a284.firebaseapp.com",
  databaseURL: "https://pocketto-2a284-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "pocketto-2a284",
  storageBucket: "pocketto-2a284.appspot.com",
  messagingSenderId: "658026197315",
  appId: "1:658026197315:web:0b990806f170f504617ff6"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <ActionSheetProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{
            headerShown: false
          }}>
            <Stack.Screen name="CalendarHome" component={CalendarHome} />
            <Stack.Screen name="ThemeSelector" component={ThemeSelector} />
          </Stack.Navigator>
        </NavigationContainer>
      </ActionSheetProvider>
    </ThemeProvider>
  );
}

