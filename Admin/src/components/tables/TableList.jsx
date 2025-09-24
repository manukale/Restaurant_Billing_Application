import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, Card, CardContent, Button } from "@mui/material";
import { AddOutlined } from "@mui/icons-material";
import { addTable, getAllTables } from "../../services/TableService";
import { useAuth } from "../../context/AuthContext";

const getColor = (status) => {
    switch (status) {
        case "vacant":
            return "#4caf50"; // green
        case "engaged":
            return "#f44336"; // red
        case "reserved":
            return "#ff9800"; // orange
        default:
            return "#9e9e9e";
    }
};

const TableList = () => {
    const { webuser } = useAuth();
    const [tables, setTables] = useState([]);

    // Fetch tables from backend
    useEffect(() => {

        getTables();
    }, []); // only run once on mount
    
    const getTables = async () => {
        try {
            const res = await getAllTables();
            setTables(res);
        } catch (error) {
            console.log(error);
        }
    };
    // Add new table
    const tableAdd = async () => {
        try {
            const maxId =
                tables?.length > 0
                    ? Math.max(...tables.map((t) => t.table_number || 0))
                    : 0;

            const newId = maxId + 1; // next available number
            // for frontend only
            const newTable = {
                table_number: newId,
                status: "vacant",
                organization_id: webuser.organization_id
            };

            const res = await addTable(newTable); // ✅ send full object
            setTables((prev = []) =>
                Array.isArray(prev)
                    ? prev.map((t) =>
                        t._id === res._id ? { ...t, status: nextStatus } : t
                    )
                    : []
            );
            getTables();
        } catch (error) {
            console.log(error);
        }
    };

    // Change table status locally (demo)
    const toggleStatus = (table) => {
        const nextStatus =
            table.status === "vacant"
                ? "reserved"
                : table.status === "reserved"
                    ? "engaged"
                    : "vacant";

        setTables((prev) =>
            prev.map((t) =>
                t._id === table._id ? { ...t, status: nextStatus } : t
            )
        );
    };

    return (
        <Box sx={{ p: 3, maxWidth: "1050px" }}>
            <Card sx={{ borderRadius: 4, boxShadow: 10, background: "white" }}>
                <CardContent>
                    {/* Header */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h4" fontWeight={600}>
                            Table Status
                        </Typography>
                        <Button
                            variant="contained"
                            sx={{ backgroundColor: "#ff765b", color: "#fff" }}
                            onClick={tableAdd}
                        >
                            <AddOutlined />
                            Add Table
                        </Button>
                    </Box>

                    {/* Legend */}
                    <Box display="flex" gap={2} mb={3}>
                        <Box sx={{ width: 20, height: 20, bgcolor: "#4caf50", borderRadius: 1 }} /> Vacant
                        <Box sx={{ width: 20, height: 20, bgcolor: "#ff9800", borderRadius: 1 }} /> Reserved
                        <Box sx={{ width: 20, height: 20, bgcolor: "#f44336", borderRadius: 1 }} /> Engaged
                    </Box>

                    {/* Table Grid */}
                    <Grid container spacing={2}>
                        {tables?.map((table) => (
                            <Grid item xs={6} sm={4} md={3} key={table._id || table.id}>
                                <Card
                                    sx={{
                                        p: 2,
                                        textAlign: "center",
                                        borderRadius: 2,
                                        cursor: "pointer",
                                        bgcolor: getColor(table.status),
                                        color: "white",
                                        fontWeight: "bold",
                                        "&:hover": { opacity: 0.8 },
                                    }}
                                    onClick={() => toggleStatus(table)}
                                >
                                    <Typography variant="h6">Table {table.table_number}</Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};

export default TableList;
