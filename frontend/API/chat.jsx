import axios from "axios"

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://apnabazaar-backend-3iwt.onrender.com";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
})

export const send = (data) => {
    return api.post('/api/chat/ai', data)
}
