import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import userService from '../services/user.service';
import { AppError } from '../middlewares/error.middleware';

export class UserController {
    async getProfile(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new AppError('Not authenticated', 401);
            }

            const profile = await userService.getProfile(req.user.id);

            res.json({
                success: true,
                data: profile,
            });
        } catch (error) {
            next(error);
        }
    }

    async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array(),
                });
            }

            if (!req.user) {
                throw new AppError('Not authenticated', 401);
            }

            const { firstName, lastName, phone, avatar } = req.body;

            const user = await userService.updateProfile(req.user.id, {
                firstName,
                lastName,
                phone,
                avatar,
            });

            res.json({
                success: true,
                message: 'Profile updated successfully',
                data: user,
            });
        } catch (error) {
            next(error);
        }
    }

    async changePassword(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array(),
                });
            }

            if (!req.user) {
                throw new AppError('Not authenticated', 401);
            }

            const { currentPassword, newPassword } = req.body;

            const result = await userService.changePassword(req.user.id, {
                currentPassword,
                newPassword,
            });

            res.json({
                success: true,
                message: result.message,
            });
        } catch (error) {
            next(error);
        }
    }

    // Admin endpoints
    async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const result = await userService.getAllUsers(page, limit);

            res.json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    async getUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const user = await userService.getUserById(id);

            res.json({
                success: true,
                data: user,
            });
        } catch (error) {
            next(error);
        }
    }

    async updateUserRole(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { role } = req.body;

            if (!['USER', 'SELLER', 'ADMIN'].includes(role)) {
                throw new AppError('Invalid role', 400);
            }

            const user = await userService.updateUserRole(id, role);

            res.json({
                success: true,
                message: 'User role updated',
                data: user,
            });
        } catch (error) {
            next(error);
        }
    }

    async deactivateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const result = await userService.deactivateUser(id);

            res.json({
                success: true,
                message: result.message,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController();
