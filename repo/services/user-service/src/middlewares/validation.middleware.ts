import { body } from 'express-validator';

export const registerValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    body('firstName')
        .trim()
        .notEmpty()
        .withMessage('First name is required'),
    body('lastName')
        .trim()
        .notEmpty()
        .withMessage('Last name is required'),
    body('phone')
        .optional()
        .isMobilePhone('any')
        .withMessage('Please provide a valid phone number'),
];

export const loginValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
];

export const updateProfileValidation = [
    body('firstName')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('First name cannot be empty'),
    body('lastName')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Last name cannot be empty'),
    body('phone')
        .optional()
        .isMobilePhone('any')
        .withMessage('Please provide a valid phone number'),
];

export const changePasswordValidation = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters'),
];

export const addressValidation = [
    body('type')
        .optional()
        .isIn(['HOME', 'WORK', 'OTHER'])
        .withMessage('Invalid address type'),
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Address title is required'),
    body('fullAddress')
        .trim()
        .notEmpty()
        .withMessage('Full address is required'),
    body('city')
        .trim()
        .notEmpty()
        .withMessage('City is required'),
    body('district')
        .optional()
        .trim(),
    body('postalCode')
        .optional()
        .trim(),
    body('isDefault')
        .optional()
        .isBoolean(),
];
