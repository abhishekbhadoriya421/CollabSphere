import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

interface AuthenticationState {
    user: object | null;
    loading: boolean | false;
}

// interface Token {
//     accessToken: string | null;
//     refreshToken: string | null;
// }

interface RegisterResponse {
    message: string;
    status: boolean;
}


const initialState: AuthenticationState = {
    user: null,
    loading: false
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
            console.log(response);
            throw new Error('Network response was not ok');
        }
        const data: LoginResponse = await response.json();
        console.log("Login Response Data:", data);
    }
)

/**
 * Create User Account
 */
export const RegisterThunk = createAsyncThunk(
    'user/register',
    async (user: { username: string, email: string, password: string, confirmPassword: string }): Promise<object | undefined> => {
        try {
            interface RegisterRequest {
                username: string;
                email: string;
                password: string;
                confirmPassword: string;
            }

            const payloadData: RegisterRequest = {
                username: user.username,
                email: user.email,
                password: user.password,
                confirmPassword: user.confirmPassword
            }

            const response: Response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payloadData)
            });

            if (!response.ok) {
                const data: object = await response.json();
                console.log(data);
                throw new Error((data && (data as { message?: string }).message) || 'Network response was not ok');
            }
            const data: object = await response.json();
            console.log(data);
            const result: RegisterResponse = {
                message: 'Successfully Created Account',
                status: true,
            };
            return result;
        } catch (error: unknown) {
            const result: RegisterResponse = {
                message: (error instanceof Error ? error.message : 'An unknown error occurred'),
                status: false,
            };
            return result;
        }
    });


interface RegisterThunkPayload {
    message: string;
    status: boolean;
    data: object;
}

/**
 * If Promiss is fullfilled
 */
const RegisterThunkFulfilled = (state: AuthenticationState, action: { payload: object | undefined }): void => {
    const payload = action.payload as RegisterThunkPayload | undefined;
    state.loading = false;
    if (payload?.status === true) {
        toast.success(payload.message);
    } else {
        toast.error(payload?.message);
    }
}

const RegisterThunkPending = (state: AuthenticationState): void => {
    state.loading = true;
    state.user = null;
}

const RegisterThunkRejected = (state: AuthenticationState, action: ReturnType<typeof RegisterThunk.rejected>): void => {
    state.loading = false;
    state.user = null;
    toast.error(action.error.message || "Registration failed");
}


const AuthenticationSlice = createSlice({
    name: "authentication",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(RegisterThunk.fulfilled, RegisterThunkFulfilled)
            .addCase(RegisterThunk.pending, RegisterThunkPending)
            .addCase(RegisterThunk.rejected, RegisterThunkRejected)
    },
});


export default AuthenticationSlice.reducer;