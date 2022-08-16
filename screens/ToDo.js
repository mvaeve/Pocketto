import { View, Text, StyleSheet, Pressable, Modal, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { ThemeContext } from "../themes/theme-context";
import CustomInput from './components/CustomInputs';
import { db } from "../firebase";
import { collection, query, where, getDocs, deleteDoc, setDoc, doc } from "firebase/firestore";
import moment from 'moment';
import { useIsFocused } from '@react-navigation/native';
import * as Haptics from "expo-haptics";
import { useActionSheet } from "@expo/react-native-action-sheet";

const ToDo = ({ day }) => {
	const { dark, theme, toggle } = React.useContext(ThemeContext);
	const { showActionSheetWithOptions } = useActionSheet();
	const [modalVisible, setModalVisible] = useState(false);
	const [todoController, setTodoController] = useState("");
	const [todoControllerOld, setTodoControllerOld] = useState("");
	const [todoList, setTodoList] = useState([]);
	const [state, setState] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isEdit, setIsEdit] = useState(false);

	const isFocused = useIsFocused();

	useEffect(() => {
		const loadToDoList = async () => {
			const q = query(collection(db, "Todos", day, "todo"));

			const querySnapshot = await getDocs(q);
			let toDos = [];
			querySnapshot.forEach((doc) => {
				toDos.push(doc.data())

			});

			setTodoList(toDos);
			setIsLoading(false);

		}
		if (isFocused) {
			loadToDoList();
		}
		if (isLoading) {
			loadToDoList();
		}

	}, [isFocused, state, day]);

	const getTimestampInSeconds = () => {
		return Math.floor(Date.now() / 1000).toString()
	  }

	const onPostItLongPress = (postIt) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Success);
		openPostItSheet(postIt);

	};

	const addPostIt = async () => {
		// setTodoList([...todoList, { text: todoController }]);
		const timestamp = 
		await setDoc(doc(db, `Todos/${day}/todo`, getTimestampInSeconds()), {
			text: todoController,
			completed: false,
		})

		setTodoController("")
		setState(!state);
	}

	const deletePostIt = async (postIt) => {

		const d = query(collection(db, 'Todos', day, "todo"), where('text', '==', postIt.text));
		const docSnap = await getDocs(d);
		docSnap.forEach((doc) => {
			deleteDoc(doc.ref);
			setState(!state);
			Alert.alert(
				"Hooray!",
				`${postIt.text} have been deleted!`
			);
		});
	}

	const editPostIt = (postIt) => {
		setModalVisible(true);
		setIsEdit(true);
		setTodoController(postIt.text);
		setTodoControllerOld(postIt.text);
	}

	const updatePostIt = async () => {
		const up = query(collection(db, 'Todos', day, "todo"), where('text', '==', todoControllerOld));
		const docSnap = await getDocs(up);
		docSnap.forEach((doc) => {
			setDoc(doc.ref, {
				date: day,
				text: todoController,
				completed: false,
			});
			setState(!state);
			Alert.alert(
				"Hooray!",
				`${todoControllerOld} have been updated to ${todoController}!`
			);
			setTodoController("");
			setTodoControllerOld("");
		});
	}


	const openPostItSheet = (postIt) => {
		// console.log(postIt)
		const options = [
			"Edit Post It",
			"Delete Post It",
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
					Alert.alert("Delete Post It",
						`Are you sure you want to delete this post it ${postIt.text}? `,
						[
							{
								text: "Cancel",
								onPress: () => console.log("Cancel Pressed"),
								style: "cancel"
							},
							{ text: "OK", onPress: () => deletePostIt(postIt) }
						]
					);

				} else if (buttonIndex === 0) {
					editPostIt(postIt);
				}
			}
		);
	};

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
							<Text style={[styles.modalText, { color: theme.color }]}>New Post It!</Text>
							<CustomInput
								placeholder="To-do"
								value={todoController}
								setValue={setTodoController}
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
			<View style={[styles.toDoBoard, { backgroundColor: theme.backgroundCard, borderColor: theme.secColor }]}>
				{isLoading ? <ActivityIndicator /> :
					todoList.map((postIt, i) => {

						return (
							<View key={i} style={[styles.postIt, { backgroundColor: theme.pinkColor }]} >
								<Pressable onLongPress={() => { onPostItLongPress(postIt); }}>
									<Text style={styles.postItText}>{postIt.text}</Text>
								</Pressable>
							</View>
						)
					})}

			</View>
			<Pressable
				style={[styles.buttonContainer, { backgroundColor: theme.buttonColor }]}
				onPress={() => setModalVisible(true)}>
				<Text style={[styles.buttonText, { color: theme.color }]}>+</Text>
			</Pressable>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
	},
	toDoBoard: {
		position: 'relative',
		width: 350,
		height: '85%',
		borderWidth: 5,
		flexDirection: 'row',
		flexWrap: 'wrap',

	},
	postIt: {
		width: 150,
		height: 150,
		justifyContent: 'center',
		alignItems: 'center',
		margin: 10,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5

	},
	postItText: {
		fontSize: 20,
		alignContent: 'center'
	},
	buttonContainer: {
		paddingVertical: 8,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 20,
		marginHorizontal: 120,
		borderRadius: 50
	},
	buttonText: {
		fontSize: 32
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

})

export default ToDo