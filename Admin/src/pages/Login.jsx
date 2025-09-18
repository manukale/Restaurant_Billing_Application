import React, { useState } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    IconButton,
    InputAdornment,
    Snackbar,
    TextField,
    Typography,
} from "@mui/material";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import wallpaper from "../assets/wallpaper_2.webp";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/UserService";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
    const { loginData } = useAuth();
    const [credentials, setCredentials] = useState({ phone_number: "", password: "" });
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            console.log(credentials)
            const res = await loginUser(credentials);
            if (res) {
                loginData(res.user, res.token);
                // localStorage.setItem("token", res.token); // store token if needed
                setSnackbarMessage("Login successful!");
                setShowSnackbar(true);
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1000);
            }
        } catch (err) {
            console.log(err);
            
            if (err.error) {
                setSnackbarMessage(err.error);
                setShowSnackbar(true);
            }
            if (err.message) {
                setSnackbarMessage(err.message);
                setShowSnackbar(true);
            }
        }
    };


    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
            {/* Left side image */}
            <Box
                sx={{
                    flex: 1,
                    backgroundImage: `url(${wallpaper})`, // replace with your own image
                    backgroundSize: "fit",   // ✅ fit image
                }}
            />

            {/* Right side login form */}
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#f9f9f9",
                }}
            >
                <Card sx={{ width: 400, borderRadius: 3, boxShadow: 4 }}>
                    <CardContent>
                        <Box display="flex" justifyContent="center" mb={1}>
                            <RestaurantMenuIcon sx={{ fontSize: 50, color: "tomato" }} />
                        </Box>

                        <Typography
                            variant="h5"
                            fontWeight="bold"
                            align="center"
                            color="tomato"
                            mb={2}
                        >
                            Hotel Phulpakharu
                        </Typography>

                        
                        <Grid container spacing={2} padding={4}>
                            <Grid item xs={12}>
                                <TextField
                                    style={{width:'300px',}}
                                    label="Phone Number"
                                    name="phone_number"
                                    // type="phone_number"
                                    value={credentials.phone_number}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    style={{ width: '300px' }}
                                    type={showPassword ? "text" : "password"}
                                    label="Password"
                                    name="password"
                                    value={credentials.password}
                                    onChange={handleChange}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    required
                                />
                            </Grid>
                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                sx={{
                                    mt: 2,
                                    bgcolor: "tomato",
                                    "&:hover": { bgcolor: "darkred" },
                                }}
                                onClick={handleSubmit}
                            >
                                Login
                            </Button>
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
                    severity={snackbarMessage === "Login successful!" ? "success" : "error"}
                    onClose={() => setShowSnackbar(false)}
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Login;
