import user from "../model/User.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'

export const registeruser = async (req, res, next) => {
    try {
        const User = await user.findOne({ phone_number: req.body.username });
        if (User) {
            return res.status(200).json({ msg: "User Already Exist" });
        } else {
            const password = bcrypt.hashSync(req.body.password, 3);
            const Data = new user({
                userName: req.body.userName,
                password: password,
                phone_number: req.body.phone_number,
                email: req.body.email,
                organization_id:req.body.organization_id
                
            });
            const result = await Data.save();
            if (!result) {
                res.status(200).json({ msg: "User Not Created" });
            } else {
                res.status(200).json({ msg: "User Created Successfully" });
            }
        }
    } catch (error) {
        console.log(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const User = await user.findOne({ phone_number: req.body.phone_number });
        if (!User) {
            return res.status(200).json({ msg: "user does not exist" });
        } else {
            const result = bcrypt.compareSync(
                req.body.password.trim(),
                User.password.trim()
            );
            const token = jwt.sign({ id: User._id }, process.env.JWT_SECRET, { expiresIn: '12h' });
            if (result === false)
                return res.status(200).json({ msg: "Invalid Credential" });
            res.status(200).json({
                token,
                user: {
                    id: User._id,
                    phone_number:User.phone_number,
                    email: User.email,
                    userName:User.userName,
                    organization_id: User.organization_id,
                   
                }
            })
        }
    } catch (error) {
        res.status(400).json({
            error: error.message,
            details: error.errors
        });
    }
};