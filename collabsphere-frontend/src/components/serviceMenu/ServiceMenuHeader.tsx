import { useNavigate } from "react-router-dom";

const ServiceMenuHeader = () => {

    const navigate = useNavigate();
    const handleOnClick = () => {
        navigate('/dashboard');
    }
    return (
        <div className="flex items-center h-full justify-center">
            <i className="fas fa-users text-2xl font-bold text-[#4f46e5] cursor-pointer" onClick={handleOnClick} ></i>
            <h1 className="text-2xl font-bold ml-2.5  cursor-pointer" onClick={handleOnClick}>
                CollabSphere
            </h1>
        </div>
    )
}


export default ServiceMenuHeader;