import { configureStore } from "@reduxjs/toolkit";
import RegistrationReducer from "../features/AuthenticationSlice/RegistrationSlice";
import LoginReducer from '../features/AuthenticationSlice/LoginSlice';
import ActivityItemReducer from '../features/ServicesSlice/ActivityItemSlice';
import GetMyChannelReducer from '../features/ChannelSlice/GetMyChannelsSlice';
import OrganizationReducer from '../features/OrganizationSlice/OrganizationSlice';
import UserReducer from '../features/OrganizationSlice/MembershipSlice';
import SearchUserReducer from '../features/SearchUserSlice/SearchUserSlice';
import ChatBoxReducer from '../features/ChatBoxSlice/ChatBoxSlics';

export const store = configureStore({
    reducer: {
        RegistrationReducer: RegistrationReducer,
        LoginReducer: LoginReducer,
        ActivityItemReducer: ActivityItemReducer,
        GetMyChannelReducer: GetMyChannelReducer,
        OrganizationReducer: OrganizationReducer,
        UserReducer: UserReducer,
        SearchUserReducer: SearchUserReducer,
        ChatBoxReducer: ChatBoxReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;