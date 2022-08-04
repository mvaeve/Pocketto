import { View, Text } from 'react-native'
import React from 'react'
import { ThemeContext } from "../themes/theme-context";

const Memo = () => {
    const { dark, theme, toggle } = React.useContext(ThemeContext);
    
    return (
    <View>
      <Text>Memo</Text>
    </View>
  )
}

export default Memo