import { useEffect } from "react";
import ActivityMenu from "./ActivityMenu";
import ServiceMenuHeader from "./ServiceMenuHeader";
import { ActivityItemThunk, ChangeActivity } from "../../features/ServicesSlice/ActivityItemSlice";
import { useAppDispatch, useAppSelector } from "../customHooks/reduxCustomHook";
import useAccessToken from "../customHooks/getAccessToken";

interface Activity {
    id: number,
    icon_class: string,
    content: string,
    is_active: 'ACTIVE' | 'IN-ACTIVE'
}

interface ServiceMenuProp {
    channels: Array<object>;
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
                        <div className="flex items-center rounded-lg">
                            <div className="w-12 h-13 rounded-full overflow-hidden">
                                <img className="w-full h-full object-cover" src="https://img.freepik.com/free-vector/woman-with-braided-hair-illustration_1308-174675.jpg?semt=ais_hybrid&w=740&q=80" alt="profile" />
                            </div>
                            <div className="ml-3">
                                <span className="block text-white font-semibold">Aditi Sharma</span>
                                <span className="text-gray-500 text-sm">Hey! How are you?</span>
                            </div>
                        </div>
                    </div>
                </div>
                :
                loading ? <i className="fas fa-spinner fa-spin"></i> : <h1><i className="fas fa-exclamation-triangle"></i> Channels Not Found</h1>
            }
        </div>
    );
}