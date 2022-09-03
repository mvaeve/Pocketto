import { View, Text, Platform, Pressable, StyleSheet, Modal } from 'react-native';
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { ThemeContext } from '../../themes/theme-context';

const CustomDateTimePicker = ({ placeholder, modes, dateValue, onDateChange }) => {
    const [activate, setActivate] = useState(false);
    const [value, setValue] = useState(dateValue!== "" ? true : false);
    const [date, setDate] = useState(moment());
    const [show, setShow] = useState(false);
    const { dark, theme } = React.useContext(ThemeContext);
    console.log(dateValue)
    const onChange = (e, selectedDate) => {
        setDate(moment(selectedDate))
    }

    const onAndroidChange = (e, selectedDate) => {
        setShow(!show);
        if (selectedDate) {
            setDate(moment(selectedDate));
            if (modes === "date") {
                onDateChange(date.format('YYYY-MM-DD'));
            }
            else {
                onDateChange(date.format('HH:mm'));
            }
        }
    }

    const onCancelPressed = () => {
        setShow(!show);
    }

    const onDonePressed = () => {
        if (modes === "date") {
            onDateChange(date.format('YYYY-MM-DD'));
        }
        else {
            onDateChange(date.format('HH:mm'));
        }

        setShow(false);

    }

    const renderDatePicker = () => {
        return (
            <DateTimePicker
                textColor={theme.color}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                timeZoneOffsetInMinutes={480}
                value={new Date(date)}
                mode={modes}
                minimumDate={new Date(moment().subtract(120, 'years').format('YYYY-MM-DD'))}
                onChange={Platform.OS === 'ios' ? onChange : onAndroidChange}
            />
        )

    }
    return (
        <Pressable
            style={[styles.container, { backgroundColor: theme.backgroundCard }]}
            onPress={() => {
                setShow(!show)
                setActivate(true)
            }
            }>
            <View>

                {(activate === false && value === false)? (
                    <Text style={{ color: theme.gray }}>{placeholder}</Text>
                ) : (activate === false && value === true) ? (
                    <Text style={{ color: theme.color }}>{dateValue}</Text>
                ) : (activate === true && modes ==="date" ) ? (
                    <Text style = {{color: theme.color}}>{date.format('YYYY-MM-DD')}</Text>
                ) : (
                    <Text style = {{color: theme.color}}>{date.format('HH:mm')}</Text>
                )
                }

                {Platform.OS !== 'ios' && show && (

                    renderDatePicker()
                )}
                {Platform.OS === 'ios' && (
                    <Modal
                        transparent={true}
                        animationType='slide'
                        visible={show}
                        supportedOrientations={['portrait']}
                        onRequestClose={() => setShow(!show)}>
                        <View style={{ flex: 1 }}>
                            <Pressable
                                style={{ flex: 1, alignItems: 'flex-end', flexDirection: 'row' }}
                                visible={!show}
                                onPress={() => setShow(!show)}>
                                <Pressable
                                    style={{ flex: 1, borderTopColor: theme.backgroundCard, borderTopWidth: 1, color: theme.color }}
                                    onPress={() => console.log('datepicker clicked')}>
                                    <View
                                        style={{ height: 256, overflow: 'hidden', backgroundColor: theme.backgroundColor, color: theme.color }}>
                                        <View
                                            style={{ marginTop: 20 }}>
                                            {renderDatePicker()}
                                        </View>

                                        <Pressable
                                            style={[styles.btnText, styles.btnCancel]}
                                            onPress={onCancelPressed}
                                        >
                                            <Text
                                                style={{ color: theme.color }}>
                                                Cancel
                                            </Text>

                                        </Pressable>
                                        <Pressable
                                            style={[styles.btnText, styles.btnDone]}
                                            onPress={onDonePressed}
                                        >
                                            <Text
                                                style={{ color: theme.color }}>
                                                Done
                                            </Text>

                                        </Pressable>

                                    </View>

                                </Pressable>

                            </Pressable>
                        </View>

                    </Modal>
                ) 
                }

            </View>

        </Pressable>
    );
};


const styles = StyleSheet.create({
    container: {
        width: "100%",
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginVertical: 10,
        height: 40,
    },
    btnText: {
        position: 'absolute',
        top: 0,
        height: 42,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnCancel: {
        left: 0
    },
    btnDone: {
        right: 0
    }

})
export default CustomDateTimePicker;