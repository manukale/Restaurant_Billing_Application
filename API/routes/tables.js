import express from 'express'
const router = express.Router();
import { protect } from "../middleware/authmiddleware.js";
import { addTable, deleteTable, getAllTables, updateTable } from '../controller/TableController.js';


router.get('/getAll', getAllTables); // get
router.use(protect);
router.post('/', addTable); // Create
router.delete('/delete/:id', deleteTable); // Delete
router.patch('/update/:table_no', updateTable); // Delete

export default router;