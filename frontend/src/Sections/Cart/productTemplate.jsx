import { useContext, useEffect } from "react"
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa6"
import { CartProductContext } from "../../services/context"
import { useQuery } from "@tanstack/react-query"
import { getProductsById } from "../../../API/api"
import Loading from "../Loading/loading"

export const ProductTemplate = ({item}) => {
    const {cartItems, setCartItems} = useContext(CartProductContext)

    // Fetch real-time product data
    const {data, isLoading} = useQuery({
        queryKey: ["item", item?.productID],
        queryFn: () => getProductsById(item?.productID),
        select: (res) => res?.data,
        // Keep the item data in the cache even if the query is inactive
        staleTime: 5 * 60 * 1000, 
    })

    // --- Stock and Data Derivation ---
    // Use the fetched stock if available, otherwise assume the stock in the cart item (stale) or default to 0.
    // NOTE: We only use the fetched data's stock for validation. The initial render must be robust.
    const fetchedProduct = data?.product;
    const realMaxStock = fetchedProduct?.stock !== undefined ? fetchedProduct.stock : 0;
    
    // --- Data Integrity and Cart Cleanup Logic ---
    useEffect(() => {
        // 1. Skip cleanup logic if data is still loading
        if (isLoading) {
            return; 
        }

        // --- Execute Cleanup AFTER loading is complete ---

        // 2. If the product is truly out of stock, remove it.
        if (realMaxStock <= 0) {
            onDelete(item);
            return;
        }

        // 3. If cart quantity exceeds real stock, correct it.
        if (item.quantity > realMaxStock) {
            updateQuantity(item.productID, realMaxStock, true); // Silent update
            alert(`Your cart quantity for ${item.name} was reduced to the maximum available stock (${realMaxStock}).`);
        }
        
        // 4. Update other stale data (price, name, image) if they changed
        if (
            fetchedProduct && 
            (fetchedProduct.price !== item.price || 
             fetchedProduct.name !== item.name || 
             fetchedProduct.stock !== item.stock)
        ) {
             setCartItems(prevCart =>
                prevCart.map(p =>
                    p.productID === item.productID
                        ? { 
                            ...p, 
                            price: fetchedProduct.price, 
                            name: fetchedProduct.name, 
                            // Important: Update the stock in the cart state for future reference
                            stock: fetchedProduct.stock 
                          }
                        : p
                )
            );
        }
    // Dependency Array: Trigger only when loading finishes or when stock/quantity changes
    }, [isLoading, realMaxStock, item.quantity]); 

    // --- Helper Functions (No Change Needed, but using realMaxStock) ---

    const isMaxQuantity = item.quantity >= realMaxStock;
    const isMinQuantity = item.quantity === 1;

    const updateQuantity = (productId, newQty, silent = false) => {
        if (newQty > realMaxStock) {
            if (!silent) alert(`Maximum stock available is ${realMaxStock}.`);
            return;
        }
        
        setCartItems(prevCart =>
            prevCart.map(p =>
                p.productID === productId
                    ? { ...p, quantity: newQty }
                    : p
            )
        )
    };

    const onDelete = (product) => {
        const updated_cart = cartItems.filter(p => p.productID!==product.productID)
        setCartItems(updated_cart);
    }
    
    const onIncrease = (product) => {
        if (product.quantity < realMaxStock) {
            updateQuantity(product.productID, product.quantity + 1)
        } else {
            alert(`Cannot add more. Only ${realMaxStock} units available.`);
        }
    }
    
    const onDecrease = (product) => {
        if (product.quantity > 1) {
            updateQuantity(product.productID, product.quantity - 1)
        }
    }
    
    // --- Render ---
    if (isLoading){
        // Show a simple placeholder while fetching to prevent immediate rendering and removal
        return (
            <div className="p-3 w-full h-[80px] flex items-center justify-center border border-gray-200 rounded-lg">
                <Loading/>
            </div>
        );
    }
    
    // Check if the item was just removed by the cleanup effect (maxStock === 0). 
    // If it was removed, it should ideally disappear from the cartItems array 
    // on the next render loop of the parent component.
    // If it is still present (due to parent component render timing), render the stale data 
    // with a clear warning.
    
    return (
        <>
            <div className="grid gap-[10px] grid-cols-[20vw_60vw] mobile:grid-cols-[56px_210px_50px_40px] items-center justify-between border border-gray-200 rounded-lg p-3 w-full overflow-hidden">
                
                {/* Image & Name */}
                <img src={item?.images[0]} alt={item?.name} className="w-14 h-14 object-cover rounded-md"/>
                
                <div className="flex flex-col flex-1 ml-3">
                    <div className="font-semibold truncate w-[60vw] mobile:w-48">{item?.name}</div>
                    
                    {/* Stock Status and Price */}
                    {realMaxStock === 0 ? (
                        <div className="text-sm text-red-500 font-medium mt-1">
                            ❌ **Item Removed (Out of Stock)!**
                        </div>
                    ) : item.quantity > realMaxStock ? (
                        <div className="text-sm text-red-500 font-medium mt-1">
                            ⚠️ Overstock! Max: {realMaxStock}
                        </div>
                    ) : (
                        <div className="font-bold mt-1">₹{item?.price?.toFixed(2)}</div>
                    )}
                </div>
                
                <div className="flex items-center gap-2">
                    {/* Decrease Button: Disabled if quantity is 1 */}
                    <button 
                        onClick={() => onDecrease(item)} 
                        className={`border border-gray-300 rounded p-1 text-sm ${isMinQuantity ? 'cursor-not-allowed bg-gray-50' : ''}`}
                        disabled={isMinQuantity}
                    >
                        <FaMinus 
                            className={`${isMinQuantity ? "text-[#f3f3f5]" : "text-black"}`} 
                            size={12} 
                        />
                    </button>
                    
                    {/* Quantity Display */}
                    <span className={`font-semibold ${item.quantity > realMaxStock ? 'text-red-500' : ''}`}>
                        {item?.quantity}
                    </span>
                    
                    {/* Increase Button: Disabled if quantity equals maxStock or maxStock is 0 */}
                    <button 
                        onClick={() => onIncrease(item)} 
                        className={`border border-gray-300 rounded p-1 text-sm ${isMaxQuantity || realMaxStock === 0 ? 'cursor-not-allowed bg-gray-50' : 'hover:bg-gray-100'}`}
                        disabled={isMaxQuantity || realMaxStock === 0}
                    >
                        <FaPlus 
                            className={`${isMaxQuantity || realMaxStock === 0 ? "text-[#f3f3f5]" : "text-black"}`}
                            size={12} 
                        />
                    </button>
                </div>

                {/* Trash Button */}
                <button className="ml-4 text-red-600 hover:text-red-800">
                    <FaTrash onClick={() => onDelete(item)} size={16} />
                </button>
            </div>
        </>
    )
}

export default ProductTemplate