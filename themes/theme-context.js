import React from "react";
import { StatusBar } from "react-native";
import { Globals, Utils } from "../helpers";

const initialState = {
  dark: false,
  theme: Globals.lightTheme,
  toggle: () => {},
};

const ThemeContext = React.createContext(initialState);

function ThemeProvider({ children }) {
  const [dark, setDark] = React.useState(null);

  // Fetch user preference for dark or light mode
  const readDarkStatus = async () => {
    try {
      const result = await Utils.getData("dark_mode");
      setDark(result === "true");
    } catch (e) {
      //console.log("error: " + e);
    }
  };

  // Listening to changes of device appearance while in run-time
  React.useEffect(() => {
    readDarkStatus();
  }, []);

  // To toggle between dark and light modes
  const toggle = () => {
    setDark(!dark);
    console.log(dark)
    
    Utils.storeData("dark_mode", !dark ? "true" : "false");
  };

  // Filter the styles based on the theme selected
  const theme = dark ? Globals.niceTheme : Globals.lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, dark, toggle }}>
      <StatusBar barStyle={!dark ? "dark-content" : "light-content"} />
      {children}
    </ThemeContext.Provider>
  );
}

export { ThemeProvider, ThemeContext };