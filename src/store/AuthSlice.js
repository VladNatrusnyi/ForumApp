import {createSlice} from "@reduxjs/toolkit";


export const emptyInitialStateForAuthSlice = {
    currentUser: null,
}

const initialState = emptyInitialStateForAuthSlice

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {

        setCurrentUser(state, action) {
            state.currentUser = action.payload
        },
    },
})


export const {
    setCurrentUser,
} = authSlice.actions

export default authSlice.reducer