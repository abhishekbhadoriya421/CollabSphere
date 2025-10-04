import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface UserList {
    user_id: number;
    username: string;
    email: string;
}
interface InitialState {
    userList: (UserList | null)[];
    status: 'idle' | 'loading' | 'success' | 'error';
    message: string | ''
}

const initialState: InitialState = {
    userList: [],
    status: 'idle',
    message: ''
}
interface GetUserRequest {
    accessToken: string | null,
    searchKey: string | ''
    ou_id: number | null
}

interface GetUserResponse {
    userList: (UserList | null)[];
    status: 'success' | 'error';
    message: string | ''
}

interface GetUserAPIResponse {
    userList: (UserList | null)[];
    status: number | null;
    message: string | ''
}
export const SearchUserThunk = createAsyncThunk<GetUserResponse, GetUserRequest, { rejectValue: GetUserResponse }>
    (
        'get-user-list',
        async (req: GetUserRequest, { rejectWithValue }) => {
            try {
                const apiResponse: Response = await fetch(`/api/user/search-user?search=${req.searchKey}&ou_id=${req.ou_id}`, {
                    method: 'get',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${req.accessToken}`,
                    },
                    credentials: 'include'
                });

                const responseData: GetUserAPIResponse = await apiResponse.json();

                if (apiResponse.ok) {
                    return {
                        status: 'success',
                        userList: responseData.userList,
                        message: responseData.message
                    }
                } else {
                    return rejectWithValue({
                        status: 'error',
                        userList: [],
                        message: responseData.message
                    })
                }
            } catch (err: unknown) {
                console.log(err);
                return rejectWithValue({
                    status: 'error',
                    userList: [],
                    message: 'Unexpected Error Occured'
                })
            }
        }
    )




const SearchUserSlice = createSlice({
    name: 'search-user',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(SearchUserThunk.fulfilled, (state, action) => {
            if (action.payload.status === 'success') {
                state.userList = action.payload.userList;
                state.message = action.payload.message;
                state.status = 'success';
            } else {
                state.userList = [];
                state.message = action.payload.message;
                state.status = 'error';
            }
        })
            .addCase(SearchUserThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(SearchUserThunk.rejected, (state, action) => {
                state.status = 'error';
                state.message = action.payload?.message || 'Unexpected Error';
                state.userList = []
            })
    }
})


export default SearchUserSlice.reducer;