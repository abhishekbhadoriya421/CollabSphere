import { configureStore } from "@reduxjs/toolkit";
import AuthenticationReducer from "../features/AuthenticationSlice/AuthenticationSlice";


export const store = configureStore({
    reducer: {
        AuthenticationReducer: AuthenticationReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;