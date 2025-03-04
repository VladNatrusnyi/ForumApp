import {combineReducers, configureStore} from '@reduxjs/toolkit'
import authReducer from '../store/AuthSlice'
import questionsReducer from '../store/QuestionsSlice'
import {setupListeners} from "@reduxjs/toolkit/query";

export const USER_LOGOUT = '@@logout/USER_LOGOUT'

const combinedReducer = combineReducers({
    auth: authReducer,
    questions: questionsReducer
});

const rootReducer = (state, action) => {
    if (action.type === USER_LOGOUT) {
        state = undefined;
    }
    return combinedReducer(state, action);
};

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            immutableCheck: false,
            serializableCheck: false,
        })
})

setupListeners(store.dispatch)