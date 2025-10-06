import useGetUserCredentials from "../customHooks/getUserCredentials";
import { useAppSelector } from "../customHooks/reduxCustomHook";
import ChatPage from "../chat/ChatWorkspace";
export default function Dashboard() {
    const { user } = useGetUserCredentials();
    const { channel_id } = useAppSelector(state => state.ChatBoxReducer);
    function onClick() {
        const utterance = new SpeechSynthesisUtterance(`${user?.username} Appka CollabSphere Ki Duniya Main Swagat Hai`);
        utterance.lang = "hi-IN";
        utterance.rate = 1;
        utterance.pitch = 1;
        speechSynthesis.speak(utterance);
    }
    return (
        <>
            {
                !channel_id ?
                    <div className="h-[calc(100vh-4.8rem)]">
                        <div className="flex flex-col items-center justify-center h-full">
                            <i className="fas fa-users font-bold text-[#4f46e5] cursor-pointer text-9xl" onClick={onClick}></i>
                            <h1 className="font-bold ml-2.5 text-5xl cursor-pointer">
                                CollabSphere
                            </h1>
                        </div>
                    </div>
                    :
                    <ChatPage />
            }
        </>
    );

}