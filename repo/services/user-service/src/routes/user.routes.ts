import { Router } from 'express';
import userController from '../controllers/user.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import {
    updateProfileValidation,
    changePasswordValidation,
} from '../middlewares/validation.middleware';

const router = Router();

/**
 * @route   GET /api/users/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticate, userController.getProfile);

/**
 * @route   PUT /api/users/me
 * @desc    Update current user profile
 * @access  Private
 */
router.put('/me', authenticate, updateProfileValidation, userController.updateProfile);

/**
 * @route   PUT /api/users/me/password
 * @desc    Change password
 * @access  Private
 */
router.put(
    '/me/password',
    authenticate,
    changePasswordValidation,
    userController.changePassword
);

// ==========================================
// Admin routes
// ==========================================

/**
 * @route   GET /api/users
 * @desc    Get all users (paginated)
 * @access  Admin only
 */
router.get('/', authenticate, authorize('ADMIN'), userController.getAllUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Admin only
 */
router.get('/:id', authenticate, authorize('ADMIN'), userController.getUserById);

/**
 * @route   PUT /api/users/:id/role
 * @desc    Update user role
 * @access  Admin only
 */
router.put('/:id/role', authenticate, authorize('ADMIN'), userController.updateUserRole);

/**
 * @route   DELETE /api/users/:id
 * @desc    Deactivate user
 * @access  Admin only
 */
router.delete('/:id', authenticate, authorize('ADMIN'), userController.deactivateUser);

export default router;
