import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import authService from '../services/auth.service';
import { AppError } from '../middlewares/error.middleware';

export class AuthController {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array(),
                });
            }

            const { email, password, firstName, lastName, phone } = req.body;

            const user = await authService.register({
                email,
                password,
                firstName,
                lastName,
                phone,
            });

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: user,
            });
        } catch (error) {
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array(),
                });
            }

            const { email, password } = req.body;

            const result = await authService.login({
                email,
                password,
                userAgent: req.headers['user-agent'],
                ipAddress: req.ip,
            });

            res.json({
                success: true,
                message: 'Login successful',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token || !req.user) {
                throw new AppError('Not authenticated', 401);
            }

            await authService.logout(token, req.user.id);

            res.json({
                success: true,
                message: 'Logged out successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    async logoutAll(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new AppError('Not authenticated', 401);
            }

            await authService.logoutAll(req.user.id);

            res.json({
                success: true,
                message: 'Logged out from all devices',
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new AuthController();
