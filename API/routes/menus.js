import express from 'express'
const router = express.Router();
import { protect } from "../middleware/authmiddleware.js";
import { addMenu, deleteMenu, getAllMenuByOrganization, updateMenu } from '../controller/MenusController.js';
import upload from '../middleware/uploadMiddleware.js';


router.get('/getAll/:id', getAllMenuByOrganization); // get
router.use(protect);
router.post('/', upload.single("image"), addMenu); // Create
router.delete('/delete/:id',deleteMenu); // Delete
router.patch('/update/:id', updateMenu); // Update

export default router;