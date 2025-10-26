import axios from "axios"

const api = axios.create({
    baseURL: "http://172.16.104.68:8001/chat_ai_endpoint_chat_ai_get",
    withCredentials: true
})

export const send = (input) => {
    return api.post('/chat', {input})
}