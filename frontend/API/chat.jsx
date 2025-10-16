import axios from "axios"

const api = axios.create({
    baseURL: "https://recommendation-system-5-4b7p.onrender.com",
    withCredentials: true
})

export const sendInputToBot = (input) => {
    return api.post('/chat', {input})
}