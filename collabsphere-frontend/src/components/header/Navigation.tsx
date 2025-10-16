import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../customHooks/reduxCustomHook";
import { LogoutThunk } from "../../features/AuthenticationSlice/LoginSlice";
import SettingsSidebar from "./SettingsSidebar";
import { SearchUserThunk, setUserList } from "../../features/SearchUserSlice/SearchUserSlice";
import { GetChannelByUserThunk } from "../../features/ChannelSlice/GetMyChannelsSlice";
import useGetUserCredentials from "../customHooks/getUserCredentials";


const Navigation = () => {
    const { user } = useAppSelector((state) => state.LoginReducer);
    const { accessToken, userOu } = useGetUserCredentials();
    const { userList, status } = useAppSelector((state) => state.SearchUserReducer);
    const { channels } = useAppSelector((state) => state.GetMyChannelReducer);
    const [OpenSetting, setSetting] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [query, setQuery] = useState("");


    const handleSearch = (searchValue: string) => {
        setQuery(searchValue);
        if (accessToken && userOu) {
            dispatch(SearchUserThunk({ accessToken: accessToken, searchKey: searchValue, ou_id: userOu.organization_id }))
        }
    };

    const dispatch = useAppDispatch();
    const handleLogOut = () => {
        dispatch(LogoutThunk());
    }

    const handleOpenSettingsSidebar = () => {
        setSetting(false);
        setIsSidebarOpen(true);
    };

    const handleCloseSettingsSidebar = () => {
        setIsSidebarOpen(false);
    };

    const handleOnClickUser = (userId: number) => {
        let createChannel = true;
        channels.forEach(channel => {
            if (channel.member_user_id == userId) {
                createChannel = false;
            }
        });
        if (createChannel) {
            dispatch(GetChannelByUserThunk({ accessToken: accessToken, target_user_id: userId }));
        }
        dispatch(setUserList([]));
    }
    return (
        <div className="">
            <div className="w-[100%] h-18 bg-white flex justify-between px-4 items-center" id="navigation-bar">
                <div id="user-detail" className="w-[25%]">
                    <p className="font-bold"> <span className="text-green-600 "># </span>{user?.username}</p>
                </div>
                <div className="w-[30%] relative">
                    <div className="bg-[#ebecef] w-full h-10 rounded-2xl pl-4 flex items-center">
                        <i className="fas fa-search mr-3 text-gray-500"></i>
                        <input
                            type="text"
                            className="w-[90%] bg-transparent outline-none focus:ring-0"
                            placeholder="Search user..."
                            value={query}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                    {(status === "loading" || userList.length > 0) && (
                        <ul className="absolute top-12 w-full bg-white border rounded-lg shadow-lg max-h-64 overflow-y-auto z-10 animate-fadeIn">
                            {status === "loading" ? (
                                <li className="flex justify-center p-4">
                                    <div className="flex flex-col items-center">
                                        <svg
                                            className="animate-spin h-8 w-8 text-blue-500"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                            ></path>
                                        </svg>
                                        <span className="mt-2 text-sm text-gray-500">Searching...</span>
                                    </div>
                                </li>
                            ) : (
                                userList.map((user) =>
                                    user && (
                                        <li
                                            key={user.user_id}
                                            className="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer transition-colors"
                                            onClick={() => {
                                                setQuery("");
                                                handleOnClickUser(user.user_id);
                                            }}
                                        >
                                            <img
                                                src={`https://img.freepik.com/free-vector/woman-with-braided-hair-illustration_1308-174675.jpg?semt=ais_hybrid&w=740&q=80`}
                                                alt={user.username}
                                                className="w-8 h-8 rounded-full object-cover border border-gray-200"
                                            />

                                            {/* User Info */}
                                            <div className="flex flex-col">
                                                <span className="font-medium text-sm text-gray-900">
                                                    {user.username}
                                                </span>
                                                <span className="text-xs text-gray-500">{user.email}</span>
                                            </div>

                                            {/* User ID for differentiation */}
                                            <span className="ml-auto text-xs text-gray-400">
                                                ID: {user.user_id}
                                            </span>
                                        </li>
                                    )
                                )
                            )}
                        </ul>
                    )}

                </div>
                <div id="action-buttons" className="w-[45%] text-center flex justify-end">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#ebecef] mx-2.5 cursor-pointer hover:bg-gray-300">
                        <i className="fas fa-bell text-xl text-gray-700"></i>
                    </div>
                    <div className="relative">
                        <div
                            onClick={() => setSetting(!OpenSetting)}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#ebecef] mx-2.5 cursor-pointer hover:bg-gray-300">
                            <i className="fas fa-cog text-xl text-gray-700"></i>
                        </div>
                        {OpenSetting ?
                            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border border-gray-200">
                                <ul className="py-2">
                                    <li
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={handleOpenSettingsSidebar}
                                    >Settings</li>
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleLogOut}>Logout</li>
                                </ul>
                            </div>
                            : null}
                    </div>
                    {isSidebarOpen && (
                        <SettingsSidebar
                            isOpen={isSidebarOpen}
                            onClose={handleCloseSettingsSidebar}
                        />
                    )}
                </div>

            </div>
        </div>
    )
}

export default Navigation;