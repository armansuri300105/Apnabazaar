export default function Itemsordered({orderData}) {
  const getSubtotal = (items) => {
    let subtotal = 0;
    for (let i=0;i<items?.length;i++){
      subtotal += items[i]?.price
    }
    return subtotal; 
  }
  const delivery = (method, subtotal) => {
    if (method === "Express") return 60;
    return subtotal > 499 ? 0 : 40;
  }

  const subtotal = getSubtotal(orderData?.items);
  const tax = subtotal * 0.02;
  const deliveryCharge = delivery(orderData?.deliveryMethod, subtotal);
  const total = subtotal + tax + deliveryCharge;

  return (
    <div className="w-full mx-auto bg-white shadow rounded-xl p-4 mb-10">
      <h2 className="text-lg font-semibold mb-4">Items Ordered</h2>
      {
        orderData?.items?.map((item, index) => (
          <div key={index} className="flex items-center justify-between border rounded-lg p-3">
            <div className="flex items-center gap-3">
              <img
                src={item?.product?.images[0]}
                alt={item?.product?.name}
                className="w-14 h-14 rounded-md object-cover"
              />
              <div>
                <p className="font-medium">{item?.product?.name}</p>
                <p className="text-sm text-gray-500"></p>
                <p className="text-sm text-gray-600">Quantity: {item?.quantity} &nbsp; {item?.product?.price} each</p>
              </div>
            </div>
            <p className="font-medium">₹{item?.product?.price*item?.quantity}</p>
          </div>
        ))
      }
      
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span>{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tax</span>
          <span>{tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Delivery</span>
          <span>{deliveryCharge}</span>
        </div>
        <hr />
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
