import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


interface OrganizationObject {
    name: string | '';
    code: string | '';
    id: number | null;
    description: string | '';
    created_by: number | '';
}

interface MembershipObject {
    id: number | null;
    user_id: number | null;
    organization_id: number | null;
    role: 'Admin' | 'Member' | 'Guest';
    created_at: Date | null;
    updated_at: Date | null;
    create_by: number | null;
    updated_by: number | null
}

interface ChannelObejct {
    id: number | null
    ou_id: number | null,
    name: string | "",
    type: 'channel' | 'group' | 'dm' | 'none'
}

interface ChannelMembershipObject {
    channel_id: number | null,
    user_id: number | null,
}

interface InitailState {
    userOrganization: OrganizationObject | null;
    message: string | '';
    status: 'idle' | 'error' | 'success';
    loading: boolean;
    userMembership: (MembershipObject | null)[];
    userChannel: ChannelObejct | null;
    userChannelMembership: ChannelMembershipObject | null;
    userRole: 'Admin' | 'Member' | 'Guest';
}

const initailState: InitailState = {
    userOrganization: null,
    message: '',
    status: 'idle',
    loading: false,
    userMembership: [],
    userChannel: null,
    userChannelMembership: null,
    userRole: 'Guest'
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
    organization: OrganizationObject | null;
    membership: (MembershipObject | null)[];
    channel: ChannelObejct | null;
    channelMembership: ChannelMembershipObject | null;
}

interface CreateOuResponseApi {
    status: number;
    message: string;
    organization: OrganizationObject | null;
    membership: (MembershipObject | null)[];
    channel: ChannelObejct | null;
    channelMembership: ChannelMembershipObject | null;
}
/**
 * 
 */
export const OrganizationCreateThunk = createAsyncThunk<ResponseCreateOu, RequestCreateOu, { rejectValue: ResponseCreateOu }>(
    'organization-create',
    async (form: RequestCreateOu, { rejectWithValue }) => {
        try {
            const apiResponse: Response = await fetch('/api/organization/create-ou', {
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
                    organization: null,
                    membership: [],
                    channel: null,
                    channelMembership: null
                });
            }

            return {
                status: 'success',
                message: resData.message,
                organization: resData.organization,
                membership: resData.membership,
                channel: resData.channel,
                channelMembership: resData.channelMembership
            }
        } catch (error: unknown) {
            return rejectWithValue({
                status: 'error',
                message: (error instanceof Error ? error.message : 'An unknown error occurred'),
                organization: null,
                membership: [],
                channel: null,
                channelMembership: null
            });
        }
    }
);

interface RequestGetOu {
    accessToken: string;
}

interface GetOuResponseAPI {
    status: number;
    message: string;
    organization: OrganizationObject | null;
    membership: MembershipObject[];
    user_role: 'Admin' | 'Member' | 'Guest';
}

interface GetOrganizationThunkResponse {
    status: 'idle' | 'error' | 'success';
    message: string;
    organization: OrganizationObject | null;
    membership: MembershipObject[];
    user_role: 'Admin' | 'Member' | 'Guest';
}

export const GetOrganizationThunk = createAsyncThunk<GetOrganizationThunkResponse, RequestGetOu, { rejectValue: GetOrganizationThunkResponse }>(
    'organization-get',
    async (user: RequestGetOu, { rejectWithValue }) => {
        try {
            const apiResponse: Response = await fetch(`/api/organization/get-ou`, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.accessToken}`
                }
            });

            const resData: GetOuResponseAPI = await apiResponse.json();

            if (!apiResponse.ok) {
                return rejectWithValue({
                    status: 'error',
                    message: resData.message,
                    organization: null,
                    membership: [],
                    user_role: 'Guest'
                });
            }

            return {
                status: 'success',
                message: resData.message,
                organization: resData.organization,
                membership: resData.membership,
                user_role: resData.user_role
            }
        } catch (error: unknown) {
            return rejectWithValue({
                status: 'error',
                message: (error instanceof Error ? error.message : 'An unknown error occurred'),
                organization: null,
                membership: [],
                user_role: 'Guest'
            });
        }
    }
)


const OrganizationSlice = createSlice({
    name: 'create-ou',
    initialState: initailState,
    reducers: {
        addUser: (state, action) => {
            state.userMembership.push(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(OrganizationCreateThunk.fulfilled, (state, action) => {
            if (action.payload.status === 'success') {
                const channelMembershipItem: ChannelMembershipObject = {
                    user_id: action.payload.channelMembership?.user_id || null,
                    channel_id: action.payload.channelMembership?.channel_id || null,
                }

                const channelItem: ChannelObejct = {
                    id: action.payload.channel?.id || null,
                    ou_id: action.payload.channel?.ou_id || null,
                    name: action.payload.channel?.name || '',
                    type: action.payload.channel?.type || 'none',

                }

                const organizationItem: OrganizationObject = {
                    name: action.payload.organization?.name || '',
                    code: action.payload.organization?.code || '',
                    id: action.payload.organization?.id || null,
                    description: action.payload.organization?.description || '',
                    created_by: action.payload.organization?.created_by || ''
                }
                state.userChannelMembership = channelMembershipItem;
                state.userMembership = Array.isArray(action.payload.membership)
                    ? action.payload.membership
                    : [action.payload.membership];
                state.userChannel = channelItem;
                state.userOrganization = organizationItem;
                state.message = action.payload.message;
                state.status = action.payload.status;
                state.userRole = 'Admin';
            } else {
                state.status = 'error';
                state.message = action.payload.message;
                state.userChannelMembership = null;
                state.userMembership = [];
                state.userChannel = null;
                state.userOrganization = null;
            }
            state.loading = false;
        }).addCase(OrganizationCreateThunk.pending, (state) => {
            state.loading = true;
        }).addCase(OrganizationCreateThunk.rejected, (state, action) => {
            state.loading = false;
            state.message = action.payload?.message || 'unexpected error';
            state.status = 'error';
            state.userChannelMembership = null;
            state.userMembership = [];
            state.userChannel = null;
            state.userOrganization = null;
        })
            /**
             * Get User Ou
             */
            .addCase(GetOrganizationThunk.fulfilled, (state, action) => {
                if (action.payload.status === 'success') {
                    const organizationItem: OrganizationObject = {
                        name: action.payload.organization?.name || '',
                        code: action.payload.organization?.code || '',
                        id: action.payload.organization?.id || null,
                        description: action.payload.organization?.description || '',
                        created_by: action.payload.organization?.created_by || ''
                    }
                    state.userMembership = Array.isArray(action.payload.membership)
                        ? action.payload.membership
                        : [action.payload.membership];
                    state.userOrganization = organizationItem;
                    state.message = action.payload.message;
                    state.status = action.payload.status;
                } else {
                    state.status = 'error';
                    state.message = action.payload.message;
                    state.userMembership = [];
                    state.userOrganization = null;
                }
                state.loading = false;
                state.userRole = action.payload.user_role;
            }).addCase(GetOrganizationThunk.pending, (state) => {
                state.loading = true;
            }).addCase(GetOrganizationThunk.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload?.message || 'unexpected error';
                state.status = 'error';
                state.userMembership = [];
                state.userOrganization = null;
            })
    }

});

export const { addUser } = OrganizationSlice.actions;
export default OrganizationSlice.reducer;