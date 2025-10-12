import axios from "axios"

const api = axios.create({
    baseURL: "https://recommendation-system-5-4b7p.onrender.com",
    withCredentials: true
})

export const userInteresctionDataMl = (data) => {
    return api.post(`/`, data)
}
export const userSearchMl = (name) => {
    return api.post(`/recommend`, {item_name: name})
}