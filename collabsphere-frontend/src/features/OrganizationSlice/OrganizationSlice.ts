import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


interface OrganizationObject {
    name: string | '';
    code: string | '';
    id: number | null;
    description: string | '';
    created_by: number | '';
}

interface InitailState {
    userOrganization: OrganizationObject[];
    message: string | '';
    status: 'idle' | 'error' | 'success';
    loading: boolean;
}

const initailState: InitailState = {
    userOrganization: [],
    message: '',
    status: 'idle',
    loading: false
}

interface RequestCreateOu {
    code: string;
    name: string;
    description: string;
    user_id: number;
    accessToken: string;
}

interface ResponseCreateOu {
    status: 'idle' | 'error' | 'success'
    message: string;
    id: number | null
    form: RequestCreateOu | null
}

interface CreateOuResponseApi {
    status: number;
    message: string;
    id: number | null;
}
/**
 * 
 */
export const OrganizationCreateThunk = createAsyncThunk<ResponseCreateOu, RequestCreateOu, { rejectValue: ResponseCreateOu }>(
    'organization-get',
    async (form: RequestCreateOu, { rejectWithValue }) => {
        try {
            const apiResponse: Response = await fetch('/api/organization/get-ou', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${form.accessToken}`
                },
                body: JSON.stringify({
                    code: form.code,
                    name: form.name,
                    description: form.description,
                    user_id: form.user_id
                })
            });

            const resData: CreateOuResponseApi = await apiResponse.json();

            if (!apiResponse.ok) {
                return rejectWithValue({
                    status: 'error',
                    message: resData.message,
                    id: resData.id,
                    form: null
                });
            }

            return {
                status: 'success',
                message: resData.message,
                id: resData.id,
                form: form
            }
        } catch (error: unknown) {
            return rejectWithValue({
                status: 'error',
                message: (error instanceof Error ? error.message : 'An unknown error occurred'),
                id: null,
                form: null
            });
        }
    }
)


const OrganizationSlice = createSlice({
    name: 'create-ou',
    initialState: initailState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(OrganizationCreateThunk.fulfilled, (state, action) => {
            if (action.payload.status === 'success') {
                const newItem: OrganizationObject = {
                    id: action.payload.id,
                    name: action.payload.form?.name || '',
                    code: action.payload.form?.code || '',
                    description: action.payload.form?.description || '',
                    created_by: action.payload.form?.user_id || ''
                }
                state.userOrganization.push(newItem);
                state.message = action.payload.message;
                state.status = action.payload.status;
            } else {
                state.status = 'error';
                state.message = action.payload.message;
            }
            state.loading = false;
        }).addCase(OrganizationCreateThunk.pending, (state) => {
            state.loading = true;
        }).addCase(OrganizationCreateThunk.rejected, (state, action) => {
            state.loading = false;
            state.message = action.payload?.message || 'unexpected error';
            state.status = 'error';
        })
    }

});


export default OrganizationSlice.reducer;