import {TouchableOpacity, Text, StyleSheet} from "react-native";
import {COLORS} from "../mock/colors";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export const SecondaryButton = ({onPress}) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.wrapper}>
            <MaterialIcons name="post-add" size={24} color={COLORS.lightText} />
            <Text style={styles.text}>Answer</Text>
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
