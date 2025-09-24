import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};
// Add Menu (with image upload)
export const addMenu = async (formData) => {
    try {
        const authHeader = getAuthHeader(); // ✅ get header once
        const res = await axios.post(`${BASE_URL}/menu/`, formData, {
            headers: {
                ...authHeader.headers, // ✅ spread inside
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error adding menu:", error);
        throw error.response?.data || error.message;
    }
};
export const getAllMenuByOrganization = async (id) => {
    try {
        console.log(`${BASE_URL}/menu/getAll/${id}`);
        
        const res = await axios.get(`${BASE_URL}/menu/getAll/${id}`);
        return res.data;
    } catch (error) {
        console.error("Error getting menu:", error);
        throw error.response?.data || error.message;
    }
};
export const deleteMenu = async (id) => {
    try {
        const res = await axios.delete(`${BASE_URL}/menu/delete/${id}`,getAuthHeader());
        return res.data;
    } catch (error) {
        console.error("Error deleting menu:", error);
        throw error.response?.data || error.message;
    }
};
export const updateMenu = async (id,data) => {
    try {
        const res = await axios.patch(`${BASE_URL}/menu/update/${id}`,data,getAuthHeader());
        return res.data;
    } catch (error) {
        console.error("Error updating menu:", error);
        throw error.response?.data || error.message;
    }
};