import { Request, Response } from "express";
import db from "../config/sqldb";

function validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
}

export const LoginAction = async (req: Request, res: Response) => {
    const [row] = await db.query('SELECT * FROM users');

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