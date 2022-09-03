import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Modal, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { ThemeContext } from "../themes/theme-context";
import { Ionicons } from "@expo/vector-icons";
import Swiper from 'react-native-swiper';
import TaskManager from './TaskManager';
import ToDo from './ToDo';
import Album from './Album';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import moment from 'moment';
import CustomRecap from './components/CustomRecap';
import { collection, query, where, getDocs, deleteDoc, setDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

function CalendarHome({ navigation }) {
    const { color, theme, toggle } = React.useContext(ThemeContext);
    const showTheme = () => {
        navigation.navigate("ThemeSelector")
    }
    const todayDate = moment().format("YYYY-MM-DD").toString();
    const [day, setDay] = useState(moment().format("YYYY-MM-DD").toString());
    const dateTitle = moment().format('dddd, MMMM Do');
    const [archiveDate, setArchiveDate] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

    const [todoDate, setTodoDate] = useState([]);
    const [taskDate, setTaskDate] = useState([]);
    const [albumDate, setAlbumDate] = useState([]);

    useEffect(() => {
        const loadToDoDate = async () => {
            const q = query(collection(db, "Todos"));

            const querySnapshot = await getDocs(q);
            let toDos = [];
            querySnapshot.forEach((doc) => {
                toDos.push(doc.id)
            });

            setTodoDate(toDos);
        }

        const loadTaskDate = async () => {
            const q = query(collection(db, "Timelines"));

            const querySnapshot = await getDocs(q);
            let timelines = [];
            querySnapshot.forEach((doc) => {
                timelines.push(doc.id)
            });

            setTaskDate(timelines);
        }
        
        const loadAlbumDate = async () => {
            const q = query(collection(db, "Albums"));

            const querySnapshot = await getDocs(q);
            let albums = [];
            querySnapshot.forEach((doc) => {
                albums.push(doc.id)
            });

            setAlbumDate(albums);
        }
        setTodoDate([])
        setTaskDate([])
        setAlbumDate([])
        loadToDoDate()
        loadTaskDate()
        loadAlbumDate()

       
    }, []);

    var combined = (todoDate.concat(taskDate).concat(albumDate));
    var allDatesUsed =combined.filter((item, pos) => combined.indexOf(item) === pos)

    let markedDay ={}
    allDatesUsed.map((date) => {
        markedDay[date] = {
            marked: true, dotColor: 'red'
        }
    })
    markedDay[day] =  { selected: true };

    // console.log(markedDay)

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
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => {
                                Alert.alert("Modal has been closed.");
                                setModalVisible(!modalVisible);
                            }}
                        >
                            <TouchableOpacity style={styles.centeredView} onPress={() => { setModalVisible(false) }}>
                                <TouchableOpacity style={styles.modal} onPress={() => console.log('do nothing')} activeOpacity={1} >

                                    <View style={[styles.modalView, { backgroundColor: theme.backgroundCard, }]}>
                                      
                                        <CustomRecap day={archiveDate} />
                                 
                                    </View>

                                </TouchableOpacity>
                            </TouchableOpacity>
                        </Modal>

                        <View styles={styles.themeIconContainer}>
                            <Ionicons
                                style={styles.themeIcon}
                                onPress={showTheme}
                                name="color-palette"
                                size={40}
                                color={theme.color}
                            />
                        </View>
                        <View style={styles.dateContainer}>
                            <Text style={[styles.dateTitle, { color: theme.secColor }]}>{dateTitle}</Text>
                        </View>

                        <View style={{
                            flex: 1,
                            borderWidth: 5,
                            borderColor: theme.secColor,
                            marginVertical: 230,
                            width: 370
                        }}>
                            <Calendar
                                key={color}
                                // Handler which gets executed on day press. Default = undefined
                                onDayPress={day => {
                                    // console.log('selected day', day.dateString);
                                    if (day.dateString < todayDate) {
                                        const selectedDay = day.dateString;
                                        setArchiveDate(selectedDay);
                                        setModalVisible(true);
                                    } else {

                                        setDay(day.dateString);
                                        //re render
                                    }


                                }}
                                markedDates={markedDay}

                                // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                                monthFormat={'MM yyyy'}
                                theme={{
                                    backgroundColor: theme.backgroundColor,
                                    calendarBackground: theme.backgroundColor,
                                    textSectionTitleColor: theme.color,
                                    textSectionTitleDisabledColor: '#ababab',
                                    selectedDayBackgroundColor: theme.pinkColor,
                                    selectedDayTextColor: theme.white,
                                    todayTextColor: theme.pinkColor,
                                    // todayBackgroundColor:theme.color,
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
                    <TaskManager day={day} />
                </View>

                <View style={[styles.swiperContainer, { backgroundColor: theme.backgroundColor }]}>
                    <ToDo day={day} />
                </View>

                <View style={[styles.swiperContainer, { backgroundColor: theme.backgroundColor }]}>
                    <Album day={day} />
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
    dateTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        alignSelf: 'center'

    },
    dateContainer: {
        flex: 1,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: 200,

    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        width: 350,
        height: 400,
        margin: 20,
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 3,
            height: 10
        },
        shadowOpacity: 0.7,
        shadowRadius: 20,
        elevation: 10
    },


    wrapper: {},

})
export default CalendarHome