import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../customHooks/reduxCustomHook";
import { LogoutThunk } from "../../features/AuthenticationSlice/LoginSlice";
import SettingsSidebar from "./SettingsSidebar";

interface User {
    id: number;
    name: string;
}

const users: User[] = [
    { id: 1, name: "Alice Johnson" },
    { id: 2, name: "Bob Smith" },
    { id: 3, name: "Charlie Adams" },
    { id: 4, name: "David Wilson" },
    { id: 5, name: "Eva Brown" },
];

const Navigation = () => {
    const { user } = useAppSelector((state) => state.LoginReducer);
    const [OpenSetting, setSetting] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [query, setQuery] = useState("");
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

    const handleSearch = (value: string) => {
        setQuery(value);
        if (value.trim() === "") {
            setFilteredUsers([]);
        } else {
            const results = users.filter(user =>
                user.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredUsers(results);
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
                    {filteredUsers.length > 0 && (
                        <ul className="absolute top-12 w-full bg-white border rounded-lg shadow-md max-h-48 overflow-y-auto z-10">
                            {filteredUsers.map((user) => (
                                <li
                                    key={user.id}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        setQuery(user.name);
                                        setFilteredUsers([]);
                                    }}
                                >
                                    {user.name}
                                </li>
                            ))}
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