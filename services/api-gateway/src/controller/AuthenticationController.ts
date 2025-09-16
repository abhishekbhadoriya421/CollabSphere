import { Request, Response } from "express";
import User from '../models/User';
import { Authentication } from "../service/JWT_Authentication";
/**
 * Validate User email and password if validation is passed return access token and set refresh token in cookie 
 *  return {
        status: number | 400;
        message: string | 'Invalid request';
        token: string | null;
        user: object | null;
    }
 */
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
        sameSite: 'lax',
        secure: process.env.NODE_ENVIRONMENT == "PRODUCTION",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });


    return res.status(200).json({
        status: 200,
        message: 'Login SuccessFully',
        token: accessToken.token,
        user: userData
    })
}

/**
 * User Request for creation of account if account is not created already then create new account and save in db 
 * return {
        status: number | 400;
        message: string | 'Invalid request';
    }
 */
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


export const PageReloadAction = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    console.log('refreshToken: ', req.cookies.refreshToken);
    /**
     * user has been logged out need to login again
     */
    interface PageReloadResponse {
        status: number | 400;
        message: string | 'Invalid request';
        token: string | null;
        user: object | null;
    }

    if (!refreshToken) {
        return {
            status: 400,
            message: 'Not Authenticated',
            token: null,
            user: null
        }
    }

    const authenticationObject: Authentication = Authentication.getInstance();

    const validateRefreshToken = authenticationObject.Verify_Refresh_Token(refreshToken);
    console.log(validateRefreshToken);
    if (!validateRefreshToken) {
        return {
            status: 200,
            message: 'Refresh token has been expired login again ',
            token: null,
            user: null
        }
    }



}