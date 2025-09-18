import express from 'express'
const router = express.Router();
import { protect } from "../middleware/authmiddleware.js";
import { addMenu, deleteMenu, getAllMenu, updateMenu } from '../controller/MenusController.js';
import upload from '../middleware/uploadMiddleware.js';


router.get('/getAll', getAllMenu); // get
router.use(protect);
router.post('/', upload.single("image"), addMenu); // Create
router.delete('/delete/:id',deleteMenu); // Delete
router.patch('/update/:id', updateMenu); // Update

export default router;