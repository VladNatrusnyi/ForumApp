import {View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator} from "react-native";
import {PageLayout} from "../layouts/PageLayout";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getDatabase, query, ref, onValue} from "firebase/database";
import {setQuestions, setUsers} from "../store/QuestionsSlice";
import {COLORS} from "../mock/colors";
import {QuestionListItem} from "../components/QuestionListItem";
import {AppInput} from "../components/AppInput";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export const HomePage = () => {
    const dispatch = useDispatch()

    const { currentUser } = useSelector(state => state.auth)
    const { questions } = useSelector(state => state.questions)

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const followChangesQuestionsOnDB = () => {
        setIsLoading(true)
        const db = getDatabase();
        const questionsRef = ref(db, 'questions');
        onValue(questionsRef, (snapshot) => {

            const data = snapshot.val();
            if (data) {
                const questionsArray = Object.keys(data).map((key) => data[key]);
                const res = questionsArray.map(el => {
                    if (el.answers) {
                        return {
                            ...el,
                            answers: Object.keys(el.answers).map((key) => el.answers[key]).reverse()
                        }
                    } else {
                        return el
                    }
                })
                dispatch(setQuestions(res.reverse()))
                setIsLoading(false)
            } else {
                dispatch(setQuestions(null))
                setIsLoading(false)
            }
        });
    };

    const followChangesUsersOnDB = () => {
        setIsLoading(true)
        const db = getDatabase();

        const usersRef = query(ref(db, 'users'));

        onValue(usersRef, (snapshot) => {

            const data = snapshot.val();

            if (data) {
                const usersArray = Object.keys(data).map((key) => data[key]);
                dispatch(setUsers(usersArray))
                setIsLoading(false)
            } else {
                dispatch(setUsers(null))
                setIsLoading(false)
            }
        });
    };

    useEffect(() => {
            followChangesQuestionsOnDB();
            followChangesUsersOnDB()
    }, [currentUser]);


    const reloadQuestions = () => {
        if (currentUser) {
            followChangesQuestionsOnDB();
            followChangesUsersOnDB()
        }
    }

    const [searchText, setSearchText] = useState('');

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
        await reloadQuestions()
        setRefreshing(false);
    }, []);

    const [search, setSearch] = useState('')


    const filteredQuestions = useMemo(() => {
        if (questions) {
            if (search.trim()) {
                return questions.filter(el => el.questionText.toLowerCase().includes(search.toLowerCase()))
            } else {
                return questions
            }
        }

    }, [search, questions])


    return (
        <PageLayout>
            <View style={styles.wrapper}>

                <AppInput
                    value={search}
                    placeholder={"Search"}
                    onChange={(text) => setSearch(text)}
                    iconLeft={<FontAwesome name="search" size={24} color={COLORS.lightText} />}
                />

                {
                    error &&
                    <Text style={styles.errorText}>
                        {error}
                    </Text>
                }

                <FlatList
                    data={filteredQuestions}
                    renderItem={(item) => <QuestionListItem questionData={item.item}/> }
                    keyExtractor={(item) => item.id.toString()}
                    refreshControl={
                        <RefreshControl
                            tintColor={COLORS.lightText}
                            refreshing={isLoading}
                            onRefresh={onRefresh}
                        />
                    }
                    ListEmptyComponent={<Text style={styles.notExistElements}>No discussions found.</Text>}
                />
            </View>
        </PageLayout>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        padding: 20,
        marginBottom: 110
    },

    notExistElements: {
        textAlign: "center",
        color: COLORS.lightText
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
