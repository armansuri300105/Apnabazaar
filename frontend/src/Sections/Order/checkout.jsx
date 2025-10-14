import { FaArrowLeft } from "react-icons/fa6";
import "./checkout.css"
import { useContext, useEffect, useState } from "react";
import { CartProductContext } from "../../services/context";
import { useNavigate } from "react-router-dom";
import OrderDetail from "./orderDetail";
import PaymentOptions from "./paymentOptions";
import DeliveryOption from "./deliveryOption";
import AddressForm from "./addressForm";
import { createOrder, getOrder, verifyPayment } from "../../../API/api";
import Addresses from "./addresses";
import OrderPage from "./orderPage";
import {useQuery} from "@tanstack/react-query"
import CheckoutSkeleton from "./Skeletons/checkoutSkeleton"
import Loading from "../Loading/loading"

const Checkout = () => {
    const {cartItems , user, setCartItems, setCmenu} = useContext(CartProductContext)
    const [priceDetail, setPriceDetail] = useState({subtotal: "", platform_fees: "", delivery: "", total: ""});
    const [count, setCount] = useState(1);
    const [selected, setSelected] = useState(0);
    const [paymentSelected, setPaymentSelected] = useState(0);
    const [addNew, setaddNew] = useState(false);
    const [loading, setLoading] = useState(false);
    const [orderStatus, setOrderStatus] = useState(false);
    const [orderId, setOrderId] = useState(null)
    const navigate = useNavigate();
    const [addressForm, setAddressForm] = useState({
        email: "",
        name: "",
        street: "",
        city: "",
        state: "",
        phone: "",
        zipcode: "",
        remember: false
    })

    const {data: orderData, isLoading} = useQuery({
        queryKey: ["orders"],
        queryFn: () => getOrder(orderId),
        select: (res) => (res?.data?.order) || [],
        enabled: !!orderStatus && !!orderId,
    })

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        if (cartItems.length===0){
            navigate("/")
        }

        return () => {
            document.body.removeChild(script);
        };

    }, []);
    useEffect(() => {
        let subtotal = 0;
        for (let i=0;i<cartItems.length;i++){
            subtotal += (cartItems[i].price)*(cartItems[i].quantity)
        }
        const platform_fees = subtotal*2/100
        let delivery = 0;
        subtotal<=499 ? delivery = 40 : 0
        selected===1 ? delivery = 60 : 0;
        const total = subtotal + platform_fees + delivery
        setPriceDetail({subtotal: subtotal, platform_fees: platform_fees.toFixed(2), delivery: delivery===0 ? "Free Delivery" : `₹${delivery}`, total: total})
    },[cartItems, selected])

    const handleCreateOrder = async (e) => {
        e.preventDefault();
        setCmenu(false)
        setLoading(true);
        if (cartItems?.length<=0){
            alert("Cart Should Not be Empty")
            setLoading(false)
            return
        }
        const orderData = {
            user,
            items: cartItems,
            shippingAddress: addressForm,
            deliveryMethod: selected===0 ? "Standard" : "Express",
            paymentMethod: paymentSelected===0 ? "ONLINE" : "COD",
        }
        if (paymentSelected === 1) {
            try {
                const response = await createOrder(orderData);
                const data = response?.data;

                if (!data.success) {
                    alert(data.msg || "Order creation failed");
                    return;
                }
                setCartItems([]);
                setLoading(false);
                setOrderId(data?.orderid);
                localStorage.removeItem("Cart");
                setOrderStatus(true);
            } catch (err) {
                console.error("COD Order Error:", err);
                alert("Failed to create COD order.");
            }
            return;
        }
        
        if (!user) return;

        try {
            if (!Array.isArray(orderData?.items) || orderData?.items.length === 0) {
                console.error("Cart is empty");
                setLoading(false)
                return;
            }
            const response = await createOrder(orderData);
            const data = response?.data;
            console.log(data);

            if (!data.success) {
                alert(data.msg || "Order creation failed");
                setLoading(false)
                return;
            }

            const options = {
                key: data.key_id,
                amount: data.amount,
                currency: "INR",
                name: data.product_name,
                description: data.description,
                image: orderData?.items[0]?.images[0],
                order_id: data.order_id,
                handler: async function (response) {
                    const verifyRes = await verifyPayment({
                        payment_id: response.razorpay_payment_id,
                        order_id: response.razorpay_order_id,
                        signature: response.razorpay_signature,
                        orderData
                    })

                    const verifyData = await verifyRes?.data

                    if (verifyData.success) {
                        setCartItems([]);
                        setLoading(false)
                        console.log(verifyData)
                        setOrderId(verifyData.orderid)
                        localStorage.removeItem("Cart");
                        setOrderStatus(true)
                    } else {
                        setLoading(false)
                        alert("❌ Payment Verification Failed");
                    }
                },
                prefill: {
                name: orderData?.user?.name,
                email: orderData?.user.email,
                contact: orderData?.user?.phone,
                },
                theme: { color: "#2300a3" },
            };
            if (!window.Razorpay) {
                setLoading(false)
                alert("Razorpay SDK failed to load. Check your internet connection.");
                return;
            }
            const rzp = new window.Razorpay(options);
            rzp.on("payment.failed", () => alert("❌ Payment Failed"));
            rzp.open();
        } catch (err) {
            setLoading(false)
            console.error("Payment error:", err);
        }
    };

    if (loading){
        return <Loading/>
    }
  return isLoading ? <CheckoutSkeleton/> : (
    <>
      <section className="min-h-screen flex justify-center bg-[#f3f3f5]">
        {orderStatus ? <OrderPage orderData={orderData}/> : 
        (<div className="checkout-section w-[1200px] relative flex gap-[30px] p-[30px] mt-[50px]">
            <div className="checkout-section-left flex flex-col gap-[30px] w-[600px]">
                <div className="flex gap-[20px] items-center">
                    <FaArrowLeft onClick={() => navigate(-1)} className="cursor-pointer text-[16px]"/>
                    <div className="flex flex-col">
                        <h3 className="text-[20px] font-semibold">Checkout</h3>
                        <p className="text-[#717182] text-[13px]">Complete your order from Apnabazaar</p>
                    </div>
                </div>
                <div className="steps flex max-w-[80vw]">
                    {[1,2,3].map((step, index) => (
                        <div key={index} className="flex items-center">
                            <div className={`w-[27px] h-[27px] text-[11px] text-[#717182] rounded-[50%] border-2 flex justify-center items-center border-[#717182] ${count>step ? "text-white bg-black border-none" : count===step ? "bg-black border-none text-white" : "bg-transparent"}`}>
                                {count>step ? "✓" : step}
                            </div>
                            {index !== [1,2,3].length - 1 && (
                                <div className={`flex-1 w-[80px] h-[2px] mx-2 bg-[#ececf0] ${count > step ? "bg-black" : "bg-[#717182]"}`}/>
                            )}
                        </div>
                        )
                    )}
                </div>
                {user?.addresses?.length > 0 ? 
                    <Addresses user={user} addNew={addNew} setaddNew={setaddNew} addressForm={addressForm} setAddressForm={setAddressForm} setCount={setCount} count={count}/> :
                    <AddressForm addressForm={addressForm} setAddressForm={setAddressForm} setCount={setCount} count={count}/>
                }
                <DeliveryOption count={count} setCount={setCount} setSelected={setSelected} selected={selected} priceDetail={priceDetail}/>
                <PaymentOptions count={count} setCount={setCount} paymentSelected={paymentSelected} setPaymentSelected={setPaymentSelected} handleCreateOrder={handleCreateOrder} loading={loading}/>
            </div>
            <OrderDetail cartItems={cartItems} priceDetail={priceDetail}/>
        </div>)}
      </section>
    </>
  )
}

export default Checkout
