
import {TextInput, View, StyleSheet, TouchableOpacity} from "react-native";
import {COLORS} from "../mock/colors";

export const AppInput = (
    {
        value,
        onChange,
        placeholder,
        iconLeft = null,
        iconRight = null,
        onRightIconPress,
        secureTextEntry = false
    }) => {
    return (
        <View style={styles.container}>
            { iconLeft }
            <TextInput
                placeholderTextColor={COLORS.disabled}
                style={styles.input}
                placeholder={placeholder}
                value={value}
                autoCapitalize={'none'}
                onChangeText={(text) => onChange(text)}
                secureTextEntry={secureTextEntry}
            />
            {
                iconRight &&
                <TouchableOpacity onPress={onRightIconPress}>
                    { iconRight }
                </TouchableOpacity>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 20,
        borderColor: COLORS.border,
        borderWidth: 2,
        backgroundColor: COLORS.secondary,
        paddingHorizontal: 15,
        marginBottom: 15,
        width: '100%'
    },

    input: {
        flex: 1,
        paddingVertical: 20,
        paddingHorizontal: 10,
        fontSize: 18,
        color: COLORS.lightText
    },
});
