import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext';
import { Alert, Box, Button, Grid, IconButton, MenuItem, Modal, Snackbar, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { addMenu } from '../../services/MenuService';

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 2,
    p: 3,
    minWidth: 800,
    maxHeight: "90vh",
    overflowY: "auto",
};

const AddMenu = ({ open, handleClose ,refresh}) => {
    const { webuser } = useAuth();
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [menu, setMenu] = useState({
        itemName: "",
        category: "",
        // description: "",
        price: "",
        // discount: "",
        // hsnCode: "",
        vegType: "",
        image: null,
    });

    // handle change for text/select fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setMenu((prev) => ({ ...prev, [name]: value }));
    };

    // handle file upload separately
    const handleFileChange = (e) => {
        setMenu((prev) => ({ ...prev, image: e.target.files[0] }));
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("itemName", menu.itemName);
            formData.append("category", menu.category);
            formData.append("price", menu.price);
            formData.append("vegType", menu.vegType);
            formData.append("image", menu.image); // file input

            const res = await addMenu(formData)
            console.log(res);
            if (res.success === true) {
                setSnackbarMessage("Menu added successful!");
                setShowSnackbar(true);
                refresh();
                handleClose();
                setMenu({
                    itemName: "",
                    category: "",
                    // description: "",
                    price: "",
                    // discount: "",
                    // hsnCode: "",
                    vegType: "",
                    image: "",
                });
            }


        } catch (error) {
            console.log('***',error)
            setSnackbarMessage(error.stack);
            setShowSnackbar(true);
        }
    }
    return (
        <>
            <Modal open={open} onClose={handleClose}>
                <Box sx={style}>
                    <Typography variant="h6" mb={2}>
                        Add Menu
                    </Typography>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    <Grid container spacing={2}>
                        {/* Basic Details */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Item Name"
                                name="itemName"
                                value={menu.itemName}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Category"
                                name="category"
                                select
                                value={menu.category}
                                onChange={handleChange}
                                sx={{ width: "200px" }}
                                required
                            >
                                <MenuItem value="starter">Starter</MenuItem>
                                <MenuItem value="main">Main Course</MenuItem>
                                <MenuItem value="dessert">Dessert</MenuItem>
                                <MenuItem value="beverage">Beverage</MenuItem>
                            </TextField>
                        </Grid>
                        {/* <Grid item xs={12}>
                        <TextField
                            label="Description"
                            name="description"
                            value={menu.description}
                            onChange={handleChange}
                            multiline
                            rows={2}
                            fullWidth
                        />
                    </Grid> */}

                        {/* Pricing */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="Price (₹)"
                                name="price"
                                value={menu.price}
                                onChange={handleChange}
                                type="number"
                                fullWidth
                                required
                            />
                        </Grid>
                        {/* <Grid item xs={12} sm={4}>
                        <TextField
                            label="Discount (%)"
                            name="discount"
                            value={menu.discount}
                            onChange={handleChange}
                            type="number"
                            fullWidth
                        />
                    </Grid> */}

                        {/* Options */}
                        {/* <Grid item xs={12} sm={6}>
                        <TextField
                            label="HSN / Item Code"
                            name="hsnCode"
                            value={menu.hsnCode}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid> */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Veg/Non-Veg"
                                name="vegType"
                                select
                                value={menu.vegType}
                                onChange={handleChange}
                                sx={{ width: "200px" }}
                            >
                                <MenuItem value="veg">Veg</MenuItem>
                                <MenuItem value="nonveg">Non-Veg</MenuItem>
                            </TextField>
                        </Grid>

                        {/* Upload */}
                        <Grid item xs={12}>
                            <label style={{ fontWeight: 500 }}>Upload Image</label>
                            <input
                                type="file"
                                name="image"
                                onChange={handleFileChange}
                                style={{ marginRight: 16 }}
                            />
                        </Grid>

                        {/* Submit */}
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                sx={{ backgroundColor: "#ff765b", color: "#fff" }}
                                onClick={handleSubmit}
                            >
                                Save Item
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>

            <Snackbar
                open={showSnackbar}
                autoHideDuration={4000}
                onClose={() => setShowSnackbar(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    severity={snackbarMessage === "Menu added successful!" ? "success" : "error"}
                    onClose={() => setShowSnackbar(false)}
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default AddMenu;
