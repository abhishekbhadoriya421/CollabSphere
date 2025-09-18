import ActivityMenu from "./ActivityMenu";
import ServiceMenuHeader from "./ServiceMenuHeader";

export default function ServiceMenu() {

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
    return (
        <div className="w-[100%] h-screen text-white">
            <div className="h-1/8">
                <ServiceMenuHeader />
            </div>
            <hr />
            <div className="h-3/9">
                {
                    activityItems.map((activity, index) => (
                        <ActivityMenu key={index} content={activity.content} icon={activity.icon} isActive={activity.isActive} />
                    ))
                }

            </div>
            <hr />
        </div>
    );
}