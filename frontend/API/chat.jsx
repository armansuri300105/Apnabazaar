import axios from "axios"

const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
    withCredentials: true
})

export const send = (data) => {
    console.log(data)
    return api.post('/chat/ai', data)
}