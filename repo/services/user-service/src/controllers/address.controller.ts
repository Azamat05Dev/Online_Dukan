import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import addressService from '../services/address.service';
import { AppError } from '../middlewares/error.middleware';

export class AddressController {
    async getAddresses(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new AppError('Not authenticated', 401);
            }

            const addresses = await addressService.getAddresses(req.user.id);

            res.json({
                success: true,
                data: addresses,
            });
        } catch (error) {
            next(error);
        }
    }

    async createAddress(req: Request, res: Response, next: NextFunction) {
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

            const { type, title, fullAddress, city, district, postalCode, isDefault } = req.body;

            const address = await addressService.createAddress(req.user.id, {
                type,
                title,
                fullAddress,
                city,
                district,
                postalCode,
                isDefault,
            });

            res.status(201).json({
                success: true,
                message: 'Address created successfully',
                data: address,
            });
        } catch (error) {
            next(error);
        }
    }

    async updateAddress(req: Request, res: Response, next: NextFunction) {
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

            const { id } = req.params;
            const { type, title, fullAddress, city, district, postalCode, isDefault } = req.body;

            const address = await addressService.updateAddress(req.user.id, id, {
                type,
                title,
                fullAddress,
                city,
                district,
                postalCode,
                isDefault,
            });

            res.json({
                success: true,
                message: 'Address updated successfully',
                data: address,
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteAddress(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new AppError('Not authenticated', 401);
            }

            const { id } = req.params;

            const result = await addressService.deleteAddress(req.user.id, id);

            res.json({
                success: true,
                message: result.message,
            });
        } catch (error) {
            next(error);
        }
    }

    async setDefaultAddress(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new AppError('Not authenticated', 401);
            }

            const { id } = req.params;

            const address = await addressService.setDefaultAddress(req.user.id, id);

            res.json({
                success: true,
                message: 'Default address set successfully',
                data: address,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new AddressController();
