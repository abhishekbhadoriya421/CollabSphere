import { useEffect } from "react";
import ActivityMenu from "./ActivityMenu";
import ServiceMenuHeader from "./ServiceMenuHeader";
import { ActivityItemThunk } from "../../features/ServicesSlice/ActivityItemSlice";
import { useAppDispatch, useAppSelector } from "../customHooks/reduxCustomHook";
import { toast } from "react-toastify";


export default function ServiceMenu() {
    const { loading, status, activities, message } = useAppSelector((state) => state.ActivityItemReducer);
    const dispatch = useAppDispatch();
    const activityItems = [
        {
            index: 1,
            icon: 'fas fa-comment',
            content: 'Chat',
            isActive: true
        },
        {
            index: 2,
            icon: 'fas fa-phone',
            content: 'Calls',
            isActive: false
        },
        {
            index: 3,
            icon: 'fas fa-video',
            content: 'Meetings',
            isActive: false
        },
        {
            index: 4,
            icon: 'fas fa-file',
            content: 'Files',
            isActive: false
        }
    ];
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
    return (
        <div className="w-[100%] h-screen text-white">
            <div className="h-1/8">
                <ServiceMenuHeader />
            </div>
            <hr />
            <div className="h-3/9">
                {/* {
                   activities?.map((activity:ActivityData) => (
                        <ActivityMenu key={activity.index} content={activity.content} icon={activity.icon} isActive={activity.isActive} />
                    ))
                } */}

            </div>
            <hr />
        </div>
    );
}