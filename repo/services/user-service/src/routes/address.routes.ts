import { Router } from 'express';
import addressController from '../controllers/address.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { addressValidation } from '../middlewares/validation.middleware';

const router = Router();

/**
 * @route   GET /api/users/addresses
 * @desc    Get all addresses for current user
 * @access  Private
 */
router.get('/addresses', authenticate, addressController.getAddresses);

/**
 * @route   POST /api/users/addresses
 * @desc    Create a new address
 * @access  Private
 */
router.post('/addresses', authenticate, addressValidation, addressController.createAddress);

/**
 * @route   PUT /api/users/addresses/:id
 * @desc    Update an address
 * @access  Private
 */
router.put('/addresses/:id', authenticate, addressController.updateAddress);

/**
 * @route   DELETE /api/users/addresses/:id
 * @desc    Delete an address
 * @access  Private
 */
router.delete('/addresses/:id', authenticate, addressController.deleteAddress);

/**
 * @route   PUT /api/users/addresses/:id/default
 * @desc    Set address as default
 * @access  Private
 */
router.put('/addresses/:id/default', authenticate, addressController.setDefaultAddress);

export default router;
