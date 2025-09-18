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

export const addTable = async(data) => {
    try {
        console.log('***',data)
        const res = await axios.post(`${BASE_URL}/tables/`,data,getAuthHeader());
        return res.data;
    } catch (error) {
        console.error("Error adding tables:", error);
    }
}
export const getAllTables = async () => {
    try {
        const res = await axios.get(`${BASE_URL}/tables/getAll`);
        return res.data;
    } catch (error) {
        console.error("Error getting tables:", error);
        throw error.response?.data || error.message;
    }
};
export const updateTable = async (table_no, data) => {
    try {
        const res = await axios.patch(`${BASE_URL}/tables/update/${table_no}`, data, getAuthHeader());
        return res.data;
    } catch (error) {
        console.error("Error updating table:", error);
        throw error.response?.data || error.message;
    }
};