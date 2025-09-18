import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${BASE_URL}/auth/login`, credentials);
        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error.response?.data || { message: "Server error" };
    }
};