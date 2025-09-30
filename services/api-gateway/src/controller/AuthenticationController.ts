import { Request, Response } from "express";
import User from '../models/User';
import { Authentication } from "../service/JWT_Authentication";
import ErrorHandler from "../utils/ErrorHandler";
import Memberships from "../models/Memberships";
import models from "../models/CentralModel";
import { deleteCache, getCache, setCache } from "../service/Cache";
import { getUserId } from "../utils/GetUserDetails";
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
    try {
        interface LoginRequest {
            email: string;
            password: string;
        }

        const { email, password }: LoginRequest = req.body;
        if (!email || !password) {
            const response = {
                status: 400,
                message: 'Email and password are required',
                token: null,
                user: null,
                userOu: null
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
                user: null,
                userOu: null
            });
        }

        interface UserDataResponse {
            id: number,
            email: string,
            username: string
        }
        const userData: UserDataResponse = validationStatus.user;
        const userOu = await Memberships.findAll({
            where: { user_id: userData.id },
            include: [
                { model: models.Organization, attributes: ['code', 'id', 'name'], required: false }
            ]
        });
        /**
         * create access token and refresh token
         */
        const authenticationObject: Authentication = Authentication.getInstance();
        const accessToken = await authenticationObject.Generate_Access_Token(userData.id);
        const refreshToken = await authenticationObject.Generate_Refresh_Token(userData.id);
        if (!accessToken.token || !refreshToken.refreshToken) {
            return res.status(400).json({
                status: 400,
                message: 'Somthing went wrong could not generate access token and refresh token',
                token: null,
                user: null,
                userOu: null
            });
        }

        res.cookie("refreshToken", refreshToken.refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENVIRONMENT == "PRODUCTION",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        /**
         * Save User Data in cache
         */
        await setCache(`user:${userData.id}`, (7 * 24 * 60 * 60), { user_id: userData.id, username: userData.username, email: userData.email });
        return res.status(200).json({
            status: 200,
            message: 'Login SuccessFully',
            token: accessToken.token,
            user: userData,
            userOu: userOu
        });
    } catch (error) {
        return res.status(200).json({
            status: 200,
            message: ErrorHandler.getMessage(error),
            token: null,
            user: null,
            userOu: null
        });
    }

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
                status: 409,
                message: 'Account exist please login'
            };
            return res.status(409).json(response);
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
            message: ErrorHandler.getMessage(error),
        });
    }
}


export const PageReloadAction = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    /**
     * user has been logged out need to login again
     */

    if (!refreshToken) {
        return res.status(401).json({
            status: 401,
            message: 'Not Authenticated',
            token: null,
            user: null,
            userOu: null
        })
    }

    const authenticationObject: Authentication = Authentication.getInstance();

    const validateRefreshToken = authenticationObject.Verify_Refresh_Token(refreshToken);

    if (!validateRefreshToken) {
        return res.status(200).json({
            status: 200,
            message: 'Refresh token has been expired login again ',
            token: null,
            user: null,
            userOu: null
        })
    }
    const UserDetail = await User.getUserDetailsById(validateRefreshToken.user_id);
    if (!UserDetail) {
        return res.status(404).json({
            status: 404,
            message: 'User not found',
            token: null,
            user: null,
            userOu: null
        })
    }
    const userOu = await Memberships.findAll({
        where: { user_id: UserDetail.id },
        include: [
            { model: models.Organization, attributes: ['code', 'id', 'name'], required: false }
        ]
    });
    /**
     * generate new access token
     */
    const newAccessToken = await authenticationObject.Generate_Access_Token(validateRefreshToken.user_id);
    if (!newAccessToken) {
        return res.status(500).json({
            status: 500,
            message: 'Something went wrong could not generate access token',
            token: null,
            user: null,
            userOu: null
        })
    }

    const response = {
        status: 200,
        message: 'access token generated ',
        token: newAccessToken.token,
        user: UserDetail,
        userOu: userOu
    }

    return res.status(200).json(response);
}

/**
 * Logout The User
 */


export const LogoutAction = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        const authenticate = Authentication.getInstance();
        const authData = authenticate.Verify_Refresh_Token(refreshToken);
        if (authData) {
            await User.update({ refresh_token: null }, { where: { id: authData.user_id } });
            deleteCache(`user:${authData.user_id}`);
        }
        res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENVIRONMENT == "PRODUCTION",
        });
        return res.status(200).json({
            status: 200,
            message: 'Logged out successfully'
        })
    } catch (error) {
        return res.status(200).json({
            status: 500,
            message: ErrorHandler.getMessage(error),
        })
    }

}