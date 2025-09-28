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
        <div className="w-[100%] h-screen text-white">
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
                <h1>Found</h1>
                :
                loading ? <i className="fas fa-spinner fa-spin"></i> : <h1><i className="fas fa-exclamation-triangle"></i> Channels Not Found</h1>
            }
        </div>
    );
}