import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


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


export const LoginThunk = createAsyncThunk(
    'user/login',
    async (user: { email: string, password: string }): Promise<void> => {
        interface LoginRequest {
            email: string;
            password: string;
        }

        const payloadData: LoginRequest = {
            email: user.email,
            password: user.password
        }
        interface LoginResponse {
            user: object;
            accessToken: string;
            refreshToken: string;
        }

        const response: Response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payloadData),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data: LoginResponse = await response.json();
        console.log("Login Response Data:", data);
    }
)


const AuthenticationSlice = createSlice({
    name: "authentication",
    initialState,
    reducers: {},
    extraReducers: () => { },
});


export default AuthenticationSlice.reducer;