import { Request, Response } from "express";
import User from '../models/User';
import { Authentication } from "../service/JWT_Authentication";

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
    interface UserAuthenticationResponse {
        status: boolean;
        user: User | null;
        message: string;
    }

    const validationStatus: UserAuthenticationResponse = await User.AuthenticateUserByEmailAndPassword(email, password);
    /**
     * if status is true the create accesstoken
     */
    if (validationStatus.status === false || validationStatus.user === null) {
        return res.status(400).json({
            status: 400,
            message: validationStatus.message,
            token: null,
            user: null
        });
    }

    interface UserDataResponse {
        id: number,
        email: string,
        username: string
    }
    const userData: UserDataResponse = validationStatus.user;
    /**
     * create access token and refresh token
     */
    const authenticationObject: Authentication = Authentication.getInstance();
    const accessToken = authenticationObject.Generate_Access_Token(userData.id);
    const refreshToken = authenticationObject.Generate_Refresh_Token(userData.id);
    if (!accessToken.token || !refreshToken.refreshToken) {
        return res.status(400).json({
            status: 400,
            message: 'Somthing went wrong could not generate access token and refresh token',
            token: null,
            user: null
        });
    }
    res.cookie("refreshToken", refreshToken.refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENVIRONMENT == "PRODUCTION",
        // maxAge: 5 * 24 * 60 * 60 * 1000
        maxAge: 50000
    });

    return res.status(200).json({
        status: 200,
        message: 'Login SuccessFully',
        token: accessToken.token,
        user: userData
    })
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

        const isUserExist = await User.findOne({
            where: { email: email }
        })

        if (isUserExist) {
            const response: RegisterResponse = {
                status: 400,
                message: 'Account exist please login'
            };
            return res.status(400).json(response);
        }
        const result: CreateUserResponse = await User.createUser(username, email, password, confirmPassword) as CreateUserResponse;

        if (result.status === true) {
            const response: RegisterResponse = {
                status: 201,
                message: result.message || 'User created successfully'
            };
            return res.status(201).json(response);
        } else {
            const response: RegisterResponse = {
                status: 400,
                message: result.message || 'User creation failed'
            };
            return res.status(400).json(response);
        }
    }
    catch (error) {
        return res.status(400).json({
            status: 400,
            message: error || 'User creation failed'
        });
    }
}