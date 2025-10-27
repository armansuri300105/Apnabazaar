import { FaArrowLeft } from "react-icons/fa6";
import "./checkout.css"
import { useContext, useEffect, useState } from "react";
import { CartProductContext } from "../../services/context";
import { useNavigate } from "react-router-dom";
import OrderDetail from "./orderDetail";
import PaymentOptions from "./paymentOptions";
import DeliveryOption from "./deliveryOption";
import AddressForm from "./addressForm";
import { createOrder, verifyPayment } from "../../../API/api"; // Note: getOrder is not used in this function
import Addresses from "./addresses";
import Loading from "../Loading/loading"
import axios from 'axios'; // Import axios if your `createOrder` and `verifyPayment` use it.

const Checkout = () => {
    const {cartItems , user, setCartItems, setCmenu } = useContext(CartProductContext)
    const [priceDetail, setPriceDetail] = useState({subtotal: "", platform_fees: "", delivery: "", total: ""});
    const [count, setCount] = useState(1);
    const [selected, setSelected] = useState(0);
    const [paymentSelected, setPaymentSelected] = useState(0);
    const [addNew, setaddNew] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [addressForm, setAddressForm] = useState({
        id: "",
        email: "",
        name: "",
        street: "",
        city: "",
        state: "",
        phone: "",
        zipcode: "",
        remember: false
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
        // Ensure backend logic for pricing is mirrored here for display
        const platform_fees = subtotal * 0.02; // 2%
        let delivery = subtotal >= 499 ? 0 : 40;
        if (selected === 1) delivery = 60; // Express delivery
        
        const total = subtotal + platform_fees + delivery
        
        setPriceDetail({
            subtotal: subtotal.toFixed(2),
            platform_fees: platform_fees.toFixed(2),
            delivery: delivery === 0 ? "Free Delivery" : `₹${delivery}`,
            total: total.toFixed(2) // Ensure total is also a number for accurate math or use toFixed(2)
        })
    },[cartItems, selected])

    const handleCreateOrder = async (e) => {
        e.preventDefault();
        setCmenu(false);
        setLoading(true);

        if (cartItems?.length <= 0) {
            alert("Cart Should Not be Empty");
            setLoading(false);
            return;
        }

        if (!user) {
            alert("User not logged in.");
            setLoading(false);
            return;
        }

        const orderData = {
            user,
            items: cartItems,
            shippingAddress: addressForm,
            deliveryMethod: selected === 0 ? "Standard" : "Express",
            paymentMethod: paymentSelected === 0 ? "ONLINE" : "COD",
        };

        // Helper function to extract and display the error message
        const displayApiError = (error, defaultMsg) => {
            // This is the common way to extract error message from an Axios response
            const serverMessage = error.response?.data?.message || defaultMsg;
            alert(`Order Failed: ${serverMessage}`);
            console.error(error);
        }

        // --- COD Payment Logic (Stock Check & Order Save happens here) ---
        if (paymentSelected === 1) {
            try {
                const response = await createOrder(orderData);
                const data = response?.data;

                if (!data?.success) {
                    // This is for a non-HTTP 2xx failure (e.g., if API returns {success: false, msg: "..."})
                    alert(data.msg || "Order creation failed (COD)");
                    return;
                }
                
                // Success
                setCartItems([]);
                localStorage.removeItem("Cart");
                navigate(`/checkout/order/${data?.orderid}`);

            } catch (err) {
                displayApiError(err, "Failed to create COD order due to server error or insufficient stock.");
            } finally {
                setLoading(false);
            }
            return;
        }
        
        // --- ONLINE Payment Logic (Razorpay Order Creation) ---
        if (paymentSelected === 0) {
            try {
                // 1. Initial Order Creation (Performs initial stock check)
                const response = await createOrder(orderData);
                const data = response?.data;

                if (!data?.success) {
                    // This catches backend logic failures (e.g. initial stock check failed)
                    alert(data.msg || "Order creation failed (ONLINE Pre-check)");
                    setLoading(false);
                    return;
                }

                // 2. Open Razorpay Checkout
                const options = {
                    key: data.key_id,
                    amount: data.amount, // amount in paise
                    currency: "INR",
                    name: "Apnabazaar", // Use a generic name if product_name isn't reliable
                    description: "Order Payment",
                    // image: orderData?.items[0]?.images[0], // Optional, remove if causing errors
                    order_id: data.order_id,
                    handler: async function (response) {
                        setLoading(true); // Re-engage loading state for verification step
                        try {
                            // 3. Payment Verification (Performs final atomic stock check and order save)
                            const verifyRes = await verifyPayment({
                                payment_id: response.razorpay_payment_id,
                                order_id: response.razorpay_order_id,
                                signature: response.razorpay_signature,
                                orderData // Pass the full order data for verification
                            });

                            const verifyData = verifyRes?.data;
                            
                            if (verifyData?.success) {
                                setCartItems([]);
                                localStorage.removeItem("Cart");
                                navigate(`/checkout/order/${verifyData.orderid}`);
                            } else {
                                // This catches signature verification failure or custom API errors (e.g. after-payment stock fail)
                                alert(`❌ Payment Verification Failed: ${verifyData.message || 'Unknown error.'}`);
                            }
                        } catch (err) {
                            displayApiError(err, "Failed to verify payment or stock sold out after payment. Please contact support.");
                        } finally {
                            setLoading(false); // Disable loading whether verification succeeds or fails
                        }
                    },
                    prefill: {
                        name: orderData?.user?.name || user.name,
                        email: orderData?.user?.email || user.email,
                        contact: orderData?.user?.phone || user.phone,
                    },
                    theme: { color: "#2300a3" },
                };
                
                if (!window.Razorpay) {
                    alert("Razorpay SDK failed to load. Check your internet connection.");
                    return;
                }

                const rzp = new window.Razorpay(options);
                
                // Handle payment window close/failure
                rzp.on("payment.failed", (response) => {
                    // This event fires if the user closes the window or payment fails
                    alert(`❌ Payment Failed: ${response.error.description}`);
                });

                rzp.open();
                
            } catch (err) {
                // Catches error from `createOrder` API call (e.g., 400 Insufficient Stock)
                displayApiError(err, "Failed to initiate payment or check stock.");
            } finally {
                setLoading(false); // Stop loading after Razorpay is opened or an error occurs before it.
            }
        }
    };

    if (loading){
        return <Loading/>
    }
    
    // ... rest of the component remains the same
    return (
    <>
      <section className="min-h-screen flex justify-center bg-[#f3f3f5]"> 
        <div className="checkout-section w-[1200px] relative flex gap-[30px] ml-[30px] mt-[50px] justify-center">
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
        </div>
      </section>
    </>
  )
}

export default Checkout