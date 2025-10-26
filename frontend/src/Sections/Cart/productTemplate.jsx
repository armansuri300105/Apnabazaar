import { useContext } from "react"
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa6"
import { CartProductContext } from "../../services/context"

export const ProductTemplate = ({item}) => {
    const {cartItems, setCartItems} = useContext(CartProductContext)

    const updateQuantity = (productId, newQty) => {
        setCartItems(prevCart =>
            prevCart.map(item =>
            item.productID === productId
                ? { ...item, quantity: newQty }
                : item
            )
        )
    };

    const onDelete = (product) => {
        const updated_cart = cartItems.filter(p => p.productID!==product.productID)
        setCartItems(updated_cart);
    }
    const onIncrease = (product) => {
        updateQuantity(product.productID, product.quantity+1)
    }
    const onDecrease = (product) => {
        updateQuantity(product.productID, product.quantity-1)
    }
  return (
    <>
        <div className="grid gap-[10px] grid-cols-[20vw_60vw] mobile:grid-cols-[56px_210px_50px_40px] items-center justify-between border border-gray-200 rounded-lg p-3 w-full overflow-hidden">
            <img src={item?.images[0]} alt={item?.name} className="w-14 h-14 object-cover rounded-md"/>
            <div className="flex flex-col flex-1 ml-3">
                <div className="font-semibold truncate w-[60vw] mobile:w-48">{item?.name}</div>
                <div className="font-bold mt-1">₹{item?.price?.toFixed(2)}</div>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={() => onDecrease(item)} className={`border border-gray-300 rounded p-1 text-sm`} disabled={item.quantity===1 ? true : false}>
                    <FaMinus className={`${item.quantity===1 ? "text-[#f3f3f5]" : "text-black"}`} size={12} />
                </button>
                <span>{item?.quantity}</span>
                <button onClick={() => onIncrease(item)} className="border border-gray-300 rounded p-1 text-sm">
                    <FaPlus size={12} />
                </button>
            </div>

            <button className="ml-4 text-red-600 hover:text-pink-800">
                <FaTrash onClick={() => onDelete(item)} size={16} />
            </button>
        </div>
    </>
  )
}

export default ProductTemplate
