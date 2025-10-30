// This file manages the shopping cart sidebar/panel that shows selected items and total

// Import necessary tools and components
import { useContext, useEffect, useState } from "react";
import { FiShoppingBag } from "react-icons/fi";              // Shopping bag icon
import { IoMdClose } from "react-icons/io";                  // Close button icon
import {CartProductContext} from "../../services/context"     // Shopping cart data
import {NavLink, useNavigate} from "react-router-dom"        // Page navigation
import ProductTemplate from "./productTemplate";             // Individual cart item display

// Shopping cart panel component
const Cart = ({setCmenu}) => {
    // Get cart data and user information from global state
    const {cartItems , items, checkAuth, user} = useContext(CartProductContext)
    // Track price calculations
    const [priceDetail, setPriceDetail] = useState({subtototal: "", tax: "", delivery: "", total: ""});
    const navigate = useNavigate();

    // Calculate total price whenever cart items change
    useEffect(() => {
        // Save cart to browser storage (persists after refresh)
        localStorage.setItem("Cart", JSON.stringify(cartItems));
        
        // Calculate subtotal of all items
        let subtotal = 0;
        for (let i=0;i<cartItems.length;i++){
            subtotal += (cartItems[i].price)*(cartItems[i].quantity)
        }
        
        // Calculate additional costs
        const platform_fees = subtotal*2/100                  // 2% platform fee
        const delivery = subtotal>499 ? 0 : 40               // Free delivery above ₹499
        const total = subtotal + platform_fees + delivery
        
        // Update price details
        setPriceDetail({subtototal: subtotal, platform_fess: platform_fees.toFixed(2), delivery: subtotal>=499 ? "Free Delivery" : "₹40", total: total})
    },[cartItems])

    // Close cart panel
    const handleMenuClose = () => {
        setCmenu(false);
    }
    
    // Continue shopping - redirects to categories page
    const handleContinue = () => {
        setCmenu(false)
        navigate('/categories')
    }
    
    // Handle checkout button click
    const handleCheckout = () => {
        if (checkAuth && user){
            if (!user.isVerified){
                alert('Verify you account first');            // Must verify email before checkout
            } else {
                navigate('/checkout')                         // Go to checkout page
            }
        } else {
            navigate('/signin')                              // Must sign in first
        }
    }
  return (
    <>
      <section className="w-[450px] max-w-[100vw] bg-white h-screen relative">
        <div className="p-[30px] flex flex-col items-center">
            <div className="flex justify-between w-[100%]">
                <div className="flex gap-[7px] items-center">
                    <FiShoppingBag className="text-xl"/>
                    <h2 className="font-medium">Shopping Cart</h2>
                    <div className="w-fit h-fit px-[10px] py-[2px] bg-[#ececf0] rounded-md"><p className="text-[11px] font-medium">{items} items</p></div>
                </div>
                <IoMdClose onClick={handleMenuClose} className="cursor-pointer text-xl"/>
            </div>
            <div className={`${cartItems.length!==0 ? "overflow-y-scroll" : ""} h-[calc(100vh_-_330px)]`}>
            {
                cartItems.length!==0 ? (
                    <div className="flex flex-col gap-[20px] mt-[50px]">
                        {
                            cartItems?.map((item, index) => {
                                return <ProductTemplate key={index} item={item}/>
                            })
                        }
                    </div>
                ) : (
                    <div className="flex flex-col gap-[10px] items-center justify-center h-[80vh]">
                        <div className="w-[50px] h-[50px] rounded-[50%] flex justify-center items-center bg-[#ececf0]">
                            <FiShoppingBag className="text-xl text-[#717182]"/>
                        </div>
                        <h3>Your Cart is Empty</h3>
                        <p className="text-[#717182] text-[13px]">Add some local products to get started</p>
                        <button onClick={handleContinue} className="w-[150px] h-[35px] text-[13px] rounded-md text-white bg-black">Continue Shopping</button>
                    </div>
                )
            }
            </div>
            {cartItems.length===0 ? "" : 
            <div className="w-[100%] flex flex-col gap-[20px] absolute bottom-[20px] items-center">
                <div className="flex h-[100px] flex-col gap-[7px] w-[85%] border-t-2 border-[#ececf0] border-b-2 py-[7px]">
                    <div className="flex justify-between items-center">
                        <p>Subtotal</p>
                        <p>₹{parseFloat(priceDetail?.subtototal).toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <p>Platform Fees</p>
                        <p>₹{parseFloat(priceDetail?.platform_fess).toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <p>Delivery</p>
                        <p>{priceDetail?.delivery}</p>
                    </div>
                </div>
                <div className="flex w-[85%] justify-between items-center">
                    <p>Total</p>
                    <p>₹{parseFloat(priceDetail?.total).toFixed(2)}</p>
                </div>
                <div className="flex flex-col gap-[5px] w-[90%]">
                    <button onClick={handleCheckout} className="w-[100%] h-[35px] bg-black text-white rounded-md">Checkout</button>
                    <button onClick={handleContinue} className="w-[100%] h-[35px] text-[13px] rounded-md text-black border-black border-[1px] bg-white">Continue Shopping</button>
                </div>
            </div>}
        </div>
      </section>
    </>
  )
}

export default Cart
