import { configureStore } from "@reduxjs/toolkit";
import RegistrationReducer from "../features/AuthenticationSlice/RegistrationSlice";


export const store = configureStore({
    reducer: {
        RegistrationReducer: RegistrationReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;