import prisma from '../config/database';
import redis from '../config/redis';
import { AppError } from '../middlewares/error.middleware';
import { AddressType } from '@prisma/client';

interface CreateAddressInput {
    type?: AddressType;
    title: string;
    fullAddress: string;
    city: string;
    district?: string;
    postalCode?: string;
    isDefault?: boolean;
}

interface UpdateAddressInput {
    type?: AddressType;
    title?: string;
    fullAddress?: string;
    city?: string;
    district?: string;
    postalCode?: string;
    isDefault?: boolean;
}

export class AddressService {
    async getAddresses(userId: string) {
        const addresses = await prisma.address.findMany({
            where: { userId },
            orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
        });

        return addresses;
    }

    async createAddress(userId: string, input: CreateAddressInput) {
        // If this is the first address or isDefault is true, set as default
        if (input.isDefault) {
            await prisma.address.updateMany({
                where: { userId, isDefault: true },
                data: { isDefault: false },
            });
        }

        // Check if user has any addresses
        const addressCount = await prisma.address.count({
            where: { userId },
        });

        const address = await prisma.address.create({
            data: {
                userId,
                type: input.type || 'HOME',
                title: input.title,
                fullAddress: input.fullAddress,
                city: input.city,
                district: input.district,
                postalCode: input.postalCode,
                isDefault: input.isDefault || addressCount === 0,
            },
        });

        // Invalidate cache
        await redis.del(`user:profile:${userId}`);

        return address;
    }

    async updateAddress(userId: string, addressId: string, input: UpdateAddressInput) {
        // Verify ownership
        const address = await prisma.address.findFirst({
            where: { id: addressId, userId },
        });

        if (!address) {
            throw new AppError('Address not found', 404);
        }

        // If setting as default, unset other defaults
        if (input.isDefault) {
            await prisma.address.updateMany({
                where: { userId, isDefault: true },
                data: { isDefault: false },
            });
        }

        const updatedAddress = await prisma.address.update({
            where: { id: addressId },
            data: {
                type: input.type,
                title: input.title,
                fullAddress: input.fullAddress,
                city: input.city,
                district: input.district,
                postalCode: input.postalCode,
                isDefault: input.isDefault,
            },
        });

        // Invalidate cache
        await redis.del(`user:profile:${userId}`);

        return updatedAddress;
    }

    async deleteAddress(userId: string, addressId: string) {
        // Verify ownership
        const address = await prisma.address.findFirst({
            where: { id: addressId, userId },
        });

        if (!address) {
            throw new AppError('Address not found', 404);
        }

        await prisma.address.delete({
            where: { id: addressId },
        });

        // If deleted address was default, set another as default
        if (address.isDefault) {
            const firstAddress = await prisma.address.findFirst({
                where: { userId },
                orderBy: { createdAt: 'asc' },
            });

            if (firstAddress) {
                await prisma.address.update({
                    where: { id: firstAddress.id },
                    data: { isDefault: true },
                });
            }
        }

        // Invalidate cache
        await redis.del(`user:profile:${userId}`);

        return { message: 'Address deleted successfully' };
    }

    async setDefaultAddress(userId: string, addressId: string) {
        // Verify ownership
        const address = await prisma.address.findFirst({
            where: { id: addressId, userId },
        });

        if (!address) {
            throw new AppError('Address not found', 404);
        }

        // Unset current default
        await prisma.address.updateMany({
            where: { userId, isDefault: true },
            data: { isDefault: false },
        });

        // Set new default
        const updatedAddress = await prisma.address.update({
            where: { id: addressId },
            data: { isDefault: true },
        });

        // Invalidate cache
        await redis.del(`user:profile:${userId}`);

        return updatedAddress;
    }
}

export default new AddressService();
