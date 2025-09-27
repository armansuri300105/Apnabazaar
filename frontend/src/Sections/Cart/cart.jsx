import { useContext, useEffect, useState } from "react";
import { FiShoppingBag } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import {CartProductContext} from "../../services/context"
import {NavLink, useNavigate} from "react-router-dom"
import ProductTemplate from "./productTemplate";

const Cart = ({setCmenu}) => {
    const {cartItems , items, checkAuth, user} = useContext(CartProductContext)
    const [priceDetail, setPriceDetail] = useState({subtototal: "", tax: "", delivery: "", total: ""});
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem("Cart", JSON.stringify(cartItems));
        let subtotal = 0;
        for (let i=0;i<cartItems.length;i++){
            subtotal += (cartItems[i].price)*(cartItems[i].quantity)
        }
        const platform_fees = subtotal*2/100
        const delivery = subtotal>499 ? 0 : 40
        const total = subtotal + platform_fees + delivery
        setPriceDetail({subtototal: subtotal, platform_fess: platform_fees.toFixed(2), delivery: subtotal>=499 ? "Free Delivery" : "₹40", total: total})
    },[cartItems])

    const handleMenuClose = () => {
        setCmenu(false);
    }
    const handleContinue = () => {
        setCmenu(false)
        navigate('/categories')
    }
    const handleCheckout = () => {
        if (checkAuth && user){
            if (!user.isVerified){
                alert('Verify you account first');
            } else {
                navigate('/checkout')
            }
        } else {
            navigate('/signin')
        }
    }
  return (
    <>
      <section className="w-[450px] max-w-[100vw] bg-white h-screen relative">
        <div className="p-[30px]">
            <div className="flex justify-between w-[100%]">
                <div className="flex gap-[7px] items-center">
                    <FiShoppingBag className="text-xl"/>
                    <h2 className="font-medium">Shopping Cart</h2>
                    <div className="w-fit h-fit px-[10px] py-[2px] bg-[#ececf0] rounded-md"><p className="text-[11px] font-medium">{items} items</p></div>
                </div>
                <IoMdClose onClick={handleMenuClose} className="cursor-pointer text-xl"/>
            </div>
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
                    <div className="flex flex-col gap-[10px] items-center justify-center h-[90vh]">
                        <div className="w-[50px] h-[50px] rounded-[50%] flex justify-center items-center bg-[#ececf0]">
                            <FiShoppingBag className="text-xl text-[#717182]"/>
                        </div>
                        <h3>Your Cart is Empty</h3>
                        <p className="text-[#717182] text-[13px]">Add some local products to get started</p>
                        <button onClick={handleContinue} className="w-[150px] h-[35px] text-[13px] rounded-md text-white bg-black">Continue Shopping</button>
                    </div>
                )
            }
            {cartItems.length===0 ? "" : <div className="w-[100%] flex flex-col gap-[20px] absolute bottom-[20px] justify-center">
                <div className="flex flex-col gap-[7px] w-[85%] border-t-2 border-[#ececf0] border-b-2 py-[7px]">
                    <div className="flex justify-between items-center">
                        <p>Subtotal</p>
                        <p>₹{priceDetail?.subtototal}</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <p>Platform Fees</p>
                        <p>₹{priceDetail?.platform_fess}</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <p>Delivery</p>
                        <p>{priceDetail?.delivery}</p>
                    </div>
                </div>
                <div className="flex w-[85%] justify-between items-center">
                    <p>Total</p>
                    <p>₹{priceDetail?.total}</p>
                </div>
                <div className="flex flex-col gap-[5px]">
                    <button onClick={handleCheckout} className="w-[90%] h-[35px] bg-black text-white rounded-md">Checkout</button>
                    <button onClick={handleContinue} className="w-[90%] h-[35px] text-[13px] rounded-md text-black border-black border-[1px] bg-white">Continue Shopping</button>
                </div>
            </div>}
        </div>
      </section>
    </>
  )
}

export default Cart
