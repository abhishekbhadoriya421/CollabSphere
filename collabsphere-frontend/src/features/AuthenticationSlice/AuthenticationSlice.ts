import { createSlice } from "@reduxjs/toolkit";


interface AuthenticationState {
    user: object | null;
    loading: boolean | false;
    error: string | null;
    accessToken: string | null;
    refreshToken: string | null;
}

const initialState: AuthenticationState = {
    user: null,
    loading: false,
    error: null,
    accessToken: null,
    refreshToken: null,
};


const AuthenticationSlice = createSlice({
    name: "authentication",
    initialState,
    reducers: {},
    extraReducers: () => { },
});


export default AuthenticationSlice.reducer;