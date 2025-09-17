import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../customHooks/reduxCustomHook";
import { LogoutThunk } from "../../features/AuthenticationSlice/LoginSlice";

const Navigation = () => {
    const { user } = useAppSelector((state) => state.LoginReducer);
    const [OpenSetting, setSetting] = useState(false);
    const dispatch = useAppDispatch();
    const handleLogOut = () => {
        dispatch(LogoutThunk());
    }
    return (
        <div className="">
            <div className="w-[100%] h-18 bg-white flex justify-between px-4 items-center" id="navigation-bar">
                <div id="user-detail" className="w-[25%]">
                    <p className="font-bold"> <span className="text-green-600 "># </span>{user?.username}</p>
                </div>
                <div id="search-bar" className="w-[30%]">
                    <div className="bg-[#ebecef] w-[100%] h-9.5 rounded-2xl pl-4 flex items-center">
                        <i className="fas fa-search mr-3"></i>
                        <input type="text" className="w-[90%] outline-none focus:ring-0 " placeholder="search" />
                    </div>
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
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleLogOut}>Logout</li>
                                </ul>
                            </div>
                            : null}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Navigation;