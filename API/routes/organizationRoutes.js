import express from 'express'
import { createOrganization, getOrganizationById, getOrganizations, updateOrganization, deleteOrganization } from '../controller/organizationController.js';
const router = express.Router();
// CRUD Routes for Organizations
router.post('/', createOrganization); // Create
router.get('/', getOrganizations); // Read all
router.get('/:id', getOrganizationById); // Read one
router.patch('/:id', updateOrganization); // Update
router.put('/:id', updateOrganization); // Alternative update
router.delete('/:id', deleteOrganization); // Delete

export default router;