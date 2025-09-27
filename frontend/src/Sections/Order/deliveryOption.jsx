import { HiOutlineTruck } from "react-icons/hi";
import "./checkout.css"

const DeliveryOption = ({count, setCount, setSelected, selected, priceDetail}) => {
    const deliveryOptions = [
            {title: "Standard Delivery", time: "3-5 bussiness days", price: 40},
            {title: "Express Delivery", time: "Next bussiness day", price: 60}
        ]
    return (
        <>
            <div className={`checkout-section-left w-[600px] rounded-md bg-white overflow-hidden duration-200 ease-linear transition-all ${count>=2 ? "h-[280px] p-[20px] border-2" : "h-0"}`}>
                <div className="flex items-center pb-[20px] gap-[7px]">
                    <HiOutlineTruck className="text-[18px]"/>
                    <p className="text-[14px]">Delivery Options</p>
                </div>
                <ul className="flex flex-col gap-[20px]">
                    {
                        deliveryOptions.map((option, index) => {
                            return (
                                <button disabled={count===2 ? false : true} key={index} onClick={() => setSelected(index)} className={`${count===2 ? "cursor-pointer" : "cursor-not-allowed"} w-[100%] p-[10px] flex justify-between items-center rounded-md border-2 bg-transparent ${selected===index ? "border-black" : ""}`}>
                                    <div className="flex flex-col">
                                        <h3 className="text-[13px] font-medium">{option.title}</h3>
                                        <p className="text-[11px] text-[#717182]">{option.time}</p>
                                    </div>
                                    <p className="text-[15px]">{(index===0 && priceDetail?.subtotal>499) ? "Free" : `₹${option.price}`}</p>
                                </button>
                            )
                        })
                    }
                </ul>
                {count===2 ? <div className="flex justify-between pt-[20px]">
                    <button disabled={count===2 ? false : true} onClick={() => setCount(1)} className={`back-btn w-[100px] h-[35px] border-2 border-black bg-transparent text-[12px] rounded-sm`}>Back</button>
                    <button disabled={count===2 ? false : true} onClick={() => setCount(3)} className={`continue-btn w-[80%] h-[35px] bg-black text-white rounded-sm text-[12px]`}>Continue to Payment</button>
                </div> : ""}
            </div>
        </>
    )
}

export default DeliveryOption
