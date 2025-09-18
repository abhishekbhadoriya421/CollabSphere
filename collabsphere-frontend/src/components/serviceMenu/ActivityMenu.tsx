type ActivityMenuProps = {
    content: string;
    icon: string;
    isActive: boolean
};

export default function ActivityMenu({ content, icon, isActive }: ActivityMenuProps) {
    return (
        <div className={`flex h-1/4 items-center cursor-pointer hover:bg-[#1b2431]
        ${isActive ? " border-l-6 border-l-green-400 bg-[#4f46e5]" : null}`}>
            <p className="ml-6"><i className={icon} ></i></p>
            <p className="ml-3">{content}</p>
        </div>
    )
}