import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

export const addproduct = (data) => {
    console.log(data);
    return api.post('/api/admin/addProduct', data)
}

export const getproducts = () => {
    return api.get('/api/admin/getproduct')
}

export const removeproduct = (_id) => {
    const data = {"id": _id};
    console.log(data);
    return api.post('/api/admin/removeProduct', data)
}

export const signup = (userData) => {
    return api.post('/api/user/signup', userData)
}

export const signin = (userData) => {
    return api.post('/api/user/login', userData)
}

export const googleLogin = (code) => {
    return api.post(`/api/user/googlelogin?code=${code}`)
}

export const authCheck = () => {
    return api.get('/api/admin/authcheck')
}

export const logout = () => {
    return api.get('/api/admin/logout')
}

export const getOrders = () => {
    return api.get('/api/order/getall')
}

export const getAllOrders = () => {
    return api.get(`/api/admin/getallorders`)
}

export const getAllUsers = () => {
    return api.get(`/api/admin/getallusers`)
}

export const getVendors = () => {
    return api.get('/api/admin/getvendors');
}

export const approveVendor = (_id) => {
    return api.get(`/api/admin/approvevendor?id=${_id}`)
}