import { Eye, Package, Search } from "lucide-react";
import "./checkout.css"
import { getOrders } from "../../../API/api";
import { useState } from "react";
import dayjs from "dayjs";
import { FaChevronDown } from "react-icons/fa";
import {useQuery} from "@tanstack/react-query"
import OrdersSkeleton from "./Skeletons/ordersSkeleton";
import {NavLink} from "react-router-dom"

const Orders = ({user}) => {
    const [filter, setFilter] = useState("All")
    const [year, setYear] = useState("2025")

    const {data: orders, isLoading} = useQuery({
        queryKey: ["orders"],
        queryFn: getOrders,
        select: (res) => (res?.data?.orders) || []
    })
  return isLoading ? <OrdersSkeleton/> : (
    <section className="flex flex-col items-center">
        <div className="orders-page relative w-[1190px] mt-[120px] mb-[100px]">
            <div className="w-full mb-[20px]">
                <div className="px-2">
                    <h2 className="text-2xl font-semibold">Order History</h2>
                    <p className="text-gray-500 text-sm">
                    Track your orders and view your purchase history
                    </p>
                </div>

                <div className="orders-section-filters flex items-center gap-2 bg-white border rounded-2xl shadow-sm p-2 m-2">
                    <div className="relative">
                        <select onChange={(e) => setFilter(e.target.value)} className="bg-gray-100 text-sm w-[100px] rounded-md px-4 appearance-none py-2 focus:outline-none">
                            <option value={"All"}>All Orders</option>
                            <option value={"processing"}>Processing</option>
                            <option value={"pending"}>Pending</option>
                            <option value={"shipped"}>Shipped</option>
                            <option value={"delivered"}>Delivered</option>
                            <option value={"cancelled"}>Cancelled</option>
                        </select>
                        <FaChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"/>
                    </div>
                    <div className="relative">
                        <select onChange={(e) => setYear(e.target.value)} className="bg-gray-100 text-sm w-[100px] rounded-md px-4 appearance-none py-2 focus:outline-none">
                            {Array.from(
                                { length: new Date().getFullYear() - new Date(user?.createdAt).getFullYear() + 1 },
                                (_, i) => new Date(user?.createdAt).getFullYear() + i
                            )
                            .reverse()
                            .map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                            ))}
                        </select>
                        <FaChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"/>
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-col gap-4 items-center relative">
                {orders?.filter(order => {
                    const orderYear = new Date(order.createdAt).getFullYear();
                    const matchesStatus = filter === "All" || order.orderStatus === filter;
                    const matchesYear = orderYear === Number(year);
                    return matchesStatus && matchesYear;
                })
                ?.slice().reverse().map((order, index) => (
                    <div key={index} className="w-[100%] bg-white shadow-md rounded-xl p-4 flex flex-col gap-3 border" >
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <div>
                                <h2 className="text-sm font-semibold">{order?.orderId}</h2>
                                <p className="text-xs text-gray-500">Ordered on {dayjs(order?.createdAt).format("DD MMM YYYY, hh:mm A")}</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <Package className="w-5 h-5 text-gray-600" />
                                <span>₹{order?.totalAmount}</span>
                            </div>
                        </div>

                        <div className="flex gap-[10px] flex-wrap">
                            {
                                order?.items?.map((item, index) => {
                                    return <img key={index} src={item?.product?.images[0]} alt="item" className="w-14 h-14 rounded-md object-cover" />
                                })
                            }
                        </div>

                        <div className="orders-detail-section-2 flex justify-between">
                            <p className="text-sm text-gray-600">
                                {order?.items?.length} item{order?.items?.length > 1 ? "s" : ""}{" "}
                                <span className="mx-1">•</span> Expected {new Date(new Date(order?.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000).toDateString()}
                            </p>
                            <div className="flex justify-end">
                                <NavLink to={`/orders/${order?.orderId}`}><button className="flex items-center gap-1 text-sm font-medium text-gray-700 border px-3 py-1.5 rounded-md hover:bg-gray-50">
                                    <Eye width={17}/> View Details
                                </button></NavLink>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    </section>)
}

export default Orders
