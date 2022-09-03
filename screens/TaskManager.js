import { View, Text, StyleSheet, Pressable, Modal, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { ThemeContext } from "../themes/theme-context";
import Timeline from 'react-native-timeline-flatlist';
import CustomInput from './components/CustomInputs';
import CustomDateTimePicker from './components/CustomDateTimePicker';
import { useIsFocused } from '@react-navigation/native';
import * as Haptics from "expo-haptics";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { db } from "../firebase";
import { collection, query, where, getDocs, deleteDoc, setDoc, doc, orderBy } from "firebase/firestore";

const TaskManager = ({ day }) => {
    const { showActionSheetWithOptions } = useActionSheet();
    const isFocused = useIsFocused();
    const { dark, theme, toggle } = React.useContext(ThemeContext);

    const [startTimeController, setStartTimeController] = useState("");
    const [startTimeControlleOld, setStartTimeControllerOld] = useState("");
    const [titleController, setTitleController] = useState("");
    const [titleControllerOld, setTitleControllerOld] = useState("");
    const [descriptionController, setDescriptionController] = useState("");
    const [descriptionControllerOld, setDescriptionControllerOld] = useState("");

    const [modalVisible, setModalVisible] = useState(false);
    const [timelineList, setTimelineList] = useState([]);
    const [state, setState] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isEdit, setIsEdit] = useState(false);



    const openTimelineModal = () => {
        setModalVisible(true)
    }
    useEffect(() => {
        const loadTimelineList = async () => {
            const q = query(collection(db, "Timelines", day, "timeline"), orderBy("time"));

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
    const addTimeline = async () => {
        //make document exist
        await setDoc(doc(db, `Timelines/${day}`), {
            id: 1
        })
        await setDoc(doc(db, `Timelines/${day}/timeline`, getTimestampInSeconds()), {
            time: startTimeController,
            title: titleController,
            description: descriptionController,
        })
        setStartTimeController("")
        setTitleController("")
        setDescriptionController("")
        setState(!state);
    }

    const deleteTimeline = async (timeline) => {

        const d = query(collection(db, 'Timelines', day, "timeline"), where('title', '==', timeline.title));
        const docSnap = await getDocs(d);
        docSnap.forEach((doc) => {
            deleteDoc(doc.ref);
          
            Alert.alert(
                "Hooray!",
                `${timeline.title} have been deleted!`
            );
        });
        setStartTimeController("");
        setStartTimeControllerOld("");
        setTitleController("");
        setTitleControllerOld("");
        setDescriptionController("");
        setDescriptionControllerOld("");
        setIsEdit(false)
        setState(!state);
       
    }

    const editTimeline = (timeline) => {
      

        setStartTimeController(timeline.time);
        setStartTimeControllerOld(timeline.time);
        setTitleController(timeline.title);
        setTitleControllerOld(timeline.title);
        setDescriptionController(timeline.description);
        setDescriptionControllerOld(timeline.description);
        setModalVisible(true);
        setIsEdit(true);
    }

    const updateTimeline = async () => {
        const up = query(collection(db, 'Timelines', day, "timeline"), where('title', '==', titleControllerOld));
        const docSnap = await getDocs(up);
        docSnap.forEach((doc) => {
            setDoc(doc.ref, {
                time: startTimeController,
                title: titleController,
                description: descriptionController,
            });
            setState(!state);
            Alert.alert(
                "Hooray!",
                `${titleControllerOld} have been updated!`
            );
            setStartTimeController("");
            setStartTimeControllerOld("");
            setTitleController("");
            setTitleControllerOld("");
            setDescriptionController("");
            setDescriptionControllerOld("");
            setIsEdit(false)
            setState(!state)
        });
    }


    const openTimelineSheet = (timeline) => {
        const options = [
            `Edit ${timeline.title}`,
            `Delete ${timeline.title}`,
            "Cancel",
        ];
        const cancelButtonIndex = 2;
        const destructiveButtonIndex = 1;

        showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
                destructiveButtonIndex,
                userInterfaceStyle: dark ? "dark" : "light",
            },
            (buttonIndex) => {
                if (buttonIndex === destructiveButtonIndex) {
                    Alert.alert(`Delete ${timeline.title}`,
                        `Are you sure you want to delete activity ${timeline.title}? `,
                        [
                            {
                                text: "Cancel",
                                onPress: () => console.log("Cancel Pressed"),
                                style: "cancel"
                            },
                            { text: "OK", onPress: () => deleteTimeline(timeline) }
                        ]
                    );

                } else if (buttonIndex === 0) {
                    editTimeline(timeline);
                }
            }
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
             {timelineList.length === 0 &&
                <View style={styles.noActContainer}>
                    <Text style={[styles.noActText, {color:theme.color}]}>Go ahead and add a new activity!</Text>
                </View>
            }
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
                                dateValue={startTimeController}
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
                                        updateTimeline();
                                    } else {
                                        addTimeline();
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
                data={timelineList}
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
                onEventPress={openTimelineSheet}
            />


            <Pressable
                style={[styles.buttonContainer, { backgroundColor: theme.buttonColor }]}
                onPress={openTimelineModal}>
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
    },
    noActContainer: {
        justifyContent:'center',
        alignItems:'center',
        flex:1,
        top: 170,
        padding: 20
        
    },
    noActText: {
        fontSize: 26,
        textAlign:'center',
        

    }

});

export default TaskManager