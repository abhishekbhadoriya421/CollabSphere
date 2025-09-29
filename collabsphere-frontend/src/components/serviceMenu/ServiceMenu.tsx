import { useEffect } from "react";
import ActivityMenu from "./ActivityMenu";
import ServiceMenuHeader from "./ServiceMenuHeader";
import { ActivityItemThunk, ChangeActivity } from "../../features/ServicesSlice/ActivityItemSlice";
import { useAppDispatch, useAppSelector } from "../customHooks/reduxCustomHook";
import useAccessToken from "../customHooks/getAccessToken";
import ChannelItem from "./ChannelItem";

interface Activity {
    id: number,
    icon_class: string,
    content: string,
    is_active: 'ACTIVE' | 'IN-ACTIVE'
}
interface channels {
    id: number | null,
    type: 'dm' | 'group' | 'channel' | 'none',
    name: string | '',
    created_by: number | null
}
interface ServiceMenuProp {
    channels: Array<channels>;
    loadingChannel: boolean;
}
export default function ServiceMenu({ channels, loadingChannel }: ServiceMenuProp) {
    const { loading, activities } = useAppSelector((state) => state.ActivityItemReducer);
    const { accessToken } = useAccessToken();
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (accessToken) {
            dispatch(ActivityItemThunk(accessToken));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    /**
     * handle is active
     */
    const handleActiveActivity = (index: number): void => {
        dispatch(ChangeActivity(index));
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
            {!loadingChannel && channels.length > 0 ?
                <div className="p-3 overflow-y-auto">
                    <div className="flex justify-between h-12">
                        <h1 className="text-2xl font-bold">Channels</h1>
                        <p className="text-3xl font-bold cursor-pointer" title="Add Channel">+</p>
                    </div>
                    <div className="space-y-2 p-4 bg-[#1f2937] rounded-2xl hover:bg-[#32435b]">
                        {channels.map(channel => {
                            return <ChannelItem key={channel.id ?? Math.random()} name={channel.name} type={channel.type} id={channel.id} />
                        })}

                    </div>
                </div>
                :
                loading ? <i className="fas fa-spinner fa-spin"></i> : <h1><i className="fas fa-exclamation-triangle"></i> Channels Not Found</h1>
            }
        </div>
    );
}