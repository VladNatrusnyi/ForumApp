import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";
import {useSelector} from "react-redux";
import React, {useMemo, useState} from "react";
import {PageLayout} from "../layouts/PageLayout";
import {GoBackBtn} from "../components/GoBackBtn";
import {useNavigation} from "@react-navigation/native";
import {COLORS} from "../mock/colors";
import {SecondaryButton} from "../components/SecondaryButton";
import {AppModal} from "../components/AppModal";
import {AppTextArea} from "../components/AppTextArea";
import {getDatabase, push, ref, set} from "firebase/database";
import {AnswerItem} from "../components/AnswerItem";

export const DiscussionPage = ({route}) => {
    const navigation = useNavigation()
    const { postId } = route.params;

    const { users, questions } = useSelector(state => state.questions)
    const {currentUser} = useSelector(state => state.auth)

    const {userData, questionData} = useMemo(() => {
        if (users && questions) {
            const question = questions.find(el => el.id === postId)
            const user = users.find(user => user.uid === question.creatorId)
            return {userData: user, questionData: question}
        } else {
            return {userData: null, questionData: null}
        }
    }, [postId, users, questions])

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const [answerText, setAnswerText] = useState('')


    const [showModal, setShowModal] = useState(false);

    const isDone = useMemo(() => {
        return answerText.trim()
    }, [answerText])

    const createNewAnswerToQuestion = async () => {
        setIsLoading(true)
        const db = getDatabase();
        const answersRef = ref(db, `questions/${questionData.id}/answers`);

        const newAnswerIdRef = await push(answersRef);

        set(newAnswerIdRef, {
            id: newAnswerIdRef.key,
            creatorId: currentUser.uid,
            answerText: answerText,
            date: Date.now(),
        })
            .then(() => {
                setIsLoading(false)
                setError('')
                setAnswerText('')
                setShowModal(false)
            })
            .catch((error) => {
                setIsLoading(false)
                setError(error.message)
            });
    }


    return (
        <PageLayout>

            <AppModal
                visible={showModal}
                onCansel={() => setShowModal(false)}
                onOk={createNewAnswerToQuestion}
                okBtnText={'Send answer'}
                isOkBtnDisabled={!isDone}
            >
                <Text style={styles.title}>Your answer</Text>
                <AppTextArea
                    maxHeight={160}
                    placeholder={'Write your answer'}
                    value={answerText}
                    onChange={(text) => setAnswerText(text)}
                    onClear={() => setAnswerText('')}
                />

                {isLoading &&
                    <ActivityIndicator style={styles.preloader} size="small" color={COLORS.lightText} />
                }

                {
                    error &&
                    <Text style={styles.errorText}>
                        {error}
                    </Text>
                }
            </AppModal>


            <View style={styles.wrapper}>
                <View style={styles.controlBlock}>
                    <GoBackBtn onPress={() => navigation.goBack()} />
                    {
                        currentUser && userData && (currentUser.uid !== userData.uid)
                        ? <SecondaryButton onPress={() => setShowModal(true)} />
                            : null
                    }
                </View>

                <ScrollView>
                    <View style={styles.questionBlock}>
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
                        <Text style={styles.questionText}>{questionData.questionText}</Text>
                    </View>

                    <View style={styles.answersBlock}>

                        <Text style={styles.answersTitle}>Answers</Text>
                        <View style={styles.divider}></View>

                        {
                            questionData.answers
                                ? questionData.answers.map(el => {
                                    return (
                                        <AnswerItem key={el.id} answerData={el} questionId={questionData.id} />
                                    )
                                })
                                : <View>
                                <Text style={{color: COLORS.lightText}}>There are no answers to this question yet.</Text>
                                </View>

                        }
                    </View>

                </ScrollView>
            </View>
        </PageLayout>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        padding: 20,
        marginBottom: 100
    },

    userBlock: {
        flex: 2,
        flexDirection: 'row',
        alignItems: "center",
        gap: 15,
        marginBottom: 15
    },
    userName: {
        fontSize: 24,
        color: COLORS.lightText
    },
    userImage: {
        width: 40,
        height: 40,
        borderRadius: 100,
        borderColor: COLORS.lightText,
        borderWidth: 1
    },

    controlBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },


    questionBlock: {
        width: '100%',
        backgroundColor: COLORS.secondary,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        padding: 30
    },
    questionText: {
        color: COLORS.lightText,
        fontSize: 16
    },

    answersBlock: {},
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

    title: {
        color: COLORS.lightText,
        fontSize: 22,
        marginBottom: 15
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
