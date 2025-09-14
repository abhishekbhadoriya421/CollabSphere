import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/**
 * Hold Intial State
 */
interface LoginState {
    token: string | null,
    refreshTokect: string | null,
    user: object | null,
    loading: boolean,
    status: 'idle' | 'success' | 'error'
}


const initialState: LoginState = {
    token: '',
    refreshTokect: '',
    user: null,
    loading: false,
    status: 'idle'
}

/**
 * login request d
 */
interface LoginRequest {
    email: string,
    password: string
}

interface LoginResponse {
    token: string | null,
    refreshTokect: string | null,
    user: object | null,
    status: 'idle' | 'success' | 'error',
    message: string
}

interface APIResponse {
    token: string | null,
    refreshTokect: string | null,
    user: object | null,
    status: number,
    message: string
}

const createLoginSlice = createAsyncThunk<LoginResponse, LoginRequest, { rejectValue: LoginResponse }>(
    'user/login',
    async (user: LoginRequest, { rejectWithValue }) => {
        try {
            const payloadData: LoginRequest = {
                email: user.email,
                password: user.password
            }

            const apiResponse: Response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payloadData)
            });

            const apiResponsedata: APIResponse = await apiResponse.json();

            if (!apiResponse.ok) {
                const response: LoginResponse = {
                    token: '',
                    refreshTokect: '',
                    user: null,
                    message: apiResponsedata.message,
                    status: 'error',
                }
                return response;
            }

            const response: LoginResponse = {
                token: apiResponsedata.token,
                refreshTokect: apiResponsedata.refreshTokect,
                user: apiResponsedata.user,
                message: apiResponsedata.message,
                status: 'success',
            }
            return response;
        } catch (error: unknown) {
            const response: LoginResponse = {
                token: '',
                refreshTokect: '',
                user: null,
                message: (error instanceof Error ? error.message : 'An unknown error occurred'),
                status: 'error',
            }
            return rejectWithValue(response);
        }
    });



const LoginSlice = createSlice({
    name: "login",
    initialState: initialState,
    reducers: {},
    extraReducers(builder) {

    },
});



export default LoginSlice.reducer;