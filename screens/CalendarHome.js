import React, { useState } from 'react'
import { StyleSheet, View, Text } from 'react-native';
import { ThemeContext } from "../themes/theme-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Swiper from 'react-native-swiper';
import TaskManager from './TaskManager';
import ToDo from './ToDo';
import Memo from './Memo';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
function CalendarHome({ navigation }) {
    const { dark, theme, toggle } = React.useContext(ThemeContext);
    const showTheme = () => {
        navigation.navigate("ThemeSelector")
    }

    return (

        <View style={styles.container}>
            <Swiper
                style={styles.wrapper}
                showsPagination={false}
                showsButtons={false}
                loop={false}
            >
                <View style={[styles.swiperContainer, { backgroundColor: theme.backgroundColor }]}>
                    <View style={styles.container}>
                        <View styles={styles.themeIconContainer}>
                            <MaterialCommunityIcons
                                style={styles.themeIcon}
                                onPress={showTheme}
                                name="palette"
                                size={40}
                                color={theme.color}
                            />
                        </View>
                        <View style={{
                            flex: 1,
                            borderWidth: 5,
                            borderColor: theme.secColor,
                            marginVertical: 238,
                            width: 370
                        }}>
                            <Calendar
                                key={dark}
                                // Handler which gets executed on day press. Default = undefined
                                onDayPress={day => {
                                    console.log('selected day', day);
                                }}
                                // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                                monthFormat={'MM yyyy'}

                                theme={{
                                    backgroundColor: theme.backgroundColor,
                                    calendarBackground: theme.backgroundColor,
                                    textSectionTitleColor: theme.color,
                                    textSectionTitleDisabledColor: '#ababab',
                                    selectedDayBackgroundColor: theme.color,
                                    selectedDayTextColor: theme.color,
                                    todayTextColor: theme.pinkColor,
                                    dayTextColor: theme.secColor,
                                    textDisabledColor: '#ababab',
                                    arrowColor: theme.color,
                                    monthTextColor: theme.color,
                                    textDayFontWeight: '300',
                                    textMonthFontWeight: 'bold',
                                    textDayHeaderFontWeight: '300',
                                    textDayFontSize: 16,
                                    textMonthFontSize: 16,
                                    textDayHeaderFontSize: 14
                                }}

                            />
                        </View>
                    </View >
                </View>

                <View style={[styles.swiperContainer, { backgroundColor: theme.backgroundColor }]}>
                    <TaskManager />
                </View>

                <View style={[styles.swiperContainer, { backgroundColor: theme.backgroundColor }]}>
                    <ToDo />
                </View>

                <View style={[styles.swiperContainer, { backgroundColor: theme.backgroundColor }]}>
                    <Memo />
                </View>

            </Swiper>


        </View>



    )
}

const styles = StyleSheet.create({
    container: {
        // ...StyleSheet.absoluteFillObject
        flex: 1,
    },
    themeIconContainer: {
        flex: 1,
    },
    themeIcon: {
        position: 'absolute',
        top: 50,
        left: 320,
    },
    swiperContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    wrapper: {},

})
export default CalendarHome