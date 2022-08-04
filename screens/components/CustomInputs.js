import React, { useEffect } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { ThemeContext } from "../../themes/theme-context";

const CustomInput = ({
  value,
  setValue,
  placeholder,
  style,
  secureTextEntry,
  keyboardType,
  defaultValue,
  multiline,
}) => {
  const { dark, theme, toggle } = React.useContext(ThemeContext);

  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
      value = defaultValue;
    }
  }, [defaultValue]);



  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.backgroundCard },
        style,
      ]}
    >
      <TextInput
        multiline={multiline}
        defaultValue={defaultValue}
        autoCorrect={false}
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        placeholderTextColor={theme.gray}
        style={[styles.input, { color: theme.color }]}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    width: "100%",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginVertical: 10,
    height: 40,
  },
  input: {
    flex: 1,
  },
});

export default CustomInput;