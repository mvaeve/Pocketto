import { View, Text, StyleSheet, Pressable, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ThemeContext } from "../themes/theme-context";
import { getDownloadURL, getStorage, listAll, ref, uploadBytes } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { useIsFocused } from '@react-navigation/native';

const Memo = ({ day }) => {
  const { dark, theme, toggle } = React.useContext(ThemeContext);
  const [url, setUrl] = useState([]);
  const [state, setState] = useState(false);
	const isFocused = useIsFocused();

  useEffect(() => {
    const getImages = async () => {
      const storage = getStorage();
      const reference = ref(storage, day);
      // Find all the prefixes and items.
      listAll(reference)
        .then((res) => {      
          res.items.forEach((itemRef) => {
           getDownloadURL(itemRef).then((x,err) => {
              console.log(x)
              setUrl((prevUrlArray) => [
                ...prevUrlArray,
                x
              ])
            })
          });
        }).catch((error) => {
          // Uh-oh, an error occurred!
        });
    }
    if (url.length === 0) {
      getImages();
    }

   

    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, please allow camera roll permissions first in settings!");
        }
      }
    })();
   
  }, [day, isFocused, state]);

  const getTimestampInSeconds = () => {
    return Math.floor(Date.now() / 1000).toString()
  }


  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      const storage = getStorage();
      const reference = ref(storage, `${day}/${getTimestampInSeconds()}.jpg`);
      //convert img to array of bytes
      const img = await fetch(result.uri);
      //blob is firebase storage way of storing bytes
      const bytes = await img.blob();
      // upload the image in an array of bytes, 
      //so result.uri is the image encoded into a string then later convert to bytes
      await uploadBytes(reference, bytes);
      setUrl([]);
      setState(!state);
    
    } 
    // else {
    //   Alert.alert("Error", "Please upload file with less than 2 kib")
    // }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={[styles.toDoBoard, { backgroundColor: theme.backgroundCard, borderColor: theme.secColor }]}>
        {url.map((img, i) => {
          return(
            <View  key={i} style={[styles.polaroid, { backgroundColor: theme.white }]}>
            <Image
              style={styles.image}
              source={{ uri: img }}
            />
          </View>
          )
        })}
       
      </View>
      <Pressable
        style={[styles.buttonContainer, { backgroundColor: theme.buttonColor }]}
        onPress={pickImage}>
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
  image: {
    width: '90%',
    height: '75%',
    bottom: 20
  },
  polaroid: {
    width: 150,
    height: 220,
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
    elevation: 5,

  }


})

export default Memo