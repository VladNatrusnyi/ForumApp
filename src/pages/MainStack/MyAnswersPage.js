import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    View
} from "react-native";
import React, {useMemo, useState} from "react";
import {PageLayout} from "../../layouts/PageLayout";
import {useNavigation} from "@react-navigation/native";
import {useSelector} from "react-redux";
import {GoBackBtn} from "../../components/GoBackBtn";
import {QuestionListItem} from "../../components/QuestionListItem";
import {COLORS} from "../../mock/colors";
import {getDatabase, ref, remove} from "firebase/database";

export const MyAnswersPage = () => {
    const navigation = useNavigation()

    const {currentUser} = useSelector(state => state.auth)
    const { questions } = useSelector(state => state.questions)

    const myAnswers = useMemo(() => {
        if (questions) {
            return questions.map(item => {
                if (item.answers) {
                    if (item.answers.some(el => el.creatorId === currentUser.uid)) {
                        return item
                    }
                }
            }).filter(el => !!el)
        }
    }, [currentUser, questions])

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const deleteQuestion = (id) => {
        Alert.alert('Delete confirmation', 'Are you sure you want to delete your question?', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {text: 'OK', onPress: async () => {
                    setIsLoading(true);
                    try {
                        const db = getDatabase();
                        const questionRef = ref(db, `questions/${id}`);
                        await remove(questionRef);
                        setIsLoading(false);
                    } catch (error) {
                        setError(error.message);
                        setIsLoading(false);
                    }
                }},
        ]);
    }

    return (
        <PageLayout>
            {
                currentUser
                    ? <View style={styles.wrapper}>
                        <GoBackBtn onPress={() => navigation.goBack()} />
                        <Text style={styles.answersTitle}>My answers</Text>

                        <View style={styles.divider}></View>

                        <Text style={styles.notExistElements2}>The questions you answered are displayed here.</Text>

                        <FlatList
                            style={{width: '100%'}}
                            data={myAnswers}
                            renderItem={(item) => {
                                return (
                                    <View style={styles.itemContainer}>
                                        <QuestionListItem questionData={item.item}/>
                                    </View>
                                )
                            }}
                            keyExtractor={(item) => item.id.toString()}
                            ListEmptyComponent={<Text style={styles.notExistElements}>You haven't answered the question yet.</Text>}
                        />
                    </View>
                    : null
            }
        </PageLayout>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        padding: 20,
        marginBottom: 100,
        alignItems: 'center',
    },
    notExistElements: {
        textAlign: "center",
        color: COLORS.lightText
    },
    notExistElements2: {
        textAlign: "center",
        color: COLORS.lightText,
        marginBottom: 10
    },
    answersTitle: {
        marginVertical: 10,
        fontSize: 20,
        color: COLORS.lightText,
    },
    divider: {
        width: '100%',
        borderBottomWidth: 1,
        borderColor: COLORS.lightText,
        marginBottom: 15
    },

    itemContainer: {
        position: "relative"
    },
    icon: {
        position: 'absolute',
        top: 15,
        right: 15,
        zIndex: 10
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
})
