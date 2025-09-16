import { useEffect } from "react";
import { useAppSelector } from "../customHooks/reduxCustomHook"
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();
    const { accessToken, user } = useAppSelector((state) => state.LoginReducer);

    useEffect(() => {
        if (!accessToken) {
            navigate('/auth/site/login');
        }
    }, [navigate, accessToken])
    return (
        <div>
            Dashboard: {user?.username}
        </div>
    )
}