import Jwt, { JwtPayload } from "jsonwebtoken";

interface ResponseAccessToken {
    token: string | null,
    message: string
}

interface ResponseRefreshToken {
    refreshToken: string | null,
    message: string
}
export class Authentication {
    private accessTokenSecret: string;
    private refreshTokenSecret: string;
    private static instance: Authentication;

    private constructor() {
        this.accessTokenSecret = process.env.JWT_SECRET || '45dfg34fguhefgyheftreq@#$%@w#$@edzsab&4#%^%$@';
        this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET || '47#EDCGT#Wsdfgndsjfcgj@#$%@w#$@edzsab&4#%^%$@';
    }

    public static getInstance(): Authentication {
        if (!Authentication.instance) {
            Authentication.instance = new Authentication();
        }
        return Authentication.instance;
    }

    public Generate_Access_Token(user_id: number): ResponseAccessToken {
        if (!user_id) {
            const response: ResponseAccessToken = {
                token: null,
                message: 'User Details Not Found'
            }
            return response
        }

        const accessToken = Jwt.sign({ user_id }, this.accessTokenSecret, { expiresIn: "5m" });
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



    public Generate_Refresh_Token(user_id: number): ResponseRefreshToken {
        if (!user_id) {
            const response: ResponseRefreshToken = {
                refreshToken: null,
                message: 'User Details Not Found'
            }
            return response
        }

        const refreshToken = Jwt.sign({ user_id }, this.refreshTokenSecret, { expiresIn: "5m" });
        if (!refreshToken) {
            const response: ResponseRefreshToken = {
                refreshToken: null,
                message: 'Something went wrong refresh token not generated'
            }
            return response
        }

        const response: ResponseRefreshToken = {
            refreshToken: refreshToken,
            message: 'successfully generated'
        }
        return response;
    }


    public Verify_Access_Token(token: string): JwtPayload | null {
        if (!token) {
            return null;
        }

        try {
            return Jwt.verify(token, this.accessTokenSecret) as JwtPayload
        } catch (err) {
            return null;
        }
    }


    public Verify_Refresh_Token(refreshToken: string): JwtPayload | null {
        if (!refreshToken) {
            return null;
        }
        try {
            return Jwt.verify(refreshToken, this.refreshTokenSecret) as JwtPayload
        } catch (err) {
            return null;
        }
    }

    /**
     * Don't use this method just for hard
     */
    public get_Access_Token() {
        return this.accessTokenSecret;
    }

    public get_Refresh_Token() {
        return this.refreshTokenSecret;
    }

}