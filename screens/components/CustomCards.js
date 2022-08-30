import { View, Pressable, Dimensions, Image, StyleSheet, Modal, TouchableOpacity, Text, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { ThemeContext } from "../../themes/theme-context";
import CustomInput from './CustomInputs';
import { db } from "../../firebase";
import { collection, query, where, getDocs, deleteDoc, setDoc, doc } from "firebase/firestore";
export const SLIDER_WIDTH = Dimensions.get('window').width + 80
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7)

const CustomCards = ({ item, index, day, onStateChange, currState }) => {

  const { dark, theme, toggle } = React.useContext(ThemeContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [captionController, setCaptionController] = useState(item.caption !== undefined ? item.caption : "");
  const [captionControllerOld, setCaptionControllerOld] = useState(item.caption !== undefined ? item.caption : "");
  const [isEdit, setIsEdit] = useState(item.caption !== undefined ? true : false);

  const addDesc = () => {
    setModalVisible(true)
  }
  const addCaption = async () => {
    const up = query(collection(db, 'Albums', day, "album"), where('imageURL', '==', item.imageURL));
    const docSnap = await getDocs(up);
    docSnap.forEach((doc) => {
      setDoc(doc.ref, {
        caption: captionController,
        imageURL: item.imageURL
      });
      Alert.alert(
        "Hooray!",
        `Caption have been added!`
      );
      setIsEdit(true);
      onStateChange(!currState)
      setCaptionControllerOld(captionController);
      setCaptionController(captionController);

    });
  }

  const updateCaption = async () => {
    const up = query(collection(db, 'Albums', day, "album"), where('caption', '==', captionControllerOld));
    const docSnap = await getDocs(up);
    docSnap.forEach((doc) => {
      setDoc(doc.ref, {
        caption: captionController,
        imageURL: item.imageURL
      });
      Alert.alert(
        "Hooray!",
        `Caption have been updated to ${captionController}!`
      );
      setIsEdit(true);
      onStateChange(!currState)
      setCaptionControllerOld(captionController);
      setCaptionController(captionController);

    });
  }
  return (
    <View>
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
              {item.caption !== undefined ?
                <Text style={[styles.modalText, { color: theme.color }]}>Edit caption!</Text> :
                <Text style={[styles.modalText, { color: theme.color }]}>Add a caption!</Text>
              }

              <CustomInput
                placeholder="Photo caption"
                value={captionController}
                setValue={setCaptionController}
                multiline={true}
                style={{ height: 120 }}
              />
              <Pressable
                style={[styles.button, { backgroundColor: theme.buttonColor }]}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  if (isEdit) {
                    updateCaption();
                  } else {
                    addCaption();
                  }
                }}
              >
                {item.caption !== undefined ?
                  <Text style={[styles.textStyle, { color: theme.color }]}>Update</Text> :
                  <Text style={[styles.textStyle, { color: theme.color }]}>Add</Text>
                }

              </Pressable>
            </View>

          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
      <Pressable key={index} onPress={addDesc}>
        <View style={[styles.polaroid, { backgroundColor: theme.white }]}>
          <Image
            style={styles.image}
            source={{ uri: item.imageURL }}
          />
          <View style={styles.caption}>
            {item.caption !== undefined && <Text style={[styles.captionText, { color: theme.secColor }]}>{item.caption}</Text>}
          </View>
        </View>
      </Pressable>
    </View>
  )
}


const styles = StyleSheet.create({
  image: {
    width: ITEM_WIDTH - 20,
    height: '60%',
    top: 20,
  },
  polaroid: {
    width: ITEM_WIDTH,
    height: '100%',
    borderRadius: 3,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignSelf: 'center',
    alignItems: 'center',
    top: 40
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
  caption: {
    marginVertical: 20,
    marginLeft: 10,
    alignSelf: 'flex-start'
  },
  captionText: {
    fontSize: 30
  }

})

export default CustomCards