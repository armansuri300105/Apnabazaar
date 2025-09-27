import "./checkout.css"

const OrderDetail = ({cartItems, priceDetail}) => {
  return (
    <>
        <div className="orderdetail sticky top-[50px] bg-white border-2 w-[500px] flex flex-col gap-[20px] p-[20px] h-fit rounded-md">
            <p>Order Summary</p>
            {
                cartItems.map((item, index) => {
                    return (
                        <div key={index} className="grid h-[70px] grid-cols-[15%_65%_10%] items-center gap-[10px] p-[5px] border-2 border-dotted rounded-md">
                            <img className="w-[60px] h-[60px] rounded-md" src={item?.images[0]} alt="" />
                            <div className="flex flex-col">
                                <p>{item?.name}</p>
                                <p className="text-[#717182]">₹{item?.price} each</p>
                            </div>
                            <p>₹{item.price*item?.quantity}</p>
                        </div>
                    )
                })
            }
            <div className="flex flex-col gap-[7px] w-[100%] border-t-2 border-[#ececf0] border-b-2 py-[7px]">
                <div className="flex justify-between items-center">
                    <p>Subtotal</p>
                    <p>₹{priceDetail?.subtotal}</p>
                </div>
                <div className="flex justify-between items-center">
                    <p>Platform Fees</p>
                    <p>₹{priceDetail?.platform_fees}</p>
                </div>
                <div className="flex justify-between items-center">
                    <p>Delivery</p>
                    <p>{priceDetail?.delivery}</p>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <p>Total</p>
                <p>₹{priceDetail?.total}</p>
            </div>
        </div>
    </>
  )
}

export default OrderDetail
