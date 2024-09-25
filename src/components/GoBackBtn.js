import {TouchableOpacity, Text, StyleSheet} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {COLORS} from "../mock/colors";

export const GoBackBtn = ({onPress}) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.wrapper}>
            <Ionicons name="arrow-back-outline" size={24} color={COLORS.lightText} />
            <Text style={styles.text}>go back</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: COLORS.primary,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: COLORS.border,
        marginBottom: 15
    },
    text: {
        color: COLORS.lightText,
        fontSize: 16
    }
})