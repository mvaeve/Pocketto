import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ThemeContext } from "../../themes/theme-context";
import { db } from "../../firebase";
import { collection, query, where, getDocs, orderBy, setDoc, doc } from "firebase/firestore";
import { useIsFocused } from '@react-navigation/native';
import CustomUnorderedList from './CustomUnorderedList';
import ImageModal from 'react-native-image-modal';

const CustomRecap = ({ day }) => {
    const { dark, theme, toggle } = React.useContext(ThemeContext);
    const [completedTodo, setCompletedTodo] = useState([]);
    const [timelineList, setTimelineList] = useState([]);
    const [albumList, setAlbumList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const isFocused = useIsFocused();

    useEffect(() => {
        const loadCompletedTodo = async () => {
            const q = query(collection(db, "Todos", day, "todo"), where('completed', '==', true));

            const querySnapshot = await getDocs(q);
            let completed = [];
            querySnapshot.forEach((doc) => {
                completed.push(doc.data())

            });
            setCompletedTodo(completed);

        }
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
        const getImages = async () => {
            const q = query(collection(db, "Albums", day, "album"));

            const querySnapshot = await getDocs(q);
            let albums = [];
            querySnapshot.forEach((doc) => {
                albums.push(doc.data())

            });

            setAlbumList(albums);

        }
        setAlbumList([])
        setCompletedTodo([])
        setTimelineList([])
        loadCompletedTodo()
        loadTimelineList()
        getImages()

    }, []);
    return (

        <View style={styles.container}>

            <Text style={styles.dateTitleText}>{day}</Text>
            <Text style={styles.contentText}>On this day, you completed {completedTodo.length.toString()} todo </Text>
            {completedTodo.map((todo, i) => {
                return (
                    <CustomUnorderedList key={i} text={todo.text} color={theme.color} />
                )
            })}


            {timelineList.length == 0 ?
                <Text style={styles.contentText}>No task was completed...</Text> :
                <Text style={styles.contentText}>And also completed these tasks</Text>
            }
            {timelineList.map((timeline, i) => {
                let timeTitle = timeline.time + " - " + timeline.title
                return (
                    <CustomUnorderedList key={i} text={timeTitle} color={theme.color} />
                )
            })}

            {albumList.length == 0 ? 
                 <Text style={styles.contentText}>No photos were added for viewing...</Text> :
                 <Text style={styles.contentText}>Let's take a look at these memories!</Text>
        }
            <View style={styles.imageContainer}>
                {albumList.map((image, i) => {
                    return (
                        <ImageModal
                            key={i}
                            resizeMode="contain"
                            imageBackgroundColor="#000000"
                            style={{
                                width: 100,
                                height: 100,


                            }}
                            source={{
                                uri: image.imageURL,
                            }}
                        />

                    )
                })}
            </View>





        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    dateTitleText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,

    },
    contentText: {
        fontSize: 15,
        marginVertical: 4,
        alignSelf: 'flex-start'
    },
    imageContainer: {
        marginTop: 20,
        flexDirection: 'row',
        alignSelf: "flex-start",
        
    }


})

export default CustomRecap