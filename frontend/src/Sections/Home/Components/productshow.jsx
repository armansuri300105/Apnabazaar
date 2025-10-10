import { useContext } from "react";
import { FaStar } from "react-icons/fa6";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { CartProductContext } from "../../../services/context";
import { NavLink } from "react-router-dom";
import { Star } from "lucide-react";

export const ProductShow= ({product}) =>{
    const {cartItems, setCartItems, setDataForMl } = useContext(CartProductContext)
    const updateQuantity = (productId, newQty) => {
        setCartItems(prevCart =>
            prevCart.map(item =>
            item.id === productId
                ? { ...item, quantity: newQty }
                : item
            )
        )
    }

    const handleAddtoCart = (product) => {
        for (let i=0;i<cartItems.length;i++){
            if (cartItems[i]._id === product._id){
                updateQuantity(cartItems[i].id, cartItems[i].quantity+1)
                return;
            }
        }
        product["quantity"] = 1;
        setCartItems(prev => [...prev, product])
    }

    const handleClickedData = () => {
        setDataForMl(prev => ({
            ...prev,
            currentView: {
                product: {
                    productID: product._id,
                    category: product?.category,
                    name: product?.name
                },
                startTime: Date.now(),
            },
        }));
    }

    return (
    <NavLink onClick={handleClickedData} to={`/productdetail/${product.productID && product._id}`}><div className="cursor-pointer border-solid relative border-[1px] border-grey-100 group h-[483px] bg-white w-[256px] rounded-xl hover:shadow-lg">
        <div className="h-[256px] w-[256px] rounded-t-xl overflow-hidden bg-black">
            <img className="object-cover w-[100%] h-[100%] transition-all group-hover:scale-[107%] duration-180 " src={product.images[0]} />
        </div>
        <div className="grid gap-[10px] mt-6 p-[14px]">
            <div className="text-[20px] truncate">{product.name} </div>
            <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} className={i < Math.floor(product?.ratings?.average) ? "fill-yellow-500 text-yellow-500" : "text-gray-300"} />
                ))}
                <span className="text-sm text-gray-500">
                {product?.ratings?.average} ({product?.reviews.length} reviews)
                </span>
            </div>
            <div className="w-fit px-[5px] text-[13px] p-[3px] rounded-md border-solid border-[1px] flex justify-center items-center border-black-200">{product?.category}</div>
            <div className="absolute bottom-[20px] w-[90%]">
                <div className="flex justify-between ">
                    <div className="flex items-center">
                        <FaIndianRupeeSign className="text-[13px]"/>
                        <p>{product.price}</p>
                    </div>
                    <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddtoCart(product); }} className="cursor-pointer flex justify-center items-center h-7 w-8 rounded-lg bg-black hover:scale-90">
                        <FaPlus className="text-white"/>
                    </div>
                </div>
            </div>
        </div>
    </div></NavLink>)
}