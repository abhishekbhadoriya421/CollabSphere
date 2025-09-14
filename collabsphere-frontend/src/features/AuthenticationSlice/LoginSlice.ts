import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/**
 * Hold Intial State
 */
interface LoginState {
    accessToken: string | null,
    refreshToken: string | null,
    user: object | null,
    loading: boolean,
    status: 'idle' | 'success' | 'error',
    message: string
}


const initialState: LoginState = {
    accessToken: '',
    refreshToken: '',
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
    refreshToken: string | null,
    user: object | null,
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
    accessToken: string | null,
    refreshToken: string | null,
    user: object | null,
    status: number,
    message: string
}

/**
 * handle the bussiness logic of login and safely save the accessToken and refreshTokect
 */
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
            console.log(apiResponse);
            /**
             * If status code is 400 
             */
            if (!apiResponse.ok) {
                const response: LoginResponse = {
                    accessToken: '',
                    refreshToken: '',
                    user: null,
                    message: apiResponsedata.message,
                    status: 'error',
                }
                return response;
            }

            const response: LoginResponse = {
                accessToken: apiResponsedata.accessToken,
                refreshToken: apiResponsedata.refreshToken,
                user: apiResponsedata.user,
                message: apiResponsedata.message,
                status: 'success',
            }
            return response;
        } catch (error: unknown) {
            const response: LoginResponse = {
                accessToken: '',
                refreshToken: '',
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
        builder.addCase(createLoginSlice.fulfilled, (state, action) => {
            if (action.payload.status === 'success') {
                state.loading = false;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
                state.status = action.payload.status;
                state.user = action.payload.user;
                state.message = action.payload.message;
            } else {
                state.loading = false
                state.accessToken = '';
                state.refreshToken = '';
                state.status = action.payload.status;
                state.user = null;
                state.message = action.payload.message;
            }
        })
            .addCase(createLoginSlice.pending, (state) => {
                state.loading = true;
            })
            .addCase(createLoginSlice.rejected, (state, action) => {
                state.loading = false;
                state.status = 'error';
                state.accessToken = '';
                state.refreshToken = '';
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