import {ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React, {useMemo, useState} from "react";
import {COLORS} from "../mock/colors";
import {useSelector} from "react-redux";
import {convertDate} from "../func/convertDate";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {getDatabase, ref, remove} from "firebase/database";

export const AnswerItem = ({answerData, questionId}) => {

    const { users } = useSelector(state => state.questions)
    const { currentUser } = useSelector(state => state.auth)

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const userData = useMemo(() => {
        if (users) {
            return users.find(user => user.uid === answerData.creatorId)
        }
    }, [answerData, users])


    const deleteAnswer = () => {
        Alert.alert('Delete confirmation', 'Are you sure you want to delete your answer?', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {text: 'OK', onPress: async () => {
                    setIsLoading(true);
                    try {
                        const db = getDatabase();
                        const answerRef = ref(db, `questions/${questionId}/answers/${answerData.id}`);
                        await remove(answerRef);
                        setIsLoading(false);
                    } catch (error) {
                        setError(error.message);
                        setIsLoading(false);
                    }
                }},
        ]);
    }

    return (
        <View style={styles.wrapper}>
            {
                currentUser && userData.uid === currentUser.uid
                    ? <TouchableOpacity onPress={deleteAnswer} style={styles.deleteWrapper}>
                        <MaterialIcons name="delete" size={28} color={COLORS.lightText} />
                    </TouchableOpacity>
                    : null
            }

            {isLoading &&
                <ActivityIndicator style={styles.preloader} size="small" color={COLORS.lightText} />
            }

            {
                error &&
                <Text style={styles.errorText}>
                    {error}
                </Text>
            }


            {
                userData &&
                <View style={styles.userBlock}>
                    <Image
                        style={styles.userImage}
                        source={ userData.photoURL
                            ?{ uri: userData.photoURL }
                            : require('../../assets/userImg.png')
                        }
                        resizeMode='cover'
                    />
                    <Text style={styles.userName}>{userData.displayName}</Text>
                </View>
            }
            <View style={styles.contentBlock}>
                <Text style={styles.contentText}>
                    {answerData.answerText}
                </Text>
            </View>

            <View style={styles.dateBlock}>
                <Text style={styles.dateText}>
                    {convertDate(answerData.date)}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'relative',
        backgroundColor: COLORS.secondary,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.lightText,
        padding: 20,
        marginBottom: 15
    },
    deleteWrapper: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10,
        padding: 5
    },
    preloader: {
        textAlign: 'center',
        marginBottom: 15
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        marginBottom: 15
    },

    userBlock: {
        flex: 2,
        flexDirection: 'row',
        alignItems: "center",
        gap: 15,
        marginBottom: 15
    },
    userName: {
        fontSize: 20,
        color: COLORS.lightText
    },
    userImage: {
        width: 35,
        height: 35,
        borderRadius: 100,
        borderColor: COLORS.lightText,
        borderWidth: 1
    },


    contentBlock: {
        marginBottom: 10
    },
    contentText: {
        color: COLORS.lightText,
        fontSize: 16
    },


    dateBlock: {},
    dateText: {
        color: COLORS.disabled,
        fontSize: 14
    }

})
