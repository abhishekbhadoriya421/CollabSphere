import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../customHooks/reduxCustomHook"
import OrganizationManagement from "./CreateOrganization";
import { toast } from 'react-toastify';
import useAccessToken from '../customHooks/getAccessToken';
import { OrganizationCreateThunk } from '../../features/OrganizationSlice/OrganizationSlice';
import { addChannel } from '../../features/ChannelSlice/GetMyChannels';
interface Organization {
    code: string;
    name: string;
    description: string;
}

export default function OuDashboard() {
    const { userOrganization } = useAppSelector((state) => state.OrganizationReducer);
    const { accessToken, user } = useAccessToken();
    const { status, message, loading, userChannel } = useAppSelector((state) => state.OrganizationReducer);
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
            [name]: name === 'created_by' ? (value ? parseInt(value) : null) : value,
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

    return (<div>
        {(userOrganization) ?
            <p>Ou Details</p>
            :
            <OrganizationManagement loading={loading} formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} />
        }
    </div>)
}