import { View, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native'
import React from 'react'
import { ThemeContext } from "../themes/theme-context";
import Timeline from 'react-native-timeline-flatlist'


const TaskManager = () => {

    const data = [
        { time: '09:00', title: 'Event 1', description: 'Event 1 Description' },
        { time: '10:45', title: 'Event 2', description: 'Event 2 Description' },
        { time: '12:00', title: 'Event 3', description: 'Event 3 Description' },
        { time: '14:00', title: 'Event 4', description: 'Event 4 Description' },
        { time: '16:30', title: 'Event 5', description: 'Event 5 Description' }
    ]

    const { dark, theme, toggle } = React.useContext(ThemeContext);
    const addTimeline = () => {
        console.log("Add timeline")
    }
    return (
        <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>

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
                detailContainerStyle={[styles.detailContainer, { backgroundColor: theme.backgroundCard,}]}
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
        paddingVertical:8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        marginBottom:45,
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
    }

});

export default TaskManager