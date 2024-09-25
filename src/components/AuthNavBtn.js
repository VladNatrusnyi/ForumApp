import {StyleSheet, Text, TouchableOpacity} from "react-native";
import {COLORS} from "../mock/colors";
import {useNavigation} from "@react-navigation/native";

export const AuthNavBtn = ({to, text}) => {
    const navigation = useNavigation()
    return (
        <TouchableOpacity onPress={() => navigation.navigate(to)}>
            <Text style={styles.registerLink}>{text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    registerLink: {
        marginTop: 20,
        color: COLORS.disabled,
        fontSize: 16,
    },
});