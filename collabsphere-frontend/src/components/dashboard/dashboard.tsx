import { useEffect } from "react";
import { useAppSelector } from "../customHooks/reduxCustomHook"
import { useNavigate } from "react-router-dom";
import Navigation from "../header/Navigation";
import ServiceMenu from "../serviceMenu/ServiceMenu";
export default function Dashboard() {
    const navigate = useNavigate();
    const { accessToken } = useAppSelector((state) => state.LoginReducer);

    useEffect(() => {
        if (!accessToken) {
            navigate('/auth/site/login');
        }
    }, [navigate, accessToken])
    return (
        <div className="flex w-full h-full bg-[#ebecef]">
            <div className="w-[25%] border-1 h-screen">
                <ServiceMenu />
            </div>
            <div className="w-[75%] border-1 h-screen">
                <Navigation />
            </div>
        </div>
    )
}