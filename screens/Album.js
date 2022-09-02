import { View, Text, StyleSheet, Pressable, } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { ThemeContext } from "../themes/theme-context";
import { db } from "../firebase";
import { getDownloadURL, getStorage, listAll, ref, uploadBytes } from 'firebase/storage';
import { setDoc, doc, query, collection, getDocs } from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';
import { useIsFocused } from '@react-navigation/native';
import CustomCards, { SLIDER_WIDTH, ITEM_WIDTH } from './components/CustomCards';
import Carousel, { Pagination } from 'react-native-snap-carousel'


const Album = ({ day }) => {
  const { dark, theme, toggle } = React.useContext(ThemeContext);
  const [data, setData] = useState([]);
  const [state, setState] = useState(false);
  const isFocused = useIsFocused();
  const [index, setIndex] = useState(0);
  const isCarousel = useRef(null);


  useEffect(() => {
    const getImages = async () => {
      const q = query(collection(db, "Albums", day, "album"));

      const querySnapshot = await getDocs(q);
      let albums = [];
      querySnapshot.forEach((doc) => {
        albums.push(doc.data())

      });

      setData(albums);

    }
    if (isFocused) {
      getImages();
    }
    if (data.length === 0) {
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
      //make document exist
      await setDoc(doc(db, `Albums/${day}`), {
        id: 1
      })
      await setDoc(doc(db, `Albums/${day}/album`, getTimestampInSeconds()), {
        imageURL: await getDownloadURL(reference),
      })

      setData([]);
      setState(!state);
    }
    // else {
    //   Alert.alert("Error", "Please upload file with less than 2 kib")
    // }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={[styles.board, { backgroundColor: theme.backgroundColor, borderColor: theme.backgroundCard }]}>
        {data.length === 0 &&
          <View style={styles.noActContainer}>
            <Text style={[styles.noActText, { color: theme.color }]}>Go ahead and add a new polaroid!</Text>
          </View>
        }
        <Carousel
          layout="tinder"
          layoutCardOffset={9}
          ref={isCarousel}
          data={data}
          renderItem={({ item, index }) => <CustomCards item={item} key={index} day={day} onStateChange={setState} currState={state} />}
          sliderWidth={SLIDER_WIDTH}
          itemWidth={ITEM_WIDTH}
          inactiveSlideShift={0}
          useScrollView={true}
          onSnapToItem={(index) => setIndex(index)}
        />
        <Pagination
          dotsLength={data.length}
          activeDotIndex={index}
          carouselRef={isCarousel}
          dotStyle={{
            width: 10,
            height: 10,
            borderRadius: 5,
            marginHorizontal: 0,
            backgroundColor: theme.secColor
          }}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
          tappableDots={true}
        />


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
  board: {
    width: 350,
    height: '85%',
    borderWidth: 5,
    justifyContent: 'center',
    alignItems: 'center'
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
  noActContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
		top: 170,
		padding: 20

	},
	noActText: {
		fontSize: 26,
		textAlign: 'center',


	}


})

export default Album