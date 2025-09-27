import { MdOutlinePayment } from "react-icons/md";
import "./checkout.css"

const PaymentOptions = ({count, paymentSelected, setPaymentSelected, handleCreateOrder, setCount, loading}) => {
  return (
    <>
        <div className={`checkout-section-left w-[600px] rounded-md bg-white overflow-hidden duration-200 ease-linear transition-all ${count>=3 ? "h-[190px] p-[20px] border-2" : "h-0"}`}>
            <div className="flex items-center pb-[20px] gap-[7px]">
                <MdOutlinePayment className="text-[18px]"/>
                <p className="text-[14px]">Payment Options</p>
            </div>
            <ul className="flex gap-[20px]">
                <li onClick={() => setPaymentSelected(0)} className={`w-[100%] text-[12px] p-[10px] flex justify-between items-center rounded-md border-2 bg-transparent ${paymentSelected===0 ? "border-black" : ""}`}>
                    Online Payment
                </li>
                <li onClick={() => setPaymentSelected(1)} className={`w-[100%] text-[12px] p-[10px] flex justify-between items-center rounded-md border-2 bg-transparent ${paymentSelected===1 ? "border-black" : ""}`}>
                    Cash On Delivery
                </li>
            </ul>
            <div className="flex justify-between pt-[20px]">
                <button onClick={() => setCount(2)} className="w-[100px] back-btn h-[35px] border-2 border-black bg-transparent text-[12px] rounded-sm">Back</button>
                <button onClick={handleCreateOrder} className={`w-[80%] continue-btn h-[35px] text-white rounded-sm text-[12px] ${loading ? "bg-gray-400" : "bg-black"}`}>{loading ? "Proccessing...." : paymentSelected===0 ? "Make Payment" : paymentSelected===1 ? "Place Order" : ""}</button>
            </div>
        </div>
    </>
  )
}

export default PaymentOptions
