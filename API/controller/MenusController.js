
import Menus from "../model/Menus.js";  // your schema file

// Add Menu API
export const addMenu = async (req, res) => {
    try {
        const {
            itemName,
            category,
            description,
            price,
            discount,
            hsnCode,
            vegType,
        } = req.body;

        // If using multer for image upload
        // const image = req.file ? req.file.filename : null;
        req.body.file = '/gallery/' + req.file.filename
        const newMenu = new Menus({
            itemName,
            category,
            description,
            price,
            discount,
            hsnCode,
            vegType,
            image: req.body.file,
        });

        const savedMenu = await newMenu.save();

        res.status(201).json({
            success: true,
            message: "Menu item added successfully",
            data: savedMenu,
        });
    } catch (error) {
        console.error("Add Menu Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to add menu item",
            error: error.message,
        });
    }
};
export const getAllMenu = async (req, res) => {
    try {
        const result = await Menus.find();
        res.status(200).json({ data: result });
    } catch (error) {
        console.log(error);
    }
};
export const deleteMenu = async (req, res) => {
    try {
        console.log(req.params.id)
        const result = await Menus.findByIdAndDelete({ _id: req.params.id });
        res.status(200).json({ data: result, success: true });
    } catch (error) {
        console.log(error);
        res.status(200).json({ error: error, success: false });

    }
};
export const updateMenu = async (req, res) => {
    try {
        console.log(req.params.id)
        const result = await Menus.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true });
        res.status(200).json({ data: result, success: true });
    } catch (error) {
        console.log(error);
        res.status(200).json({ error: error, success: false });

    }
};
