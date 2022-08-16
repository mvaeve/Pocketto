import { View, Text, StyleSheet, Dimensions, Image} from 'react-native'
import React from 'react'
import Carousel from 'react-native-snap-carousel'


export const SLIDER_WIDTH = Dimensions.get('window').width + 30;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.8);

const CustomCarousel = ({ day }) => {

    const SLIDER_WIDTH = Dimensions.get('window').width + 30;
    const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.8);
    const data = [
        { id: 1, name: day, url: 'https://icon-library.com/images/react-icon/react-icon-29.jpg' },
        { id: 2, name: 'JavaScript', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Javascript_Logo.png' },
        { id: 3, name: 'Node JS', url: 'https://upload.wikimedia.org/wikipedia/commons/6/67/NodeJS.png' },
    ];

    const renderItem = ({ item }) => {
        return (
            <View
                style={{
                    borderWidth: 1,
                    padding: 20,
                    borderRadius: 20,
                    alignItems: 'center',
                    backgroundColor: 'white',
                }}>
                <Image source={{ uri: item.url }} style={{ width: 200, height: 200 }} />
                <Text style={{ marginVertical: 10, fontSize: 20, fontWeight: 'bold' }}>
                    {item.name}
                </Text>
            </View>
        );
    }

    return (
        <View style={{ marginVertical: 10 }}>
            <Carousel
                layout='tinder'
                data={data}
                renderItem={renderItem}
                sliderWidth={SLIDER_WIDTH}
                itemWidth={ITEM_WIDTH}
            />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
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


})

export default CustomCarousel