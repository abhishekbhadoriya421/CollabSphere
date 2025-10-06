import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../customHooks/reduxCustomHook"
import OrganizationManagement from "./CreateOrganization";
import { toast } from 'react-toastify';
import useGetUserCredentials from '../customHooks/getUserCredentials';
import { GetOrganizationThunk, OrganizationCreateThunk } from '../../features/OrganizationSlice/OrganizationSlice';
import { addChannel } from '../../features/ChannelSlice/GetMyChannelsSlice';
import LoadingPage from "../Loading/LoadingPage";
import OrganizationDashboard from "./OrganizationDashboardPage";
import UpdateOrganizationModal from "./UpdateOrgModal";
interface Organization {
    code: string;
    name: string;
    description: string;
}

export default function OuDashboard() {
    const { accessToken, user } = useGetUserCredentials();
    const { status, message, loading, userChannel, userOrganization,
        userMembership, userRole
    } = useAppSelector((state) => state.OrganizationReducer);

    const [updateForm, setUpdateForm] = useState(false);

    const dispatch = useAppDispatch();
    const [formData, setFormData] = useState<Organization>({
        code: '',
        name: '',
        description: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.code || !formData.name) {
            toast.error('code and name required');
            return;
        }
        if (user && accessToken) {
            dispatch(OrganizationCreateThunk({
                user_id: user.id,
                accessToken: accessToken,
                code: formData.code,
                name: formData.name,
                description: formData.description
            }))
        }
    };

    useEffect(() => {
        if (!loading && message && status != 'idle') {
            if (status == 'error') {
                toast.error(message);
            } else {
                if (userChannel) {
                    dispatch(addChannel({
                        channel_id: userChannel.id,
                        channel_name: userChannel.name,
                        channel_type: userChannel.type,
                        created_by: user?.id || null
                    }))
                }
                toast.success(message);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, message, status, userChannel, dispatch, addChannel])

    useEffect(() => {
        if (accessToken && !userOrganization) {
            dispatch(GetOrganizationThunk({ accessToken }))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [GetOrganizationThunk, dispatch]);

    /**
     * Update Form If Ou Is Already Created
     */
    const handleUpdateOuForm = () => {
        setUpdateForm(!updateForm)
    }

    if (loading === true) {
        return <LoadingPage />
    }
    return (<div>
        {(userOrganization && userOrganization.id) ?
            <OrganizationDashboard handleUpdateOuForm={handleUpdateOuForm} organization={userOrganization} membership={userMembership} user_role={userRole} />
            :
            <OrganizationManagement loading={loading} formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} />
        }
        {updateForm ? <UpdateOrganizationModal loading={loading} formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} handleUpdateOuForm={handleUpdateOuForm} /> : null}
    </div>)
}