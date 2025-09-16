import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/**
 * Hold Intial State
 */
interface UserObject {
    email: string,
    id: number,
    username: string
}
interface LoginState {
    accessToken: string | null,
    user: UserObject | null,
    loading: boolean,
    status: 'idle' | 'success' | 'error',
    message: string
}


const initialState: LoginState = {
    accessToken: '',
    user: null,
    loading: false,
    status: 'idle',
    message: ''
}

/**
 * login request data email and password
 */
interface LoginRequest {
    email: string,
    password: string
}

/**
 * response data which will be returned from login function
 */
interface LoginResponse {
    accessToken: string | null,
    user: UserObject | null,
    status: 'idle' | 'success' | 'error',
    message: string
}

/* 
response data which will be recieved from the server api
accessToken => will be saved in local variable and will be used for access the authrized service it must be pass with each request
refreshToken => will be used to get the new access accessToken if current access accessToken is expired or use need to logout 
user => basic user detail like name , email , id etc will be stored in locally
status => api response status code
message => message return by the response (error or success) 
*/
interface APIResponse {
    token: string | null,
    user: UserObject | null,
    status: number,
    message: string
}

/**
 * handle the bussiness logic of login and safely save the accessToken and refreshTokect
 */
export const LoginThunk = createAsyncThunk<LoginResponse, LoginRequest, { rejectValue: LoginResponse }>(
    'user/login',
    async (user: LoginRequest, { rejectWithValue }) => {
        try {
            const payloadData: LoginRequest = {
                email: user.email,
                password: user.password
            }

            const apiResponse: Response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payloadData)
            });

            const apiResponsedata: APIResponse = await apiResponse.json();
            /**
             * If status code is 400 
             */
            if (!apiResponse.ok) {
                const response: LoginResponse = {
                    accessToken: '',
                    user: null,
                    message: apiResponsedata.message,
                    status: 'error',
                }
                return response;
            }

            const response: LoginResponse = {
                accessToken: apiResponsedata.token,
                user: apiResponsedata.user,
                message: apiResponsedata.message,
                status: 'success',
            }
            return response;
        } catch (error: unknown) {
            const response: LoginResponse = {
                accessToken: '',
                user: null,
                message: (error instanceof Error ? error.message : 'An unknown error occurred'),
                status: 'error',
            }
            return rejectWithValue(response);
        }
    });

/**
 * every time user reload the page fetch the new access token 
 * but why for sceurity reason we cannot store access token in
 * local store so we store in variable: access toke but each time
 * we reload the page the value of access token will become null as default value 
 * now we need to track if user is logged in or not
 * 
 * Function takes no argument only need response data 
 */
export const RefreshPageThunk = createAsyncThunk<LoginResponse, void, { rejectValue: LoginResponse }>(
    'user/reload',
    async (_, { rejectWithValue }) => {
        try {
            const apiResponse: Response = await fetch('/api/auth/refresh', {
                method: 'POST',
                credentials: "include"
            });

            const apiResponsedata: APIResponse = await apiResponse.json();
            /**
             * If status code is 400 
             */
            if (!apiResponse.ok) {
                const response: LoginResponse = {
                    accessToken: '',
                    user: null,
                    message: apiResponsedata.message,
                    status: 'error',
                }
                return response;
            }

            const response: LoginResponse = {
                accessToken: apiResponsedata.token,
                user: apiResponsedata.user,
                message: apiResponsedata.message,
                status: 'success',
            }
            return response;
        } catch (error: unknown) {
            return rejectWithValue(
                {
                    accessToken: '',
                    user: null,
                    message: (error instanceof Error ? error.message : 'An unknown error occurred'),
                    status: 'error',
                }
            );
        }

    }
)

const LoginSlice = createSlice({
    name: "login",
    initialState: initialState,
    reducers: {},
    /**
     * handle Respose Ok, Error And Pending 
     */
    extraReducers(builder) {
        builder.addCase(LoginThunk.fulfilled, (state, action) => {
            if (action.payload.status === 'success') {
                state.loading = false;
                state.accessToken = action.payload.accessToken;
                state.status = action.payload.status;
                state.user = action.payload.user;
                state.message = action.payload.message;
            } else {
                state.loading = false
                state.accessToken = '';
                state.status = action.payload.status;
                state.user = null;
                state.message = action.payload.message;
            }
        })
            .addCase(LoginThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(LoginThunk.rejected, (state, action) => {
                state.loading = false;
                state.status = 'error';
                state.accessToken = '';
                state.user = null;
                if (action.payload) {
                    state.message = action.payload.message
                } else {
                    state.message = (action.error.message) ? action.error.message : 'Request Fail'
                }
            })
            .addCase(RefreshPageThunk.fulfilled, (state, action) => {
                if (action.payload.status === 'success') {
                    state.loading = false;
                    state.accessToken = action.payload.accessToken;
                    state.status = action.payload.status;
                    state.user = action.payload.user;
                    state.message = action.payload.message;
                } else {
                    state.loading = false
                    state.accessToken = '';
                    state.status = action.payload.status;
                    state.user = null;
                    state.message = action.payload.message;
                }
            })
            .addCase(RefreshPageThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(RefreshPageThunk.rejected, (state, action) => {
                state.loading = false;
                state.status = 'error';
                state.accessToken = '';
                state.user = null;
                if (action.payload) {
                    state.message = action.payload.message
                } else {
                    state.message = (action.error.message) ? action.error.message : 'Request Fail'
                }
            })
    },
});



export default LoginSlice.reducer;