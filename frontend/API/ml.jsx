import axios from "axios"

const api = axios.create({
    baseURL: "https://recommendation-system-1-51qz.onrender.com",
    withCredentials: true
})

export const recommendedProducts = (user_id) => {
    return api.post(`/user-recommend`, {user_id: user_id})
}
export const userSearchMl = (name) => {
    return api.post(`/recommend`, {item_name: name})
}