import { useContext, useEffect, useState } from "react";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { CartProductContext } from "../../../services/context";
import { NavLink } from "react-router-dom";
import { Star } from "lucide-react";
import CartPopup from "../../Product/cartPopUp";
import {optimizeImage} from "../../../services/optimizeImage"
import '../home.css'

export const ProductShow= ({product}) =>{
    const {cartItems, setCartItems, setDataForMl } = useContext(CartProductContext)
    const [popUp, setPopUp] = useState(false);
    
    // Determine if the product is out of stock
    const isOutOfStock = (product?.stock !== undefined && product.stock <= 0) || 
    (product?.stock === undefined && !product?.inStock);

    const updateQuantity = (productId, newQty) => {
        setCartItems(prevCart =>
            prevCart.map(item =>
            item.productID === productId
                ? { ...item, quantity: newQty }
                : item
            )
        )
    }

    useEffect(() => {
        if (popUp) {
        const timer = setTimeout(() => {
            setPopUp(false);
        }, 2000);
        return () => clearTimeout(timer);
        }
    }, [popUp]);
    

    const handleAddtoCart = (product) => {
        // Prevent adding to cart if out of stock
        if (isOutOfStock) return; 
        
        for (let i=0;i<cartItems.length;i++){
            // Assuming productID and _id are interchangeable for product identification based on your existing logic
            if (cartItems[i]?.productID === (product?.productID || product?._id)){
                updateQuantity(cartItems[i].productID, cartItems[i].quantity+1)
                setPopUp(true);
                return;
            }
        }
        
        // Use the correct ID when adding a new item
        const newProduct = { 
            ...product,
            productID: product.productID || product._id,
            quantity: 1 
        };
        setCartItems(prev => [...prev, newProduct]);
        setPopUp(true);

        setDataForMl(prev => {
        const updated = {
            ...prev,
            products: [
            ...(prev.products || []),
            {
                product: {
                    productID: newProduct?.productID,
                    category: newProduct?.category,
                    name: newProduct?.name
                },
                time: new Date(Date.now()).toLocaleString(),
                duration: 0,
                event: { type: "add_to_cart", time: new Date(Date.now()).toLocaleString() },
            },
            ],
        };

        localStorage.setItem("interaction", JSON.stringify(updated));
        return updated;
        });
    }

    const handleClickedData = () => {
        // Prevent tracking click if out of stock
        if (isOutOfStock) return; 

        const newView = {
            product: {
            productID: product.productID || product._id,
            category: product?.category,
            name: product?.name,
            },
            startTime: Date.now(),
        };

        setDataForMl(prev => {
            const updated = {
            ...prev,
            currentView: newView,
            };

            localStorage.setItem("interaction", JSON.stringify(updated));

            return updated;
        });
    };
    
    // --- Render Logic ---
    const productCardContent = (
        <div 
            className={`product-cart-component cursor-pointer border-solid relative border-[1px] border-grey-100 group h-[483px] bg-white w-[256px] rounded-xl hover:shadow-lg ${isOutOfStock ? 'grayscale opacity-60 pointer-events-none' : ''}`}
        >
            <div className="h-[254px] w-full rounded-t-xl overflow-hidden bg-black relative">
                <img
                    decoding="async"
                    loading="lazy"
                    className="object-cover w-[100%] h-[100%] transition-all group-hover:scale-[107%] duration-180 " 
                    src={optimizeImage(product.images[0], 260, 260)}
                />
                {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-600 bg-opacity-70">
                        <span className="text-white text-xl font-bold tracking-wider uppercase">Out of Stock</span>
                    </div>
                )}
            </div>
            <div className="grid gap-[10px] mt-6 p-[14px]">
                <div className="text-[20px] truncate">{product.name} </div>
                <div className="product-card-component-rating flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        {[...Array(5)].map((_, i) => (
                        <Star key={i} size={18} className={i < Math.floor(product?.ratings?.average) ? "fill-yellow-500 text-yellow-500" : "text-gray-300"} />
                        ))}
                    </div>
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
                        
                        {/* Conditional Add to Cart Button */}
                        <div 
                            onClick={isOutOfStock ? (e) => { e.preventDefault(); e.stopPropagation(); } : (e) => { e.preventDefault(); e.stopPropagation(); handleAddtoCart(product); }}
                            className={`cursor-pointer flex justify-center items-center h-7 w-auto px-2 min-w-8 rounded-lg ${isOutOfStock ? 'bg-gray-500 cursor-not-allowed' : 'bg-black hover:scale-90'}`}
                        >
                            {isOutOfStock ? (
                                <span className="text-white text-xs font-semibold">Sold Out</span>
                            ) : (
                                <FaPlus className="text-white"/>
                            )}
                        </div>
                    </div>
                </div>
                <CartPopup show={popUp} message="Product added to cart!" />
            </div>
        </div>
    );


    // Conditionally wrap the card in NavLink
    if (isOutOfStock) {
        return (
            <div 
                className="pointer-events-none" // Ensure the wrapper is unclickable
            >
                {productCardContent}
            </div>
        );
    }

    return (
        <NavLink onClick={handleClickedData} to={`/productdetail/${product.productID || product._id}`}>
            {productCardContent}
        </NavLink>
    );
}