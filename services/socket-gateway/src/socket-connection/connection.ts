import io from '../config/socket';
import axios from 'axios';
import Jwt, { JwtPayload } from "jsonwebtoken";

/**
 * Middleware to authenticate and authorize socket connections using JWT.
 * It verifies the access token provided in the socket handshake.
 * If the token is valid, it attaches the user ID to the socket data.
 * If the token is invalid or expired, it attempts to validate it via an external service.
 * If validation fails, it rejects the connection.
 */
io.use(async (socket, next) => {
    const accessToken = socket.handshake.auth.accessToken;
    if (!accessToken) {
        return next(new Error("Authentication error: Access token is required"));
    }
    try {
        const decoded = Jwt.verify(accessToken, process.env.JWT_SECRET as string) as JwtPayload;
        socket.data.user_id = decoded.user_id;
        return next();
    } catch (jwtError) {
        try {
            const validate = await axios.post('http://localhost:8080/api/auth/validate-token',
                { accessToken }
            );
            if (validate.data.status === 200) {
                socket.data.user_id = validate.data.user_id;
                return next();
            } else {
                return next(new Error(socket.data.message));
            }
        } catch (error) {
            return next(new Error("Authentication error: Token validation failed"));
        }
    }
});

io.on('connection', async (socket) => {
    const user_id = socket.data.user_id;
    const socket_id = socket.id;
    socket.on("close", (reason) => {
        console.log("❌ Connection closed:", socket.id, "Reason:", reason);
    });
    socket.on("disconnect", () => {
        console.log("🔴 User disconnected:", socket.id);
    });
});