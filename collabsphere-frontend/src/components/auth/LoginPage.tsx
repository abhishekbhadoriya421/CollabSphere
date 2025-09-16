import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../customHooks/reduxCustomHook';
import { LoginThunk } from '../../features/AuthenticationSlice/LoginSlice';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();
    const { accessToken, loading, user, message, status } = useAppSelector(state => state.LoginReducer);
    /**
     * Redirect to dashboard page if user has logged in 
     */
    useEffect(() => {
        if (accessToken) {
            navigate("/dashboard");
        }
    }, [accessToken, navigate]);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const dispatch = useAppDispatch();
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            toast.error("Email and password required");
        }

        if (formData.password.length < 8) {
            toast.error("Password must have atleast 8 character");
        }
        interface LoginRequest {
            email: string,
            password: string
        }
        const payload: LoginRequest = {
            email: formData.email,
            password: formData.password
        }
        dispatch(LoginThunk(payload));
    };

    useEffect(() => {
        if (accessToken && user && user.username) {
            toast.success(`${user.username} logged in successfully`)
            navigate('/dashboard');
        }
    }, [accessToken, loading, user, message, status, navigate]);
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-indigo-800 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-md transition-all duration-300 hover:translate-y-[-5px]">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
                            <i className="fas fa-users text-white text-xl"></i>
                        </div>
                        <h1 className="text-2xl font-bold text-indigo-600">CollabSphere</h1>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">
                        'Welcome back'
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        'Sign in to continue to your workspace'
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            onInvalid={(e) => e.currentTarget.setCustomValidity('Please enter a valid email address')}
                            placeholder={"Enter your email"}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            onInvalid={(e) => e.currentTarget.setCustomValidity('Password must be at least 8 characters long')}
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder={"Enter your password"}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                    >
                        Sign In
                    </button>
                </form>

                <div className="flex items-center my-6">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="mx-4 text-gray-500 text-sm">or continue with</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>
                <div className="flex justify-center gap-3 mb-6">
                    <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                        <i className="fab fa-google text-gray-600"></i>
                    </button>
                    <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                        <i className="fab fa-microsoft text-gray-600"></i>
                    </button>
                    <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                        <i className="fab fa-slack text-gray-600"></i>
                    </button>
                </div>

                <div className="flex justify-between text-sm">
                    <>
                        <a href="#" className="text-indigo-600 hover:text-indigo-800 hover:underline">
                            Forgot password?
                        </a>
                        <Link to={'/auth/site/create'} className="text-indigo-600 hover:text-indigo-800 hover:underline" >
                            Create account
                        </Link>
                    </>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;