import { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from '../customHooks/reduxCustomHook';
import { RegisterThunk } from '../../features/AuthenticationSlice/RegistrationSlice';
import { Link, useNavigate } from 'react-router-dom';

const RegistrationPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, message, status } = useAppSelector((state) => state.RegistrationReducer)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRegistration = (name: string, email: string, password: string, confirmPassword: string): boolean => {
        /**
         * validate name, email, password and confirmPassword
         */
        if (!name || !email || !password || !confirmPassword) {
            toast.error("All fields are required");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            return false;
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters long");
            return false;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return false;
        }
        dispatch(RegisterThunk({ username: name, email, password, confirmPassword }));
        return true;
    }

    useEffect(() => {
        if (!loading && message) {
            if (status === 'success') {
                toast.success(message);
                navigate('/auth/site/login')
            } else if (status === 'error') {
                toast.error(message);
            }
        }
    }, [loading, status, message, navigate])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleRegistration(formData.name, formData.email, formData.password, formData.confirmPassword);
    };

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
                        Create account
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Get started with your free account
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            onInvalid={(e) => e.currentTarget.setCustomValidity('Please enter your full name')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                            required
                        />
                    </div>
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
                            placeholder={"Create a password"}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            onInvalid={(e) => e.currentTarget.setCustomValidity('Please confirm your password')}
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Confirm your password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                    >
                        Create Account
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
                            Terms of Service
                        </a>
                        <Link to={'/auth/site/login'} className="text-indigo-600 hover:text-indigo-800 hover:underline">
                            Already have an account?
                        </Link>
                    </>
                </div>
            </div>
        </div>
    );
};

export default RegistrationPage;