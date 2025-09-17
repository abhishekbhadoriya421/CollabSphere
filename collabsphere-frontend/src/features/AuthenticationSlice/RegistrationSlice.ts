import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
interface AuthenticationState {
    status: "idle" | "success" | "error";
    message: string;
    loading: boolean;
}

interface RegisterResponse {
    message: string;
    status: "idle" | "success" | "error";
}


const initialState: AuthenticationState = {
    status: "idle",
    message: '',
    loading: false
};


interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface ApiRegisterResponse {
    message: string;
    status: number;
}

/**
 * Create User Account
 */

export const RegisterThunk = createAsyncThunk<RegisterResponse, RegisterRequest, { rejectValue: RegisterResponse }>(
    'user/register',
    async (user: RegisterRequest, { rejectWithValue }) => {
        try {
            const payloadData: RegisterRequest = {
                username: user.username,
                email: user.email,
                password: user.password,
                confirmPassword: user.confirmPassword
            }

            const response: Response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payloadData)
            });
            const data: ApiRegisterResponse = await response.json();

            if (!response.ok) {
                return rejectWithValue({
                    message: data.message || "Network response was not ok",
                    status: "error",
                });
            }
            const result: RegisterResponse = {
                message: data.message,
                status: 'success',
            };
            return result;
        } catch (error: unknown) {
            const result: RegisterResponse = {
                message: (error instanceof Error ? error.message : 'An unknown error occurred'),
                status: 'error',
            };
            return result;
        }
    });


const RegistrationSlice = createSlice({
    name: "sign-up",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(RegisterThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.status = action.payload.status;
                state.message = action.payload.message
            })
            .addCase(RegisterThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(RegisterThunk.rejected, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.status = action.payload.status;
                    state.message = action.payload.message
                } else {
                    state.message = (action.error.message) ? action.error.message : 'Request Fail'
                }
            })
    },
});


export default RegistrationSlice.reducer;