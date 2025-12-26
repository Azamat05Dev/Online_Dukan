import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './error.middleware';
import prisma from '../config/database';
import redis from '../config/redis';

interface JwtPayload {
    userId: string;
    email: string;
    role: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                role: string;
            };
        }
    }
}

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('Access token required', 401);
        }

        const token = authHeader.split(' ')[1];

        // Check if token is blacklisted in Redis
        const isBlacklisted = await redis.get(`blacklist:${token}`);
        if (isBlacklisted) {
            throw new AppError('Token has been revoked', 401);
        }

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'secret'
        ) as JwtPayload;

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, role: true, isActive: true },
        });

        if (!user || !user.isActive) {
            throw new AppError('User not found or inactive', 401);
        }

        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
        };

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return next(new AppError('Invalid token', 401));
        }
        next(error);
    }
};

export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new AppError('Authentication required', 401));
        }

        if (!roles.includes(req.user.role)) {
            return next(new AppError('Access denied', 403));
        }

        next();
    };
};
