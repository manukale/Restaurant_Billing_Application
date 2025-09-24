import React, { useEffect, useState } from "react";
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Tabs,
    Tab,
    IconButton,
    MenuItem,
    TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {  getAllMenuByOrganization } from "../../services/MenuService";
import { getAllTables, updateTable } from "../../services/TableService";
import { useAuth } from "../../context/AuthContext";

// const tableOptions = ["Table 1", "Table 2", "Table 3", "Table 4", "Takeaway"];

const Orders = () => {
    // multiple orders state
    const { webuser } = useAuth();
    const [menuItems, setMenuItems] = useState();
    const [tables, setTables] = useState([]);
    
    const [orders, setOrders] = useState([
        { id: 1, status: "Processing", timeAgo: "just now", cart: [], table: "" },
    ]);
    const [selectedOrderId, setSelectedOrderId] = useState(1);

    const [categories, setCategories] = useState();
    const [category, setCategory] = useState("");

    const selectedOrder = orders.find((o) => o.id === selectedOrderId);

    useEffect(() => {
        const saved = localStorage.getItem("orders");
        if (saved) setOrders(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem("orders", JSON.stringify(orders));
    }, [orders]);

    useEffect(() => {
        const getMenu = async () => {
            try {
                const res = await getAllMenuByOrganization(webuser.organization_id);
                setMenuItems(res.data)
                const category = [...new Set(res.data.map(item => item.category).filter(Boolean))];
                console.log("categories::", category);
                setCategories(category)

            } catch (error) {
                console.log(error);

            }
        }

        getMenu();
        getTables();
    }, [])
   const getTables = async () => {
        try {
            const res = await getAllTables();
            setTables(res);
        } catch (error) {
            console.log(error);
        }
    };
    const orderStatus = async () => {
        try {
            if (orders.length === 0) {
                const newId = 1;
                setOrders([{ id: newId, status: "Processing", timeAgo: "just now", cart: [], table: "" }]);
                setSelectedOrderId(newId);
                return;
            }
            const currentOrder = orders.find((order) => order.id === selectedOrderId);

            if (!currentOrder || currentOrder?.cart?.length === 0) {
                alert("Previous order is empty");
            } else {
                const newId = orders.length + 1;
                setOrders([
                    ...orders,
                    {
                        id: newId,
                        status: "Processing",
                        timeAgo: "just now",
                        cart: [],
                        table: "",
                    },
                ]);
                setSelectedOrderId(newId);
            }
        } catch (error) {
            console.log(error);
        }
    };


    // Add item to selected order cart
    const addToCart = (item) => {
        setOrders(
            orders.map((order) => {
                if (order.id !== selectedOrderId) return order;
                const existing = order.cart.find((c) => c._id === item._id);
                let updatedCart;
                if (existing) {
                    updatedCart = order.cart.map((c) =>
                        c._id === item._id ? { ...c, qty: c.qty + 1 } : c
                    );
                } else {
                    updatedCart = [{ ...item, qty: 1 }, ...order.cart];
                }
                return { ...order, cart: updatedCart };
            })
        );
    };

    // Update qty in selected order
    const updateQty = (id, change) => {
        setOrders(
            orders.map((order) => {
                if (order.id !== selectedOrderId) return order;
                const updatedCart = order.cart
                    .map((c) =>
                        c._id === id ? { ...c, qty: c.qty + change } : c
                    )
                    .filter((c) => c.qty > 0);
                return { ...order, cart: updatedCart };
            })
        );
    };
    const handleUpdate = async (e) => {
        const selectedTable = e.target.value;
        console.log('selectedTable', selectedTable);
        
        try {
            // ✅ Update backend status
            const res = await updateTable(selectedTable, {status:"engaged"});
            console.log(res);
            
            // ✅ Update local state
            setOrders(
                orders.map((order) =>
                    order.id === selectedOrderId
                        ? { ...order, table: selectedTable }
                        : order
                )
            );
        } catch (error) {
            console.error("Failed to update table:", error);
        }
    };
    // inside Orders.jsx

    const completeOrder = async () => {
        try {
            const currentOrder = orders.find((order) => order.id === selectedOrderId);

            if (!currentOrder) {
                alert("No active order selected");
                return;
            }

            if (!currentOrder.table) {
                alert("Please assign a table before completing the order");
                return;
            }

            // ✅ Update backend: set table to vacant
            await updateTable(currentOrder.table, { status: "vacant" });

            // ✅ Remove completed order from local state
            const updatedOrders = orders.filter((order) => order.id !== selectedOrderId);
            setOrders(updatedOrders);

            // ✅ Reset selected order
            if (updatedOrders.length > 0) {
                setSelectedOrderId(updatedOrders[0].id); // select next available
            } else {
                setSelectedOrderId(null);
            }

            alert(`Order #${currentOrder.id} completed. Table ${currentOrder.table} is now vacant.`);
        } catch (error) {
            console.error("Failed to complete order:", error);
            alert("Something went wrong while completing the order.");
        }
    };


    // Bill totals
    const subtotal = selectedOrder?.cart.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
    ) || 0;
    const tax = subtotal * 0.05;
    const serviceCharge = 10;
    const grandTotal = subtotal + tax + serviceCharge;

    return (
        <Box sx={{
            // width: '50%', 
            maxWidth: '1050px',
            margin: '0 auto',
            height: '83vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            {/* Orders Row */}
            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                    overflowX: "auto",
                    flexWrap: "nowrap",
                    bgcolor: "#f4f8ff",
                    borderBottom: "1px solid #ddd",
                    p: 2,
                    flexShrink: 0
                }}
            >
                {orders?.filter((order) => order.status === 'Processing').map((order) => (
                    <Card
                        key={order.id}
                        onClick={() => setSelectedOrderId(order.id)}
                        sx={{
                            minWidth: 100,
                            p: 2,
                            borderRadius: 2,
                            cursor: "pointer",
                            border:
                                order.id === selectedOrderId
                                    ? "2px solid tomato"
                                    : "1px solid #ccc",
                            flexShrink: 0,
                        }}
                    >
                        <Typography variant="subtitle1" fontWeight="bold">
                            Table {order.table}
                        </Typography>
                        <Typography variant="caption" color="tomato">
                            {order.timeAgo}
                        </Typography>
                        <Box mt={1}>
                            <Typography
                                sx={{
                                    display: "inline-block",
                                    px: 2,
                                    py: 0.5,
                                    fontSize: 12,
                                    borderRadius: 10,
                                    bgcolor: order.status.toLocaleLowerCase() === "processing" ? "tomato" : "#999",
                                    color: "#fff",
                                }}
                            >
                                {order.status}
                            </Typography>
                        </Box>
                    </Card>
                ))}

                {/* New Order */}
                <Card
                    onClick={orderStatus}
                    sx={{
                        minWidth: 100,
                        p: 2,
                        borderRadius: 2,
                        cursor: "pointer",
                        border: "2px dashed tomato",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    <AddCircleOutlineIcon sx={{ color: "tomato" }} />
                    <Typography color="tomato" mt={1}>
                        New Order
                    </Typography>
                </Card>
            </Box>

            {/* Main Content */}
            <Box sx={{
                display: "flex",
                flex: 1,
                overflow: 'hidden'
            }}>
                {/* Left Side - Menu */}
                <Box sx={{
                    flex: 3,
                    p: 2,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: 0,
                }}>
                    <Tabs
                        value={category}
                        onChange={(e, newVal) => setCategory(newVal)}
                        textColor="inherit"
                        TabIndicatorProps={{
                            style: {
                                backgroundColor: "tomato", // underline color
                                height: 3,                 // thickness of underline
                                borderRadius: 2
                            }
                        }}
                        sx={{
                            mb: 2,
                            flexShrink: 0,
                            "& .Mui-selected": {
                                // color: "tomato", // selected text color
                                fontWeight: "bold",
                            },
                            "& .MuiTab-root:hover": {
                                color: "tomato" // hover effect
                            }
                        }}
                    >
                        <Tab value="" label="All" />
                        {categories?.map((cat) => (
                            <Tab key={cat} value={cat} label={cat} />
                        ))}
                    </Tabs>


                    <Box sx={{
                        flex: 1,
                        overflowY: 'auto',
                        pr: 1
                    }}>
                        <Grid container spacing={2}>
                            {menuItems?.filter((item) => !category || item.category === category)
                                .map((item) => (
                                    <Grid item xs={6} sm={4} md={3} key={item._id}>
                                        <Card
                                            sx={{
                                                cursor: "pointer",
                                                textAlign: "center",
                                                height: '100%',
                                                transition: 'transform 0.2s',
                                                '&:hover': {
                                                    transform: 'scale(1.03)',
                                                    boxShadow: 3
                                                }
                                            }}
                                            onClick={() => addToCart(item)}
                                        >
                                            <CardContent sx={{ p: 1 }}>
                                                <img
                                                    src={import.meta.env.VITE_API_BASE_URL + item.image}
                                                    alt={item.itemName}
                                                    style={{
                                                        width: "100%",
                                                        height: 100,
                                                        objectFit: "cover",
                                                        borderRadius: 4
                                                    }}
                                                />
                                                <Typography variant="subtitle2" sx={{ mt: 1 }}>{item.itemName}</Typography>
                                                <Typography variant="body2" color="primary" fontWeight="bold">
                                                    ₹ {item.price}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                        </Grid>
                    </Box>
                </Box>

                {/* Right Side - Cart */}
                <Box
                    sx={{
                        width: 300,
                        flexShrink: 0,
                        bgcolor: "#f9f9f9",
                        p: 2,
                        borderLeft: "1px solid tomato",
                        display: "flex",
                        flexDirection: "column",
                        overflow: 'hidden'
                    }}
                >
                    <Box sx={{
                        display: "flex",
                        flexDirection: "row", gap: '15px'
                    }}>
                        <Typography variant="h6" mb={2}>
                            Order #{selectedOrderId}
                        </Typography>
                        <TextField
                            select
                            label="Select Table"
                            value={selectedOrder?.table || ""}
                            onChange={handleUpdate}
                            size="small"
                            sx={{ mb: 2, bgcolor: "white", width: "200px" }}
                        >
                            {tables
                                // ✅ only vacant tables
                                .filter((table) => table.status === "vacant")
                                // ✅ make sure no other active order has this table
                                .filter(
                                    (table) =>
                                        !orders.some(
                                            (order) =>
                                                order.table === table.table_number &&
                                                order.id !== selectedOrderId 
                                        )
                                )
                                .map((table) => (
                                    <MenuItem key={table.table_number} value={table.table_number}>
                                        Table {table.table_number}
                                    </MenuItem>
                                ))}
                        </TextField>

                    </Box>
                    {/* Scrollable Cart Items */}
                    <Box sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
                        {selectedOrder?.cart?.length === 0 ? (
                            <Typography color="textSecondary" textAlign="center" sx={{ mt: 4 }}>
                                Cart is empty
                            </Typography>
                        ) : (
                            selectedOrder?.cart?.map((item) => (
                                <Box
                                    key={item._id}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        mb: 1,
                                        p: 1,
                                        borderRadius: 1,
                                        bgcolor: 'white'
                                    }}
                                >
                                    <Typography variant="body2" sx={{ flex: 1 }}>{item.itemName}</Typography>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <IconButton size="small" onClick={() => updateQty(item._id, -1)}>
                                            <RemoveIcon fontSize="small" />
                                        </IconButton>
                                        <Typography variant="body2">{item.qty}</Typography>
                                        <IconButton size="small" onClick={() => updateQty(item._id, 1)}>
                                            <AddIcon fontSize="small" />
                                        </IconButton>
                                        <Typography variant="body2" sx={{ minWidth: 60, textAlign: 'right' }}>
                                            ₹ {item.qty * item.price}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))
                        )}
                    </Box>

                    {/* Bill Summary */}
                    <Box mt={2} borderTop="1px solid #ddd" pt={2} sx={{ flexShrink: 0 }}>
                        <Box display="flex" justifyContent="space-between" mb={0.5}>
                            <Typography variant="body2">Subtotal:</Typography>
                            <Typography variant="body2">₹ {subtotal.toFixed(2)}</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mb={0.5}>
                            <Typography variant="body2">Tax (5%):</Typography>
                            <Typography variant="body2">₹ {tax.toFixed(2)}</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography variant="body2">Service Charge:</Typography>
                            <Typography variant="body2">₹ {serviceCharge.toFixed(2)}</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mt={1} borderTop="1px solid #ddd" pt={1}>
                            <Typography variant="subtitle1" fontWeight="bold">Total:</Typography>
                            <Typography variant="subtitle1" fontWeight="bold">
                                ₹ {grandTotal.toFixed(2)}
                            </Typography>
                        </Box>
                    </Box>

                    <Button
                        fullWidth
                        variant="contained"
                        disabled={selectedOrder?.cart?.length === 0}
                        sx={{
                            mt: 2,
                            bgcolor: "tomato",
                            "&:hover": { bgcolor: "darkred" },
                            flexShrink: 0
                        }}
                        onClick={completeOrder}
                    >
                        Complete Order
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default Orders;