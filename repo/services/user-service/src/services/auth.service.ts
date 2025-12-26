import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../config/database';
import redis from '../config/redis';
import { AppError } from '../middlewares/error.middleware';

interface RegisterInput {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
}

interface LoginInput {
    email: string;
    password: string;
    userAgent?: string;
    ipAddress?: string;
}

export class AuthService {
    private readonly SALT_ROUNDS = 10;
    private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    private readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

    async register(input: RegisterInput) {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email: input.email },
        });

        if (existingUser) {
            throw new AppError('Email already registered', 400);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(input.password, this.SALT_ROUNDS);

        // Create user
        const user = await prisma.user.create({
            data: {
                email: input.email,
                password: hashedPassword,
                firstName: input.firstName,
                lastName: input.lastName,
                phone: input.phone,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                role: true,
                createdAt: true,
            },
        });

        return user;
    }

    async login(input: LoginInput) {
        // Find user
        const user = await prisma.user.findUnique({
            where: { email: input.email },
        });

        if (!user) {
            throw new AppError('Invalid email or password', 401);
        }

        if (!user.isActive) {
            throw new AppError('Account is deactivated', 401);
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(input.password, user.password);

        if (!isPasswordValid) {
            throw new AppError('Invalid email or password', 401);
        }

        // Generate token
        const token = this.generateToken(user.id, user.email, user.role);

        // Calculate expiry
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

        // Create session
        await prisma.session.create({
            data: {
                userId: user.id,
                token,
                userAgent: input.userAgent,
                ipAddress: input.ipAddress,
                expiresAt,
            },
        });

        // Update last login
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });

        // Cache user data in Redis
        await redis.setex(
            `user:${user.id}`,
            3600, // 1 hour
            JSON.stringify({
                id: user.id,
                email: user.email,
                role: user.role,
            })
        );

        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
            token,
        };
    }

    async logout(token: string, userId: string) {
        // Delete session
        await prisma.session.deleteMany({
            where: { token },
        });

        // Blacklist token in Redis (for remaining validity period)
        await redis.setex(`blacklist:${token}`, 7 * 24 * 60 * 60, 'true'); // 7 days

        // Remove cached user data
        await redis.del(`user:${userId}`);
    }

    async logoutAll(userId: string) {
        // Get all sessions
        const sessions = await prisma.session.findMany({
            where: { userId },
            select: { token: true },
        });

        // Blacklist all tokens
        for (const session of sessions) {
            await redis.setex(`blacklist:${session.token}`, 7 * 24 * 60 * 60, 'true');
        }

        // Delete all sessions
        await prisma.session.deleteMany({
            where: { userId },
        });

        // Remove cached user data
        await redis.del(`user:${userId}`);
    }

    private generateToken(userId: string, email: string, role: string): string {
        return jwt.sign(
            { userId, email, role },
            this.JWT_SECRET,
            { expiresIn: this.JWT_EXPIRES_IN }
        );
    }
}

export default new AuthService();
