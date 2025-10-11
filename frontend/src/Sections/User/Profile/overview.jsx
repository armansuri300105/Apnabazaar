import { Package } from "lucide-react";
import { getOrders } from "../../../../API/api";
import dayjs from "dayjs"
import { useNavigate } from "react-router-dom";
import {useQuery} from "@tanstack/react-query"

const Overview = ({user}) => {
    const navigate = useNavigate()

    const {data: orders, isLoading} = useQuery({
        queryKey: ["orders"],
        queryFn: getOrders,
        select: (res) => (res?.data?.orders) || []
    })
    if (isLoading) return (<p>Loading....</p>)
    const min = (a,b) => {
        return a>b ? b : a
    }

    console.log(orders)
  return (
    <>
        <div className="w-full">
            <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="flex items-center gap-2 font-semibold text-lg mb-4">
                <Package size={18} /> Recent Orders
                </h3>

                <div className="space-y-4">
                    {
                        orders?.slice(0,min(5,orders.length)).map((order, index) => (
                            <div key={index} className="flex justify-between items-center p-4 bg-[#ececf0] rounded-lg">
                                <div>
                                    <p className="font-medium">{order?.orderId}</p>
                                    <div className="text-sm flex gap-[7px]"><p className="text-gray-500">{dayjs(order?.createdAt).format("DD MMM YYYY, hh:mm A")}</p><p className="text-black italic">₹{order?.totalAmount}</p></div>
                                </div>
                                <span className="px-3 py-1 border text-sm rounded-md border-gray-500 bg-green-100 text-blue-600 font-medium">{order?.orderStatus}</span>
                            </div>
                        ))
                    }
                </div>

                <button onClick={() => navigate('/orders')} className="w-full mt-4 py-2 border rounded-lg hover:bg-gray-100 transition">View All Orders</button>
            </div>
        </div>
    </>
  )
}

export default Overview
