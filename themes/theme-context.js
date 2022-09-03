import React from "react";
import { StatusBar } from "react-native";
import { Globals, Utils } from "../helpers";

const initialState = {
  color:  "#FFE2A8",  //baby orange
  theme: Globals.orangeTheme,
  toggleColor: () => {},
};

const ThemeContext = React.createContext(initialState);

function ThemeProvider({ children }) {
  const [color, setColor] = React.useState("#FFE2A8");

  // Fetch user preference for dark or light mode
  const readColorStatus = async () => {
    try {
      const result = await Utils.getData("color_mode");
      setColor(result);
    } catch (e) {
      //console.log("error: " + e);
    }
  };

  // Listening to changes of device appearance while in run-time
  React.useEffect(() => {
    readColorStatus();
  }, []);

  // To toggle between dark and light modes
  const toggleColor = (color) => {
    setColor(color);
    Utils.storeData("color_mode", color);
  };

  // Filter the styles based on the theme selected
  const theme = color === "#ffe2a8" ? Globals.orangeTheme :
                  color ===   "#141414" ? Globals.darkTheme :
                  color ===   "#ffffff" ? Globals.lightTheme :
                  Globals.blueTheme

  return (
    <ThemeContext.Provider value={{ theme, color, toggleColor }}>
      <StatusBar barStyle={color !== "#141414" ? "dark-content" : "light-content"} />
      {children}
    </ThemeContext.Provider>
  );
}

export { ThemeProvider, ThemeContext };