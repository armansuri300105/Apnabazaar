import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

export const getProducts = () => {
    return api.get('/api/product/getall')
}

export const getProductByCat = (cat) => {
    return api.get(`/api/product/get?cat=${cat}`)
}

export const getProductsById = (id) => {
    return api.get(`/api/product/getbyid?id=${id}`)
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
    return api.get('/api/user/authcheck')
}

export const createOrder = (orderData) => {
    console.log(orderData)
    return api.post('/api/order/create', orderData)
}

export const verifyPayment = (credentials) => {
    return api.post('/api/order/verifypayment', credentials)
}

export const updateWishlist = (Productid) => {
    return api.post(`/api/user/wishlist/${Productid}`)
}
export const deleteWishlist = (Productid) => {
    return api.delete(`/api/user/wishlist/${Productid}`)
}

export const logout = () => {
    return api.get('/api/user/logout')
}

export const getOrders = () => {
    return api.get('/api/order/getall')
}

export const getOrder = (_id) => {
    return api.get(`/api/order/get?id=${_id}`)
}

export const getOrderById = (orderId) => {
    return api.get(`/api/order/getbyid?orderId=${orderId}`)
}

export const getWishlist = () => {
    return api.get('/api/user/wishlist/get')
}

export const updateUserDetail = (formData) => {
    return api.put('/api/user/update', formData)
}

export const addVendor = (detail) => {
    return api.post('/api/user/addvendor', detail)
}

export const addVendorProduct = (product) => {
    return api.post('/api/vendor/addproduct', product)
}

export const editVendorProduct = (product) => {
    return api.post('/api/vendor/editproduct', product)
}

export const getVendorOrders = () => {
    return api.get('/api/vendor/getorders')
}

export const getVendorProducts = () => {
    return api.get('/api/vendor/getproducts')
}

export const updateOrderStatus = (data) => {
    return api.put('/api/vendor/updateorderstatus', data)
}

export const removeVendorProduct = (id) => {
    return api.delete(`/api/vendor/deleteproduct?id=${id}`)
}

export const getlast7daysorders = () => {
    return api.get('/api/vendor/getlast7daysorders')
}

export const getordersbycategory = () => {
    return api.get('/api/vendor/getordersbycategory')
}