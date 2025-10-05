
import { Outlet } from "react-router-dom";
import Navigation from "../header/Navigation";
import ServiceMenu from "../serviceMenu/ServiceMenu";
export default function AppLayout() {
    return (
        <div className="flex w-full h-full bg-[#ebecef]">
            <div className="w-[25%] h-screen bg-[#1f2937] text-white">
                <ServiceMenu />
            </div>
            <div className="w-[75%] h-full flex flex-col">
                <Navigation />
                <main className="flex-1 overflow-y-auto mt-1">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}