
import {createSlice} from "@reduxjs/toolkit";


export const emptyInitialStateForQuestionsSlice = {
    questions: null,
    users: null
}

const initialState = emptyInitialStateForQuestionsSlice

export const questionsSlice = createSlice({
    name: 'questions',
    initialState,
    reducers: {

        setQuestions (state, action) {
            state.questions = action.payload
        },

        setUsers (state, action) {
            state.users = action.payload
        },
    },
})


export const {
    setQuestions,
    setUsers
} = questionsSlice.actions

export default questionsSlice.reducer
