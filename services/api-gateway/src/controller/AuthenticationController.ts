import { Request, Response } from "express";


function validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
}

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

    /**
     * validate email format
     */
    if (!validateEmail(email)) {
        const response: LoginResponse = {
            status: 400,
            message: 'Invalid email format',
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

    /**
     * validate email format
     */

    if (!validateEmail(email)) {
        const response: RegisterResponse = {
            status: 400,
            message: 'Invalid email format'
        };
        return res.status(400).json(response);
    }
}