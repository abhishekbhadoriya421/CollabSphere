import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../customHooks/reduxCustomHook"
import { Outlet, useNavigate } from "react-router-dom";
import Navigation from "../header/Navigation";
import ServiceMenu from "../serviceMenu/ServiceMenu";
import { GetAllChannelThunks } from "../../features/ChannelSlice/GetMyChannels";
import { toast } from "react-toastify";
export default function AppLayout() {
    const navigate = useNavigate();
    const { accessToken, user } = useAppSelector((state) => state.LoginReducer);
    const { message, status, loading, channels } = useAppSelector((state) => state.GetMyChannelReducer);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (accessToken && user) {
            dispatch(GetAllChannelThunks({ accessToken: accessToken, user_id: user?.id }));
        }
    }, [navigate, user, accessToken, dispatch]);

    useEffect(() => {
        if (status === 'error') {
            toast.error(message)
        }
    }, [message, status]);
    return (
        <div className="flex w-full h-full bg-[#ebecef]">
            <div className="w-[25%] h-screen bg-[#1f2937] text-white">
                <ServiceMenu channels={channels} loadingChannel={loading} />
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