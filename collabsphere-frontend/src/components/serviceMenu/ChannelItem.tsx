import { useAppSelector } from "../customHooks/reduxCustomHook";
interface ChannelResponseProp {
    id: number;
    name: string;
    type: 'dm' | 'group' | 'channel' | 'none',
    handleChannelOnClick: (id: number, name: string) => void,
}
export default function ChannelItem({ id, name, type, handleChannelOnClick }: ChannelResponseProp) {

    const { channel_id } = useAppSelector(state => state.ChatBoxReducer);

    return (
        <div className={`space-y-2 p-3 
        ${channel_id && channel_id == id ? "bg-[#32435b]" : "bg-[#1f2937]"}
        rounded-2xl 
        hover:bg-[#32435b]`}>
            <div className="flex items-center rounded-lg" onClick={() => handleChannelOnClick(id, name)}>
                <div className="w-12 h-13 rounded-full overflow-hidden">
                    <img className="w-full h-full object-cover" src="https://img.freepik.com/free-vector/woman-with-braided-hair-illustration_1308-174675.jpg?semt=ais_hybrid&w=740&q=80" alt="profile" />
                </div>
                <div className="ml-3">
                    <span className="block text-white font-semibold">{name}</span>
                    <span className="text-gray-500 text-sm">{type}</span>
                </div>
            </div>
        </div>

    );
}