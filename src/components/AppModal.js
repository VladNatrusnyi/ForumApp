import {Button, Modal, Text, View, StyleSheet, ScrollView} from "react-native";
import {COLORS} from "../mock/colors";
import {MainButton} from "./MainButton";
import React from "react";
import {KeyboardLayout} from "../layouts/KeyboardLayout";

export const AppModal = ({visible, children, onCansel, onOk, okBtnText, isOkBtnDisabled = false}) => {
    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <KeyboardLayout>
                <View style={styles.container}>
                    <View style={styles.content}>
                        {children}
                        <View style={styles.modalBtnWrapper}>
                            <Button
                                onPress={onCansel}
                                title={'Cansel'}
                                color={COLORS.disabled}
                            />
                            <MainButton
                                onPress={onOk}
                                text={okBtnText}
                                disabled={isOkBtnDisabled}
                            />
                        </View>
                    </View>
                </View>
            </KeyboardLayout>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    content: {
        backgroundColor: COLORS.secondary,
        borderWidth: 1,
        borderColor: COLORS.lightText,
        padding: 20,
        borderRadius: 20,
        width: '80%',
    },

    modalBtnWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "flex-end",
        gap: 20,
        marginTop: 20
    },
})