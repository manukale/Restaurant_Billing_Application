import React, { useContext, useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Toolbar,
  Typography,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Modal,
  Collapse,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import AddBoxIcon from '@mui/icons-material/AddBox';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ReorderOutlinedIcon from "@mui/icons-material/ReorderOutlined";
import Orders from '../components/orders/Orders.jsx'
import { useAuth } from "../context/AuthContext.jsx";
import MenuList from "../components/menu/MenuList.jsx";
import TableList from "../components/tables/TableList.jsx";
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';

const menuItems = [
  { label: "Orders", value: "Orders", icon: <ReorderOutlinedIcon /> },
  {
    label: "Add Menu",
    value: "AddMenu",
    icon: <AddBoxIcon />,
  },
  { label: "Tables", value: "Tables", icon: <TableRestaurantIcon /> },
 
  {
    label: "Expenses",
    value: "Expenses",
    icon: <CurrencyRupeeIcon />,
    subItems: [
      { label: "Pay Roll", value: "PayRoll" },
      { label: "Monthly Expenses", value: "MonthlyExpenses" },
     
    ],
  },
  {
    label: "Profile Manager",
    value: "Profile",
    icon: <PersonOutlineOutlinedIcon />,
  },
 
  // { label: "Bill Report", value: "Report", icon: <SummarizeOutlinedIcon /> },
];

const selected = {
  background: "linear-gradient(90deg, #ff765b 0%, #ffc5b7 100%)",
  color: "white",
  borderRadius: "8px",
  fontWeight: 600,
  boxShadow: 2,
};

const unSelected = {
  color: "#ff765b",
  borderRadius: "8px",
  fontWeight: 500,
  transition: "background 0.2s",
  "&:hover": {
    backgroundColor: "#f3e7e9",
  },
};

const Dashboard = () => {
  // const { user, dispatch } = useContext(userInformation);
  const [comp, setComp] = useState("Orders");
  const { webuser, logoutUser} = useAuth();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState();
 
  const [openExpenses, setOpenExpenses] = useState(false); // 🔽 toggle state

  const logOut = () => {
    logoutUser();
    localStorage.removeItem("orders");
    navigate("/login");
  };

  return (
    <>
      <Box>
        <AppBar
          position="static"
          elevation={0}
          sx={{
            background: "linear-gradient(90deg, #ff765b 0%, #ffc5b7 100%)",
          }}
        >
          <Toolbar>
            <Typography
              variant="h5"
              sx={{ color: "whitesmoke", flexGrow: 1, fontWeight: 700 }}
            >
              Dashboard-Admin
            </Typography>
            {/* <Button
              variant="outlined"
              style={{ color: "white", borderColor: "white" }}
              onClick={() => setComp("Home")}
            >
              Home
            </Button> */}
            <Button
              variant="outlined"
              sx={{ color: "white", borderColor: "white", ml: 2 }}
              onClick={logOut}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        <Grid
          container
          sx={{ minHeight: "calc(100vh - 100px)", overflow: "hidden" }}
        >
          {/* Sidebar */}
          <Grid item xs={12} sm={3} md={2} sx={{ minWidth: 220 }}>
            <Card
              sx={{
                m: 3, // Only vertical margin
                borderRadius: 4,
                boxShadow: 6,
                background: "white",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                p: 2,
                height: "calc(100vh - 160px)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "#ff765b",
                  fontWeight: 700,
                  mb: 2,
                  textAlign: "center",
                }}
              >
                Menu
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {menuItems.map((item) =>
                  item.subItems ? (
                    <React.Fragment key={item.value}>
                      {/* Parent Button */}
                      <ListItemButton
                        onClick={() => setOpenExpenses(!openExpenses)}
                        sx={comp.includes("Expenses") ? selected : unSelected}
                      >
                        <ListItemIcon sx={{ color: comp.includes("Expenses") ? "white" : "#ff765b" }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.label} />
                        {openExpenses ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>

                      {/* Submenu */}
                      <Collapse in={openExpenses} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          {item.subItems.map((sub) => (
                            <ListItemButton
                              key={sub.value}
                              sx={{
                                pl: 6,
                                ...(comp === sub.value ? selected : unSelected),
                              }}
                              selected={comp === sub.value}
                              onClick={() => setComp(sub.value)}
                            >
                              <ListItemText primary={sub.label} />
                            </ListItemButton>
                          ))}
                        </List>
                      </Collapse>
                    </React.Fragment>
                  ) : (
                    <ListItemButton
                      key={item.value}
                      selected={comp === item.value}
                      onClick={() => setComp(item.value)}
                      sx={comp === item.value ? selected : unSelected}
                    >
                      <ListItemIcon sx={{ color: comp === item.value ? "white" : "#ff765b" }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                  )
                )}
              </List>
            </Card>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} sm={9} md={10} sx={{ py: 3, pr: 3, pl: 0 }}>
            <Box sx={{ minHeight: "80vh", width: "100%" }}>
              {
                {
                  // Home: <Home />,
                  AddMenu:<MenuList/>,
                  Orders: <Orders />,
                  Tables:<TableList/>
                  
                }[comp]
              } 
              {/* <div><h1>Mansi</h1></div> */}
            </Box>
          </Grid>
        </Grid>
      </Box>
      
    </>
  );
};

export default Dashboard;