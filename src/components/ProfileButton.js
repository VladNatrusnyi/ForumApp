import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {COLORS} from "../mock/colors";
import AntDesign from "react-native-vector-icons/AntDesign";

export const ProfileButton = ({icon, text, onPress}) => {
    return (
        <TouchableOpacity style={styles.itemWrapper} onPress={onPress} >
            <View style={styles.iconWrapper}>
                { icon }
            </View>
            <Text style={styles.itemText}>{text}</Text>
            <AntDesign name="arrowright" size={30} color={COLORS.lightText} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    itemWrapper: {
        width: '100%',
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: 10
    },

    iconWrapper: {
        width: 40
    },

    itemText: {
        fontSize: 20,
        color: COLORS.lightText
    },
})