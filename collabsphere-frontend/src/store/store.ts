import { configureStore } from "@reduxjs/toolkit";
import RegistrationReducer from "../features/AuthenticationSlice/RegistrationSlice";
import LoginReducer from '../features/AuthenticationSlice/LoginSlice';
import ActivityItemReducer from '../features/ServicesSlice/ActivityItemSlice';
import GetMyChannelReducer from '../features/ChannelSlice/GetMyChannels';
import OrganizationReducer from '../features/OrganizationSlice/OrganizationSlice';

export const store = configureStore({
    reducer: {
        RegistrationReducer: RegistrationReducer,
        LoginReducer: LoginReducer,
        ActivityItemReducer: ActivityItemReducer,
        GetMyChannelReducer: GetMyChannelReducer,
        OrganizationReducer: OrganizationReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;