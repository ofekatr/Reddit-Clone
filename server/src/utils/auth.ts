const { AuthenticationError } = require('apollo-server');
import { User } from "src/entities/User";
const jwt = require("jsonwebtoken");

const { JWT_KEY } = process.env;

export function generateJwtToken(user: User) {
    return jwt.sign({
        id: user.id,
        username: user.username
    }, JWT_KEY, { expiresIn: '1h' });
}

export function authenticate(context) {
    const authHeader: string = context.req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split('Bearer ')[1];
        if (token) {
            try {
                const user = jwt.verify(token, JWT_KEY);
                return user;
            } catch (err) {
                throw new AuthenticationError('Invalid or expired token.');
            }
        }
        throw new Error('Authentication token format must be \'Bearer <token>\'');
    }
    throw new Error('Authorization header was not provided.');
}