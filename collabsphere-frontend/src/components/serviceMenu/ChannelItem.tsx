interface ChannelResponseProp {
    id: number | null;
    name: string;
    type: 'dm' | 'group' | 'channel' | 'none',
    handleChannelOnClick: (id: number | null) => void
}
export default function ChannelItem({ id, name, type, handleChannelOnClick }: ChannelResponseProp) {
    return (
        <div className="space-y-2 p-3 bg-[#1f2937] rounded-2xl hover:bg-[#32435b]">
            <div className="flex items-center rounded-lg" onClick={() => handleChannelOnClick(id)}>
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