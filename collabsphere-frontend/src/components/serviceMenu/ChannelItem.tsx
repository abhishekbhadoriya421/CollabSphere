interface ChannelResponseProp {
    id: number | null;
    name: string;
    type: 'dm' | 'group' | 'channel' | 'none',
}
export default function ChannelItem({ id, name, type }: ChannelResponseProp) {
    return (
        <div className="flex items-center rounded-lg" >
            <div className="w-12 h-13 rounded-full overflow-hidden">
                <img className="w-full h-full object-cover" src="https://img.freepik.com/free-vector/woman-with-braided-hair-illustration_1308-174675.jpg?semt=ais_hybrid&w=740&q=80" alt="profile" />
            </div>
            <div className="ml-3">
                <span className="block text-white font-semibold">{name}</span>
                <span className="text-gray-500 text-sm">{type}</span>
            </div>
        </div>
    );
}