interface Props {
    arrangedUserData: Map<number, string>;
    channel_name: string;
    user_id: number | undefined;
    channel_type: 'channel' | 'dm' | 'group';
}
export default function TeamWorkspace({ arrangedUserData, channel_name, channel_type }: Props) {
    return (
        <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
                <h1 className="text-xl font-bold text-gray-900">{channel_name}</h1>
                <p className="text-sm text-gray-600 mt-1">Welcome to the team workspace</p>
            </div>
            <div className="p-4 border-b border-gray-200">
                <p className="text-sm text-gray-700">
                    <strong>Theme:</strong> I am aware, are processes intelligent, coaching you more or collaborating with everyone here!
                </p>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>10:23 AM</span>
                    <span>10:30 AM</span>
                </div>
            </div>
            <div className="flex-1 p-4">
                <h3 className="font-semibold text-gray-700 mb-3">{channel_type}</h3>
                <ul className="space-y-2">
                    <li>
                        <div className="flex items-center text-gray-700 hover:text-purple-600 cursor-pointer">
                            <span className="text-green-500 mr-2">●</span>
                            <span className="font-medium">{channel_name}</span>
                            <span className="text-xs text-gray-500 ml-2">public</span>
                        </div>
                    </li>
                    <li>
                        <div className="flex items-center text-gray-500 hover:text-purple-600 cursor-pointer ml-4">
                            <span className="text-gray-400 mr-2">●</span>
                            <span>You</span>
                        </div>
                    </li>
                    {arrangedUserData &&
                        Array.from(arrangedUserData).map(([id, name]) => (
                            <li key={id}>
                                <div className="flex items-center text-gray-500 hover:text-purple-600 cursor-pointer ml-4">
                                    <span className="text-gray-400 mr-2">●</span>
                                    <span>{name}</span>
                                </div>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    )
}