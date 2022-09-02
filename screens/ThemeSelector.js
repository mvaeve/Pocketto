import React from 'react'
import { StyleSheet, Text, View, Switch, Pressable } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemeContext } from "../themes/theme-context";
function ThemeSelector({navigation}) {
    const { dark, theme, toggle } = React.useContext(ThemeContext);

    const themeConfirm = () => {
        navigation.navigate("CalendarHome")
    }
    return (
        <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
            <View style={styles.switchContainer}>
                <View style={styles.iconTitle}>
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons
                            name="lightbulb-on-outline"
                            size={22}
                            color={theme.color}
                        />
                    </View>

                    <Text
                        style={{
                            color: theme.color,
                            fontSize: 18,
                        }}
                    >
                        {dark ? "Dark" : "Light"} mode
                    </Text>
                </View>

                <Switch
                    trackColor={{ false: "#767577", true: "#ccc" }}
                    thumbColor={dark ? "#fff" : "#f4f3f4"}
                    onChange={toggle}
                    value={dark}
                />
            </View>

            <Pressable style={[styles.confirmContainer, {backgroundColor: theme.buttonColor}]}onPress={themeConfirm}>
                <Text style={[styles.confirmText, {color: theme.color}]}>Save!</Text>
            </Pressable>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        
    },
    switchContainer: {
        flex:1,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
    },
    iconTitle: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconContainer: {
        width: 40,
        height: 40,
        top: 10,
    },
    confirmContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        marginHorizontal: 50,
        borderRadius: 50,
        marginBottom:40
       
    },
    confirmText: {
        fontSize: 20
    }


})
export default ThemeSelector