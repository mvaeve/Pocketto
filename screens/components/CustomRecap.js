import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ThemeContext } from "../../themes/theme-context";
import { db } from "../../firebase";
import { collection, query, where, getDocs, deleteDoc, setDoc, doc } from "firebase/firestore";
import { useIsFocused } from '@react-navigation/native';
import CustomUnorderedList from './CustomUnorderedList';

const CustomRecap = ({ day }) => {
    const { dark, theme, toggle } = React.useContext(ThemeContext);
    const [completedTodo, setCompletedTodo] = useState([]);
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
            console.log(completed)

            setCompletedTodo(completed);

        }
        loadCompletedTodo()
    }, []);
    return (
        <View style={styles.container}>
            <Text style={styles.dateTitleText}>{day}</Text>
            <Text style={styles.contentText}>On this day, you completed {completedTodo.length.toString()} todo </Text>
            {completedTodo.map((todo, i) => {
                return (
                    <CustomUnorderedList text={todo.text} color={theme.color}/>
                )
            })}

            <Text style={styles.contentText}>and also completed these tasks</Text>
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
    },


})

export default CustomRecap