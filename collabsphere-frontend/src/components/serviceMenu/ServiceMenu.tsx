import { useEffect } from "react";
import ActivityMenu from "./ActivityMenu";
import ServiceMenuHeader from "./ServiceMenuHeader";
import { ActivityItemThunk, ChangeActivity } from "../../features/ServicesSlice/ActivityItemSlice";
import { useAppDispatch, useAppSelector } from "../customHooks/reduxCustomHook";
import useGetUserCredentials from "../customHooks/getUserCredentials";
import ChannelItem from "./ChannelItem";
import { GetAllChannelThunks } from "../../features/ChannelSlice/GetMyChannelsSlice";
import { useNavigate } from "react-router-dom";
import { getActiveChannel } from "../../features/ChatBoxSlice/ChatBoxSlics";


interface Activity {
    id: number,
    icon_class: string,
    content: string,
    is_active: 'ACTIVE' | 'IN-ACTIVE'
}

export default function ServiceMenu() {
    const navigate = useNavigate();

    const { activities } = useAppSelector((state) => state.ActivityItemReducer);
    const { status, channels } = useAppSelector((state) => state.GetMyChannelReducer);

    const { accessToken, user } = useGetUserCredentials();
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (accessToken) {
            dispatch(ActivityItemThunk(accessToken));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);
    useEffect(() => {
        if (accessToken && user) {
            dispatch(GetAllChannelThunks({ accessToken: accessToken, user_id: user?.id }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);
    /**
     * handle is active
     */
    const handleActiveActivity = (index: number): void => {
        dispatch(ChangeActivity(index));
    }

    const handleChannelOnClick = (id: number, name: string) => {
        dispatch(getActiveChannel({ channel_id: id, channel_name: name }));
        navigate('channel/chat');
    }
    return (
        <div className="w-full h-screen flex flex-col text-white">
            <div className="h-1/8">
                <ServiceMenuHeader />
            </div>
            <hr />
            <div className="h-3/9">
                {
                    activities?.map((activity: Activity) => (
                        <ActivityMenu key={activity.id}
                            id={activity.id}
                            content={activity.content}
                            icon={activity.icon_class}
                            isActive={activity.is_active}
                            handleActiveActivity={handleActiveActivity}
                        />
                    ))
                }

            </div>
            <hr />
            {status !== 'loading' && channels.length > 0 ?
                <div className="p-3 overflow-y-auto">
                    <div className="flex justify-between h-12">
                        <h1 className="text-2xl font-bold">Channels</h1>
                        <p className="text-3xl font-bold cursor-pointer" title="Add Channel">+</p>
                    </div>
                    {channels.map((channel, index) => {
                        return <ChannelItem
                            key={index ?? Math.random()}
                            name={
                                (channel.channel_type !== 'dm') ? channel.channel_name : channel.member_username
                            }
                            type={channel.channel_type}
                            id={channel.channel_id!}
                            handleChannelOnClick={handleChannelOnClick} />
                    })}

                </div>
                :
                status === 'loading' ? <i className="fas fa-spinner fa-spin"></i> : <h1><i className="fas fa-exclamation-triangle"></i> Channels Not Found</h1>
            }
        </div>
    );
}