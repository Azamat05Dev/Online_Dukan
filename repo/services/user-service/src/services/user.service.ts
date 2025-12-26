import bcrypt from 'bcryptjs';
import prisma from '../config/database';
import redis from '../config/redis';
import { AppError } from '../middlewares/error.middleware';

interface UpdateProfileInput {
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatar?: string;
}

interface ChangePasswordInput {
    currentPassword: string;
    newPassword: string;
}

export class UserService {
    private readonly SALT_ROUNDS = 10;

    async getProfile(userId: string) {
        // Try cache first
        const cached = await redis.get(`user:profile:${userId}`);
        if (cached) {
            return JSON.parse(cached);
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                avatar: true,
                role: true,
                isVerified: true,
                createdAt: true,
                addresses: {
                    select: {
                        id: true,
                        type: true,
                        title: true,
                        fullAddress: true,
                        city: true,
                        district: true,
                        postalCode: true,
                        isDefault: true,
                    },
                },
            },
        });

        if (!user) {
            throw new AppError('User not found', 404);
        }

        // Cache profile
        await redis.setex(
            `user:profile:${userId}`,
            1800, // 30 minutes
            JSON.stringify(user)
        );

        return user;
    }

    async updateProfile(userId: string, input: UpdateProfileInput) {
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                firstName: input.firstName,
                lastName: input.lastName,
                phone: input.phone,
                avatar: input.avatar,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                avatar: true,
                role: true,
            },
        });

        // Invalidate cache
        await redis.del(`user:profile:${userId}`);

        return user;
    }

    async changePassword(userId: string, input: ChangePasswordInput) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { password: true },
        });

        if (!user) {
            throw new AppError('User not found', 404);
        }

        // Verify current password
        const isValid = await bcrypt.compare(input.currentPassword, user.password);
        if (!isValid) {
            throw new AppError('Current password is incorrect', 400);
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(input.newPassword, this.SALT_ROUNDS);

        // Update password
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });

        return { message: 'Password changed successfully' };
    }

    async getAllUsers(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                skip,
                take: limit,
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    phone: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.user.count(),
        ]);

        return {
            users,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async getUserById(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                avatar: true,
                role: true,
                isActive: true,
                isVerified: true,
                createdAt: true,
            },
        });

        if (!user) {
            throw new AppError('User not found', 404);
        }

        return user;
    }

    async updateUserRole(userId: string, role: 'USER' | 'SELLER' | 'ADMIN') {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { role },
            select: {
                id: true,
                email: true,
                role: true,
            },
        });

        // Invalidate caches
        await redis.del(`user:${userId}`);
        await redis.del(`user:profile:${userId}`);

        return user;
    }

    async deactivateUser(userId: string) {
        await prisma.user.update({
            where: { id: userId },
            data: { isActive: false },
        });

        // Delete all sessions
        await prisma.session.deleteMany({
            where: { userId },
        });

        // Invalidate caches
        await redis.del(`user:${userId}`);
        await redis.del(`user:profile:${userId}`);

        return { message: 'User deactivated successfully' };
    }
}

export default new UserService();
