import { useEffect, useState } from "react";
import { CiDeliveryTruck } from "react-icons/ci";
import "./checkout.css"

const AddressForm = ({ addressForm, setAddressForm, setCount, count }) => {
    const [showbtn, setShowbtn] = useState(false);
    const [check, setCheck] = useState(false);
    useEffect(() => {
        if (addressForm.email==="" || addressForm.name==="" || addressForm.street==="" || addressForm.city==="" || addressForm.state==="" || addressForm.phone==="" || addressForm.zipcode===""){
            setShowbtn(false);
        } else {
            setShowbtn(true);
        }
    },[addressForm])
    const handleChangeForm = (e) => {
        const {name, type, checked, value} = e.target;
        setAddressForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }))
    }
    const handleAddressForm = (e) => {
        e.preventDefault();
        if (isValidEmail(addressForm.email)){
            setCheck(false)
        } else {
            setCheck(true);
            return;
        }
        console.log(addressForm);
        setCount(2);
    }
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    console.log(count)
  return (
    <>
        <div className={` ${count!==1 ? "cursor-not-allowed" : ""} checkout-section-left bg-white w-[600px] relative rounded-md border-2`}>
            <div className="flex justify-between p-[20px] items-center">
                <div className="flex gap-[8px] items-center">
                    <CiDeliveryTruck className="text-[17px]"/>
                    <p>Shipping Information</p>
                </div>
            </div>
            <form className={`px-[20px] flex flex-col gap-[15px] pb-[20px] w-[100%]`}>
                <div className="flex flex-col gap-[5px]">
                    <label className="text-[12px] font-medium ml-[5px]" htmlFor="email">Email</label>
                    <input disabled={count===1 ? false : true} type="email" name="email" value={addressForm.email} onChange={handleChangeForm} placeholder="your@gmail.com" className="w-[100%] h-[30px] rounded-sm px-[10px] bg-[#f3f3f5]"/>
                    <p className={`${check ? "block" : "hidden"} text-[10px] text-red-700 ml-[3px] font-medium`}>Enter a valid email</p>
                </div>
                <div className="flex flex-col gap-[5px]">
                    <label className="text-[12px] font-medium ml-[5px]" htmlFor="text">Full Name</label>
                    <input disabled={count===1 ? false : true} name="name" value={addressForm.name} onChange={handleChangeForm} className="w-[100%] h-[30px] rounded-sm px-[10px] bg-[#f3f3f5]" type="text"/>
                </div>
                <div className="flex flex-col gap-[5px]">
                    <label className="text-[12px] font-medium ml-[5px]" htmlFor="text">Street</label>
                    <input disabled={count===1 ? false : true} name="street" value={addressForm.street} onChange={handleChangeForm} className="w-[100%] h-[30px] rounded-sm px-[10px] bg-[#f3f3f5]" type="text"/>
                </div>
                <div className="flex justify-between w-[100%] gap-[5px]">
                    <div className="flex flex-col w-[100%]">
                        <label className="text-[12px] font-medium ml-[5px]" htmlFor="text">City</label>
                        <input disabled={count===1 ? false : true} name="city" value={addressForm.city} onChange={handleChangeForm} className="w-[100%] h-[30px] rounded-sm px-[10px] bg-[#f3f3f5]" type="text"/>
                    </div>
                    <div className="flex flex-col w-[100%]">
                        <label className="text-[12px] font-medium ml-[5px]" htmlFor="text">State</label>
                        <input disabled={count===1 ? false : true} name="state" value={addressForm.state} onChange={handleChangeForm} className="w-[100%] h-[30px] rounded-sm px-[10px] bg-[#f3f3f5]" type="text"/>
                    </div>
                    <div className="flex flex-col w-[100%]">
                        <label className="text-[12px] font-medium ml-[5px]" htmlFor="text">Zip Code</label>
                        <input disabled={count===1 ? false : true} name="zipcode" value={addressForm.zipcode} onChange={handleChangeForm} className="w-[100%] h-[30px] rounded-sm px-[10px] bg-[#f3f3f5]" type="number"/>
                    </div>
                </div>
                <div className="flex flex-col gap-[5px]">
                    <label className="text-[12px] font-medium ml-[5px]" htmlFor="phone">Phone</label>
                    <input disabled={count===1 ? false : true} name="phone" value={addressForm.phone} onChange={handleChangeForm} className="w-[100%] h-[30px] rounded-sm px-[10px] bg-[#f3f3f5]" type="number"/>
                </div>
                <div className="flex items-center gap-2">
                    <input disabled={count===1 ? false : true} type="checkbox" name="remember" checked={addressForm.remember || false} onChange={handleChangeForm}/>
                    <label className="text-sm text-gray-600">Remember me for next time</label>
                </div>
                {count===1 ? <button disabled={showbtn || count!==1 ? false : true} onClick={handleAddressForm} className={`w-[100%] h-[35px] rounded-sm text-white text-[12px] ${showbtn ? "bg-black" : "bg-gray-500"}`}>{"Continue to Delivery"}</button> : ""}
            </form>
        </div>
    </>
  )
}

export default AddressForm
