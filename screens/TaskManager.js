import { View, Text, StyleSheet, Pressable, Modal, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { ThemeContext } from "../themes/theme-context";
import Timeline from 'react-native-timeline-flatlist';
import CustomInput from './components/CustomInputs';
import CustomDateTimePicker from './components/CustomDateTimePicker';
import { useIsFocused } from '@react-navigation/native';
import { db } from "../firebase";
import { collection, query, where, getDocs, deleteDoc, setDoc, doc } from "firebase/firestore";

const TaskManager = ({ day }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [startTimeController, setStartTimeController] = useState("");
    const [titleController, setTitleController] = useState("");
    const [descriptionController, setDescriptionController] = useState("");
    const [timelineList, setTimelineList] = useState([]);
    const [state, setState] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isEdit, setIsEdit] = useState(false);

    const isFocused = useIsFocused();


    const data = [
        { time: '09:00', title: 'Event 1', description: 'Event 1 Description' },
        { time: '10:45', title: 'Event 2', description: 'Event 2 Description' },
        { time: '12:00', title: 'Event 3', description: 'Event 3 Description' },
        { time: '14:00', title: 'Event 4', description: 'Event 4 Description' },
        { time: '16:30', title: 'Event 5', description: 'Event 5 Description' }
    ]

    const { dark, theme, toggle } = React.useContext(ThemeContext);

    const addTimeline = () => {
        setModalVisible(true)
    }
    useEffect(() => {
        const loadTimelineList = async () => {
            const q = query(collection(db, "Timeline", day, "timeline"));

            const querySnapshot = await getDocs(q);
            let timelines = [];
            querySnapshot.forEach((doc) => {
                timelines.push(doc.data())

            });

            setTimelineList(timelines);
            setIsLoading(false);

        }
        if (isFocused) {
            loadTimelineList();
        }
        if (isLoading) {
            loadTimelineList();
        }

    }, [isFocused, state, day]);

    const getTimestampInSeconds = () => {
        return Math.floor(Date.now() / 1000).toString()
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
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

                        <View style={[styles.modalView, { backgroundColor: theme.backgroundColor, }]}>
                            <Text style={[styles.modalText, { color: theme.color }]}>New Activity!</Text>
                            <CustomDateTimePicker
                                placeholder="Start Time"
                                modes="time"
                                onDateChange={setStartTimeController}
                            />

                            <CustomInput
                                placeholder="title"
                                value={titleController}
                                setValue={setTitleController}
                            />
                            <CustomInput
                                placeholder="Description"
                                style={{ height: 120 }}
                                value={descriptionController}
                                setValue={setDescriptionController}
                                multiline={true}
                            />
                            <Pressable
                                style={[styles.button, { backgroundColor: theme.buttonColor }]}
                                onPress={() => {
                                    setModalVisible(!modalVisible);
                                    if (isEdit) {
                                        updatePostIt();
                                    } else {
                                        addPostIt();
                                    }
                                }}
                            >
                                <Text style={[styles.textStyle, { color: theme.color }]}>Add</Text>
                            </Pressable>
                        </View>

                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            <Timeline
                style={styles.list}
                data={data}
                circleSize={20}
                circleColor={theme.backgroundCard}
                lineColor={theme.backgroundCard}
                timeContainerStyle={{ minWidth: 52, marginTop: -5 }}
                timeStyle={[styles.timeStyle, { backgroundColor: theme.pinkColor, color: theme.invColor }]}
                descriptionStyle={{ color: theme.color }}
                titleStyle={{ color: theme.color }}
                options={{
                    style: { paddingTop: 100 }
                }}
                separator={false}
                detailContainerStyle={[styles.detailContainer, { backgroundColor: theme.backgroundCard, }]}
                columnFormat='two-column'
            />

            <Pressable
                style={[styles.buttonContainer, { backgroundColor: theme.buttonColor }]}
                onPress={addTimeline}>
                <Text style={[styles.buttonText, { color: theme.color }]}>+</Text>
            </Pressable>


        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,

    },
    list: {
        flex: 1,
    },

    buttonContainer: {
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 45,
        marginHorizontal: 140,
        borderRadius: 50
    },
    buttonText: {
        fontSize: 32
    },
    timeStyle: {
        textAlign: 'center',
        padding: 5,
        borderRadius: 13
    },
    detailContainer: {
        marginBottom: 20,
        paddingLeft: 5,
        paddingRight: 5,
        borderRadius: 10
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        width: 300,
        margin: 20,
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }

});

export default TaskManager