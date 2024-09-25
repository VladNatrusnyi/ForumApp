import {StyleSheet, TextInput, TouchableOpacity, View} from "react-native";
import {COLORS} from "../mock/colors";
import React from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export const AppTextArea = ({placeholder, value, onChange, onClear, maxHeight = 400}) => {
    return (
        <View style={{...styles.textAreaContainer, maxHeight: maxHeight}} >
            {
                value &&
                <TouchableOpacity onPress={onClear} style={styles.clearBtn}>
                    <MaterialIcons name="clear" size={24} color={COLORS.lightText} />
                </TouchableOpacity>
            }
            <TextInput
                style={styles.textArea}
                underlineColorAndroid="transparent"
                placeholder={placeholder}
                placeholderTextColor="grey"
                numberOfLines={10}
                multiline={true}
                value={value}
                onChangeText={(text) => onChange(text)}
            />
        </View>
    )
}

const styles = StyleSheet.create({

    textAreaContainer: {
        position: "relative",
        borderRadius: 20,
        borderColor: COLORS.border,
        borderWidth: 2,
        backgroundColor: COLORS.secondary,
        padding: 20,
        marginBottom: 15,
        width: '100%',
    },
    textArea: {
        justifyContent: "flex-start",
        fontSize: 18,
        color: COLORS.lightText
    },
    clearBtn: {
        position: "absolute",
        top: -10,
        right: -10,
        alignItems: "center",
        justifyContent: 'center',
        width: 50,
        height: 50,
        borderRadius: 100,
        backgroundColor: COLORS.secondary,
        borderWidth: 2,
        borderColor: COLORS.lightText
    },
})
