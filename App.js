
import { StyleSheet, Text, View } from 'react-native';
import CalendarHome from './screens/CalendarHome';
import ThemeSelector from './screens/ThemeSelector';
import { ThemeProvider } from './themes/theme-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
          headerShown: false
        }}>
          <Stack.Screen name="CalendarHome" component={CalendarHome} />
          <Stack.Screen name="ThemeSelector" component={ThemeSelector} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

