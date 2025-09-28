import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


interface OrganizationObject {
    name: string | '';
    code: string | '';
    id: number | null;
    description: string | '';
    created_by: number | '';
}

interface MembershipObject {
    user_id: number | null;
    organization_id: number | null;
    role: 'Admin' | 'Member' | 'Guest';
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
    userMembership: MembershipObject | null;
    userChannel: ChannelObejct | null;
    userChannelMembership: ChannelMembershipObject | null;
}

const initailState: InitailState = {
    userOrganization: null,
    message: '',
    status: 'idle',
    loading: false,
    userMembership: null,
    userChannel: null,
    userChannelMembership: null,
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
    membership: MembershipObject | null;
    channel: ChannelObejct | null;
    channelMembership: ChannelMembershipObject | null;
}

interface CreateOuResponseApi {
    status: number;
    message: string;
    organization: OrganizationObject | null;
    membership: MembershipObject | null;
    channel: ChannelObejct | null;
    channelMembership: ChannelMembershipObject | null;
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
                    organization: null,
                    membership: null,
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
                membership: null,
                channel: null,
                channelMembership: null
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
                const channelMembershipItem: ChannelMembershipObject = {
                    user_id: action.payload.channelMembership?.user_id || null,
                    channel_id: action.payload.channelMembership?.channel_id || null,
                }
                const membershipItem: MembershipObject = {
                    user_id: action.payload.membership?.user_id || null,
                    organization_id: action.payload.membership?.organization_id || null,
                    role: action.payload.membership?.role || 'Guest',
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
                state.userMembership = membershipItem;
                state.userChannel = channelItem;
                state.userOrganization = organizationItem;
                state.message = action.payload.message;
                state.status = action.payload.status;
            } else {
                state.status = 'error';
                state.message = action.payload.message;
                state.userChannelMembership = null;
                state.userMembership = null;
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
            state.userMembership = null;
            state.userChannel = null;
            state.userOrganization = null;
        })
    }

});


export default OrganizationSlice.reducer;