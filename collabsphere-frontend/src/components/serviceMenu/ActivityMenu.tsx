type ActivityMenuProps = {
    id: number;
    content: string;
    icon: string;
    isActive: 'ACTIVE' | 'IN-ACTIVE',
    handleActiveActivity(id: number): void
};

export default function ActivityMenu({ id, content, icon, isActive, handleActiveActivity }: ActivityMenuProps) {
    return (
        <div onClick={() => handleActiveActivity(id)} className={`flex h-1/4 items-center cursor-pointer 
        ${isActive === 'ACTIVE' ? " border-l-6 border-l-green-400 bg-[#4f46e5] hover:bg-[#3a34ae]" : "hover:bg-[#1b2431]"}`}>
            <p className="ml-6"><i className={icon} ></i></p>
            <p className="ml-3">{content}</p>
        </div>
    )
}