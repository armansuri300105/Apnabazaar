import Itemsordered from "./Parts/Itemsordered"
import { ArrowRight } from "lucide-react";
import OrderDetails from "./Parts/OrderDetails"
import Shipping from "./Parts/Shipping"
import "./checkout.css"
import { useNavigate } from "react-router-dom";

const OrderPage = ({orderData}) => {
  const navigate = useNavigate();
  return (
    <section className="flex justify-center bg-gray-100">
      <div className="order-section flex flex-col w-[800px] relative flex-wrap pt-10">

        <div className="flex flex-col items-center justify-center px-4 py-8 max-w-xl mx-auto text-center">
          <div className="h-20 flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="green"
              className="w-16 h-16 sm:w-20 sm:h-20 bg-green-200 rounded-full"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>

          <div className="my-4 text-green-600 font-semibold text-lg sm:text-xl md:text-2xl">
            Order Confirmed!
          </div>

          <div className="text-gray-600 text-sm sm:text-base md:text-lg mb-6">
            Thank you for your order. We'll send you shipping confirmation when your order ships.
          </div>
        </div>

        <div className="flex w-full flex-wrap justify-center gap-[4%] my-6">
          <OrderDetails orderData={orderData}/>
          <Shipping orderData={orderData}/>
        </div>
        <Itemsordered orderData={orderData}/>
        <div className="flex gap-4 justify-center mb-6">
          <button onClick={() => navigate('/')} className="px-6 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-800 hover:bg-gray-100">Continue Shopping</button>
          <button onClick={() => navigate('/orders')} className="px-6 py-2 rounded-md bg-black text-white text-sm font-medium flex items-center gap-2 hover:bg-gray-900">View Order History <ArrowRight className="w-4 h-4" /></button>
        </div>
      </div>
    </section>
  )
}

export default OrderPage
