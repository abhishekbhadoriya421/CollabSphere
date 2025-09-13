import { Request, Response } from "express";
import User from '../models/User';

export const LoginAction = async (req: Request, res: Response) => {
    interface LoginRequest {
        email: string;
        password: string;
    }

    interface LoginResponse {
        status: number | 400;
        message: string | 'Invalid request';
        token: string | null;
        user: object | null;
    }
    const { email, password }: LoginRequest = req.body;
    if (!email || !password) {
        const response: LoginResponse = {
            status: 400,
            message: 'Email and password are required',
            token: null,
            user: null
        };
        return res.status(400).json(response);
    }
}

export const RegisterAction = async (req: Request, res: Response) => {
    interface RegisterRequest {
        email: string;
        password: string;
        confirmPassword: string;
        username: string;
    }

    interface RegisterResponse {
        status: number | 400;
        message: string | 'Invalid request';
    }

    const { email, password, confirmPassword, username }: RegisterRequest = req.body;
    if (!email || !password || !confirmPassword || !username) {
        const response: RegisterResponse = {
            status: 400,
            message: 'All fields are required'
        };
        return res.status(400).json(response);
    }

    try {
        interface CreateUserResponse {
            status: boolean;
            message?: string;
            user: User | null;
        }
        const response: CreateUserResponse = await User.createUser(username, email, password, confirmPassword) as CreateUserResponse;
        if (response.status === true) {
            return res.status(201).json({
                status: 201,
                message: response.message || 'User created successfully'
            });
        } else {
            return res.status(400).json({
                status: 400,
                message: response.message || 'User creation failed'
            });
        }
    }
    catch (error) {

    }
}