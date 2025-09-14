import { configureStore } from "@reduxjs/toolkit";
import RegistrationReducer from "../features/AuthenticationSlice/RegistrationSlice";
import LoginReducer from '../features/AuthenticationSlice/LoginSlice';


export const store = configureStore({
    reducer: {
        RegistrationReducer: RegistrationReducer,
        LoginReducer: LoginReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;