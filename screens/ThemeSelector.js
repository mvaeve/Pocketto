import React from 'react'
import { StyleSheet, Text, View, Switch, Pressable } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemeContext } from "../themes/theme-context";
import ColorPicker, { Swatches } from 'reanimated-color-picker';
function ThemeSelector({ navigation }) {
    const { color, theme, toggleColor } = React.useContext(ThemeContext);

    const themeConfirm = () => {
        navigation.navigate("CalendarHome")
    }
    const customSwatches = [
        "#FFFFFF",  //white
        "#FFE2A8",  //baby orange
        '#e0ecff',  //baby blue
        "#141414",  //dark dark grey
    ];
    const onSelectColor = ({ hex }) => {
        toggleColor(hex)
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
            <View style={styles.titleContainer}>
                <Text style={[styles.titleText, {color:theme.color}]}>Select your own theme</Text>
            </View>
            <ColorPicker onComplete={onSelectColor}>
                <Swatches colors={customSwatches} swatchStyle={[styles.swatchStyle, { shadowColor: color==="#141414" ?"#FFF" : "#000"}]} />
            </ColorPicker>
            <Pressable style={[styles.confirmContainer, { backgroundColor: theme.buttonColor }]} onPress={themeConfirm}>
                <Text style={[styles.confirmText, { color: theme.color }]}>Save!</Text>
            </Pressable>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',

    },
    titleContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
    },
   titleText: {
      fontSize: 30
    },
    confirmContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        marginHorizontal: 50,
        borderRadius: 50,
        marginBottom: 40

    },
    confirmText: {
        fontSize: 20
    },
    swatchStyle: {
        borderRadius: 20,
        height: 40,
        width: 40,
        marginHorizontal: 10,
        marginBottom: 15,
		shadowOffset: {
			width: 2,
			height: 3
		},
		shadowOpacity: 0.5,
		shadowRadius: 5,
		elevation: 1
    },


})
export default ThemeSelector