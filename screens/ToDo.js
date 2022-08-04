import { View, Text, StyleSheet, Pressable, Modal, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from 'react-native'
import React, { useState, useEffect } from 'react'
import { ThemeContext } from "../themes/theme-context";
import CustomInput from './components/CustomInputs';


const ToDo = () => {

  const { dark, theme, toggle } = React.useContext(ThemeContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [todoController, setTodoController] = useState("");
  const [todoList, setTodoList] = useState(
    [
      { text: 'Dummy1' },
      { text: 'Dummy2' },
      { text: 'Dummy3' },
    ])

  const getCurrentDate = () => {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();

    //format: ddmmyyyy;
    return date + month + year;
  }

  const addPostIt = () => {
    setTodoList([...todoList, { text: todoController }]);

    setTodoController("")
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Modal
        onb
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
                onPress={() => { setModalVisible(!modalVisible); addPostIt(); }}
              >
                <Text style={[styles.textStyle, { color: theme.color }]}>Add</Text>
              </Pressable>
            </View>

          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
      <View style={[styles.toDoBoard, { backgroundColor: theme.backgroundCard, borderColor: theme.secColor }]}>
        {todoList.map((postIt, i) => {
          return (
            <View key={i} style={[styles.postIt, { backgroundColor: theme.pinkColor }]}>
              <Text style={styles.postItText}>{postIt.text}</Text>
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