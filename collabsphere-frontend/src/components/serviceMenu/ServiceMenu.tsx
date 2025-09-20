import { useEffect } from "react";
import ActivityMenu from "./ActivityMenu";
import ServiceMenuHeader from "./ServiceMenuHeader";
import { ActivityItemThunk, ChangeActivity } from "../../features/ServicesSlice/ActivityItemSlice";
import { useAppDispatch, useAppSelector } from "../customHooks/reduxCustomHook";
import { toast } from "react-toastify";

interface Activity {
    id: number,
    icon_class: string,
    content: string,
    is_active: 'ACTIVE' | 'IN-ACTIVE'
}

export default function ServiceMenu() {
    const { loading, status, activities, message } = useAppSelector((state) => state.ActivityItemReducer);
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(ActivityItemThunk())
    }, [dispatch]);

    useEffect(() => {

        if (status == 'error') {
            toast.error(message);
        } else if (status == 'success') {
            if (!activities) {
                toast.success('No Active service Available')
            }
        }
    }, [dispatch, loading, status, activities, message]);

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
        </div>
    );
}