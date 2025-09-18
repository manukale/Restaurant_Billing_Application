import express from 'express'
import {  login, registeruser } from '../controller/AuthController.js'

const router = express.Router()

router.post('/register', registeruser)
router.post('/login', login)
// router.get('/getUserById/:id', getUserById)
// router.put('/updateUser/:id', updateUser)
// router.post('/verifyPassword/:email', verifyPassword)
// router.post('/updatePassword/:id', updatePassword)
export default router