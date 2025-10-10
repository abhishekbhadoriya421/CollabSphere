
import { Outlet } from "react-router-dom";
import Navigation from "../header/Navigation";
import ServiceMenu from "../serviceMenu/ServiceMenu";
import { connectSocket, disconnectSocket } from "../../features/ChatBoxSlice/SocketConnect";
import { useAppSelector, useAppDispatch } from "../customHooks/reduxCustomHook";
import { useEffect } from "react";
import useGetUserCredentials from "../customHooks/getUserCredentials";
export default function AppLayout() {
    const { accessToken } = useGetUserCredentials();
    const dispatch = useAppDispatch();
    const { isConnected } = useAppSelector(state => state.SocketConnectReducer);
    useEffect(() => {
        let isMounted = true;
        if (isMounted && isConnected === false) {
            dispatch(connectSocket({ accessToken: accessToken }));
        }
        // Cleanup function to disconnect socket when component unmounts
        return () => {
            isMounted = false;
            if (isConnected) {
                dispatch(disconnectSocket());
            }
        };
    }, [isConnected, accessToken, dispatch]);
    return (
        <div className="flex w-full h-full bg-[#ebecef]">
            <div className="w-[25%] h-screen bg-[#1f2937] text-white">
                <ServiceMenu />
            </div>
            <div className="w-[75%] h-full flex flex-col">
                <Navigation />
                <main className="flex-1 overflow-y-auto mt-1">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}