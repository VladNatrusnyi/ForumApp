import {StyleSheet, Text, TouchableOpacity} from "react-native";
import {COLORS} from "../mock/colors";

export const MainButton = ({onPress, text, disabled = false, style}) => {
    return (
        <TouchableOpacity
            disabled={disabled}
            style={{...styles.buttonWrapper, backgroundColor: disabled ? COLORS.disabled : COLORS.primary, ...style}}
            onPress={onPress}
        >
            <Text style={styles.buttonText}>{text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    buttonWrapper: {
        paddingHorizontal: 20,
        height: 58,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontWeight: 'bold',
        color: '#fff',
        fontSize: 18
    }
})