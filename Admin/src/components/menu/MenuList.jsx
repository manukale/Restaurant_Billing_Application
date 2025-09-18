import { Alert, Box, Button, Card, CardContent, Grid, Snackbar, Typography } from '@mui/material';
import { DataGrid, GridCellEditStopReasons } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState } from 'react'
import AddMenu from './AddMenu';
import { deleteMenu, getAllMenu, updateMenu } from '../../services/MenuService';
import { AddOutlined } from '@mui/icons-material';

const MenuList = () => {
    const [menus, setMenus] = useState();
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        fetchMenu();
        console.log('Manasi');

    }, [])
    const fetchMenu = async () => {
        try {
            const res = await getAllMenu()
            setMenus(res.data)
        } catch (error) {
            console.log(error);

        }
    }
    const deleteItem = async (data) => {
        try {
            const res = await deleteMenu(data)
            console.log(res)
            if (res.success === true) {
                setSnackbarMessage("Menu deleted successful!");
                setShowSnackbar(true);
                fetchMenu();
            }
        } catch (error) {
            console.log(error);
            setSnackbarMessage(error.error);
            setShowSnackbar(true);
        }
    }
    const updateItem = async (newRow,oldRow) => {
        try {
            const updatedFields = {};
            if (newRow.itemName !== oldRow.itemName ) {             
                updatedFields.itemName = newRow.itemName;
            }
            if (newRow.category !== oldRow.category ) {             
                updatedFields.category = newRow.category;
            }
            if (newRow.vegType !== oldRow.vegType ) {             
                updatedFields.vegType = newRow.vegType;
            }
            if (newRow.price !== oldRow.price ) {             
                updatedFields.price = newRow.price;
            }
            const res = await updateMenu(newRow._id,updatedFields)

            if (res.success === true) {
                setSnackbarMessage("Menu updated successful!");
                setShowSnackbar(true);
                fetchMenu();
            }
        } catch (error) {
            console.log(error);
            
        }
    }
    const menu_columns = [
        {
            field: "image",
            headerName: "Image",
            renderCell: (params) => (
                <>
                    <img
                        src={import.meta.env.VITE_API_BASE_URL + params?.row?.image}
                        height={"50px"}
                        width={"75px"}
                        style={{ borderRadius: 8 }}
                    />
                </>
            ),
            width: 150,
        },
        { field: "itemName", headerName: "Name", width: 170, editable: true },
        { field: "price", headerName: "Price", width: 170, editable: true },
        { field: "vegType", headerName: "Veg/Non-Veg", width: 170, editable: true },
        { field: "category", headerName: "Category", width: 170, editable: true },
        {
            field: "action",
            headerName: "Action",
            renderCell: (params) => (
                <>
                    <Button
                        sx={{ color: " #ff765b" }}
                        onClick={() => deleteItem(params?.row._id)}
                    >
                        <DeleteIcon />
                    </Button>
                </>
            ),
            width: 120,
        },
    ]
    return (
        <>
            <Box>
                <Card
                    sx={{ borderRadius: 4, boxShadow: 10, background: "white" }}
                >
                    <CardContent>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                >
                    <Typography variant="h4" fontWeight={600}>
                        Menus
                    </Typography>
                    <Box display="flex" justifyContent="flex-end" mb={2}>
                        <Button
                            // accessKey="c"
                            variant="contained"
                            sx={{ backgroundColor: "#ff765b", color: "#fff" }}
                            onClick={handleOpen}
                        >

                            <AddOutlined />
                            Add Menu
                        </Button>
                    </Box>
                </Box>

                <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    sx={{ width: "70vw", height: "100%" }}
                >
                    <Grid item xs={12} md={10} lg={8}>
                      

                                <div style={{ height: "520px", width: "930px" }}>
                                    {!menus ? (
                                        <Typography variant="body1" color="text.secondary">
                                            L O A D I N G
                                        </Typography>
                                    ) : (
                                        <DataGrid
                                            rows={menus}
                                            columns={menu_columns}
                                            getRowId={(row) => row._id}
                                                processRowUpdate={async (newRow, oldRow) => {
                                                    await updateItem(newRow, oldRow); // call your update function
                                                    return newRow; //  return the updated row so DataGrid exits edit mode
                                                }}
                                                onProcessRowUpdateError={(error) => {
                                                    console.error("Row update failed:", error);
                                                    setSnackbarMessage("Failed to update product. Please try again.");
                                                    setShowSnackbar(true);
                                                }}
                                                experimentalFeatures={{ newEditingApi: true }} // ✅ ensures edit mode behaves correctly
                                                sx={{
                                                    borderRadius: 2,
                                                    boxShadow: 2,
                                                    background: "#f9f9fb",
                                                }}
                                        />
                                    )}
                                </div>
                          
                    </Grid>
                </Grid>

                    </CardContent>
                </Card>

            </Box>

            <Snackbar
                open={showSnackbar}
                autoHideDuration={4000}
                onClose={() => setShowSnackbar(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    severity={snackbarMessage.includes('successful') ? "success" : "error"}
                    onClose={() => setShowSnackbar(false)}
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <AddMenu open={open} handleClose={handleClose} refresh={fetchMenu} />

        </>
    )
}

export default MenuList