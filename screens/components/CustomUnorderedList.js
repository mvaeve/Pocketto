import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Unorderedlist from 'react-native-unordered-list';

const CustomUnorderedList = ({ text, color }) => {
    return (
     
            <Unorderedlist
            style={styles.container}
                bulletUnicode={0x2023}
                color={color}
            >
                <Text style={styles.text}>{text}</Text>
            </Unorderedlist>
    
    )
}

const styles = StyleSheet.create({
    container:{
        marginLeft:20,
    },
    text: {
        fontSize: 15
    }
})

export default CustomUnorderedList