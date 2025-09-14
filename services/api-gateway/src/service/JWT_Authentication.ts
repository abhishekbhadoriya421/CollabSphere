import Jwt, { JwtPayload } from "jsonwebtoken";


interface ResponseAccessToken {
    token: string | null,
    message: string
}

interface ResponseRefreshToken {
    refreshToken: string | null,
    message: string
}

const ACCESS_TOKEN_SECRET: string = process.env.JWT_SECRET || '45dfg34fguhefgyheftreq@#$%@w#$@edzsab&4#%^%$@';
const REFRESH_TOKEN_SECRET: string = process.env.JWT_REFRESH_SECRET || '47#EDCGT#Wsdfgndsjfcgj@#$%@w#$@edzsab&4#%^%$@';

export const Generate_Access_Token = (user_id: string): ResponseAccessToken => {
    if (!user_id) {
        const response: ResponseAccessToken = {
            token: null,
            message: 'User Details Not Found'
        }
        return response
    }

    const accessToken = Jwt.sign({ user_id }, ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
    if (!accessToken) {
        const response: ResponseAccessToken = {
            token: null,
            message: 'Something went wrong access token not generated'
        }
        return response
    }

    const response: ResponseAccessToken = {
        token: accessToken,
        message: 'successfully generated'
    }
    return response;
}



export const Generate_Refresh_Token = (user_id: string): ResponseRefreshToken => {
    if (!user_id) {
        const response: ResponseRefreshToken = {
            refreshToken: null,
            message: 'User Details Not Found'
        }
        return response
    }

    const refreshToken = Jwt.sign({ user_id }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
    if (!refreshToken) {
        const response: ResponseRefreshToken = {
            refreshToken: null,
            message: 'Something went wrong access token not generated'
        }
        return response
    }

    const response: ResponseRefreshToken = {
        refreshToken: refreshToken,
        message: 'successfully generated'
    }
    return response;
}


export const Verify_Access_Token = (token: string): JwtPayload | null => {
    if (!token) {
        return null;
    }

    try {
        return Jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload
    } catch (err) {
        return null;
    }
}


export const Verify_Refresh_Token = (refreshToken: string): JwtPayload | null => {
    if (!refreshToken) {
        return null;
    }
    try {
        return Jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as JwtPayload
    } catch (err) {
        return null;
    }
}