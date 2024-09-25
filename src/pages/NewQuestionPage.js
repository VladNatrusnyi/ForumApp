import {PageLayout} from "../layouts/PageLayout";
import {ActivityIndicator, Button, StyleSheet, Text, View} from "react-native";
import {COLORS} from "../mock/colors";
import {useNavigation} from "@react-navigation/native";
import {useDispatch, useSelector} from "react-redux";
import {AppTextArea} from "../components/AppTextArea";
import React, {useMemo, useState} from "react";
import {MainButton} from "../components/MainButton";
import {KeyboardLayout} from "../layouts/KeyboardLayout";
import { getDatabase, ref, set, push } from "firebase/database";

export const NewQuestionPage = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()

    const {currentUser} = useSelector(state => state.auth)

    const [question, setQuestion] = useState('')

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const isDone = useMemo(() => {
        return question.trim()
    }, [question])

    const createNewQuestion = async () => {
        setIsLoading(true)
        const db = getDatabase();
        const questionRef = ref(db, 'questions');

        const newQuestionIdRef = await push(questionRef);

        set(newQuestionIdRef, {
            id: newQuestionIdRef.key,
            creatorId: currentUser.uid,
            questionText: question,
            date: Date.now(),
        })
            .then(() => {
                navigation.navigate('Forum')
                setIsLoading(false)
                setError('')
                setQuestion('')
            })
            .catch((error) => {
                setIsLoading(false)
                setError(error.message)
            });
    }

    return (
        <KeyboardLayout>
            <PageLayout>
                {
                    currentUser
                        ? <View style={styles.wrapper}>
                            <Text style={styles.title}>Ask your question</Text>
                            <AppTextArea
                                placeholder={'Write your question'}
                                value={question}
                                onChange={(text) => setQuestion(text)}
                                onClear={() => setQuestion('')}
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

                            <MainButton
                                style={{width: '100%'}}
                                onPress={createNewQuestion}
                                text={'Create question'}
                                disabled={!isDone}
                            />
                        </View>
                        : <View style={styles.notLoginWrapper}>
                            <Text style={styles.notLoginText}>You need to be registered to create your own questions.</Text>
                            <Button
                                onPress={() => navigation.navigate('User')}
                                title={'Go to login'}
                                color={COLORS.disabled}
                            />
                        </View>
                }
            </PageLayout>
        </KeyboardLayout>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        padding: 20,
        marginBottom: 100,
        alignItems: 'center',
    },

    title: {
        color: COLORS.lightText,
        fontSize: 22,
        marginBottom: 15
    },

    notLoginWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center"
    },
    notLoginText: {
        color: COLORS.lightText,
        textAlign: 'center',
        marginBottom: 20
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
