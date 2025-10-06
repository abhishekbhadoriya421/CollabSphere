import React, { useEffect, useState } from "react";
import AddMemberModal from "./AddUserFormModal";
import { useAppDispatch, useAppSelector } from "../customHooks/reduxCustomHook";
import { AddUserThunk, DeleteUserThunk } from "../../features/OrganizationSlice/MembershipSlice";
import useGetUserCredentials from "../customHooks/getUserCredentials";
import { toast } from "react-toastify";
import { addUser, deleteUser } from "../../features/OrganizationSlice/OrganizationSlice";
interface Organization {
    name: string | '';
    code: string | '';
    id: number | null;
    description: string | '';
    created_by: number | '';
}

interface Membership {
    user_id: number | null;
    organization_id: number | null;
    role: 'Admin' | 'Member' | 'Guest';
    created_at: Date | null;
}

interface Props {
    organization: Organization;
    membership: (Membership | null)[];
    user_role: 'Admin' | 'Member' | 'Guest';
    handleUpdateOuForm: () => void
}

interface User {
    role: string;
    email: string;
}


const OrganizationDashboard: React.FC<Props> = ({ organization, membership, user_role, handleUpdateOuForm }) => {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const { accessToken } = useGetUserCredentials();
    const { status, message, user } = useAppSelector((state) => state.UserReducer);
    const dispatch = useAppDispatch();
    function onClose(): void {
        setIsOpenModal(false);
    }

    function handleAddUserOnSubmit(user: User) {
        if (!user.email || !user.role) {
            toast.error('Email and role can not have empty values')
        }
        if (accessToken) dispatch(AddUserThunk({ user, accessToken }))
    }

    function onRemoveUser(user_id: number | null) {
        if (user_id === null) {
            toast.error("User id cannot be empty");
        } else {
            dispatch(DeleteUserThunk({ user_id, accessToken }));
            dispatch(deleteUser(user_id));
        }
    }
    useEffect(() => {
        if (status !== 'loading' && status !== 'idle') {
            if (status === 'success') {
                toast.success(message);
                dispatch(addUser(user));
            } else {
                toast.error(message);
            }

            setIsOpenModal(false);
        }
    }, [status, message, user, dispatch])
    return (
        <div className="p-6 space-y-8">
            <div className="bg-white shadow-md rounded-2xl p-6">
                <div className="flex justify-between">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">🏢 Organization Details</h2>
                    <button
                        className="bg-green-500 
                        text-white px-4 py-2 rounded-xl shadow 
                        hover:bg-green-600 transition cursor-pointer"
                        onClick={handleUpdateOuForm}
                    > ✏️ Update</button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <p><span className="font-semibold">Name:</span> {organization.name}</p>
                    <p><span className="font-semibold">Code:</span> {organization.code}</p>
                    <p><span className="font-semibold">Description:</span> {organization.description}</p>
                </div>
            </div>

            {user_role === 'Admin' ?
                < div className="bg-white shadow-md rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">👥 Members</h2>
                        <button
                            onClick={() => setIsOpenModal(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition"
                        >
                            + Add User
                        </button>
                    </div>

                    {membership.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {membership.map((member) => (
                                member ? (
                                    <div
                                        key={member.user_id ?? Math.random()}
                                        className="border rounded-xl p-4 shadow hover:shadow-lg transition bg-gray-50 flex flex-col justify-between"
                                    >
                                        <div>
                                            <p className="font-semibold text-gray-800">User ID: {member.user_id}</p>
                                            <p className="text-sm text-gray-700">Role: {member.role}</p>
                                            <p className="text-xs text-gray-500">
                                                Joined: {member.created_at && new Date(member.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        {user_role === 'Admin' ?
                                            <button
                                                onClick={() => onRemoveUser && onRemoveUser(member.user_id)}
                                                className="mt-4 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition text-sm"
                                            >
                                                Remove User
                                            </button>
                                            :
                                            null
                                        }

                                    </div>
                                ) : null
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">No members found.</p>
                    )}
                </div>
                : null}
            {isOpenModal ?
                <AddMemberModal onSubmit={handleAddUserOnSubmit} onClose={onClose} submitStatus={status} />
                : null}
        </div >

    );
};

export default OrganizationDashboard;
