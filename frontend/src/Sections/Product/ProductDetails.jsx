// This file creates the detailed product page showing all information about a single product

// Import necessary tools and icons
import { useContext, useEffect, useState } from "react";
import { HiOutlineTruck } from "react-icons/hi";           // Delivery truck icon
import { Star } from "lucide-react";                       // Rating star icon
import { Heart } from "lucide-react";                      // Wishlist heart icon
import { FaArrowLeft } from "react-icons/fa6";            // Back navigation arrow
import { MdOutlineShare } from "react-icons/md";          // Share button icon

// Navigation and API functions
import { useNavigate, useParams } from "react-router-dom";
import { deleteWishlist, getProductsById, updateWishlist } from "../../../API/api";
import { CartProductContext } from "../../services/context";

// Import sub-components for different sections
import "./productDetail.css"
import Detail from "./detail";              // Product specifications
import Vendor from "./vendor";              // Seller information
import Reviews from "./reviews";            // Customer reviews
import CartPopup from "./cartPopUp";        // Added to cart notification
import { ProductShow } from "../Home/Components/productshow";  // Similar products

// Loading state components
import ProductDetailSkeleton from "./productDetailSkeleton";
import FavoritesSkeleton from "../User/Profile/Skeletons/favoritesSkeleton"

// Data fetching tools
import {useQuery} from "@tanstack/react-query"
import { userSearchMl } from "../../../API/ml";  // Machine learning product recommendations

// Main product details page component
const ProductDetails = () => {
  // Get cart and user data from global state
  const {user, cartItems, setCartItems, setCmenu, dataForMl, setDataForMl} = useContext(CartProductContext)
  
  // Local state for product interaction
  const [wishlist, setWishlist] = useState(false);         // Wishlist status
  const [quantity, setQuantity] = useState(1);             // Quantity to buy
  const [btn, setBtn] = useState("Add to Cart")            // Cart button text
  const [select, setSelect] = useState(0)                  // Selected tab (details/reviews)
  const [selectedImage, setSelectedImage] = useState(null); // Current product image
  const [popUp, setPopUp] = useState(false);               // Cart notification
  
  // Navigation setup
  const navigate = useNavigate();
  const param = useParams();
  const Productid = param?.Productid
  
  // Fetch product details from server
  const {data: product, isLoading, refetch} = useQuery({
    queryKey : ["showproduct", Productid],
    queryFn: () => getProductsById(Productid),
    select: (res) => (res?.data?.product) || [],
    enabled: !!Productid,
  })

  // Get product recommendations based on machine learning
  const {data: mlprd, mlLoading} = useQuery({
    queryKey: [`mlprd`, Productid],
    queryFn: () => userSearchMl(product?.name),
    select: (res) => res?.data,
    enabled: !!product?.name
  })

  // Set first product image as default when data loads
  useEffect(() => {
    if (product?.images?.length > 0) {
      setSelectedImage(product.images[0]);
    }
  },[product])

  useEffect(() => {
      if (popUp) {
        const timer = setTimeout(() => {
        setPopUp(false);
      }, 2000);
      return () => clearTimeout(timer);
      }
  }, [popUp]);

  useEffect(() => {
    const check = user?.wishlist?.includes(Productid)
    check ? setWishlist(true) : setWishlist(false);
  },[user, param?.Productid])

  useEffect(() => {
    const product = cartItems.filter(p => p._id === Productid)
    product.length===0 ? setBtn("Add to Cart") : setBtn("Go to Cart")
    console.log(product)
  },[cartItems, Productid])

  useEffect(() => {
    return () => {
      if (dataForMl?.currentView?.product){
        const duration = Date.now() - dataForMl.currentView.startTime;

        setDataForMl(prev => {
          const updated = {
            ...prev,
            products: [
              ...(prev.products || []),
              {
                product: {
                  productID: prev?.currentView?.product?.productID,
                  category: prev?.currentView?.product?.category,
                  name: prev?.currentView?.product?.name,
                },
                time: new Date().toLocaleString(),
                duration,
                event: { type: "view", time: new Date().toLocaleString() },
              },
            ],
            currentView: null,
          };
          localStorage.setItem("interaction", JSON.stringify(updated));
          return updated;
        });
      }
    };
  }, [Productid]);

  const handleAddtoCart = () => {
    if (btn === "Add to Cart") {
      console.log(cartItems)
      console.log(product)
      const exists = cartItems.some(item => item.productID === product.productID);
      if (exists) return;

      product.quantity = quantity;
      setCartItems(prev => [...prev, product]);

      setDataForMl(prev => {
        const updated = {
          ...prev,
          products: [
            ...(prev.products || []),
            {
              product: {
                productID: prev.currentView?.product?.productID,
                category: prev.currentView?.product?.category,
                name: prev.currentView?.product?.name
              },
              time: new Date(Date.now()).toLocaleString(),
              duration:
                prev.currentView && prev.currentView.product.productID === product._id
                  ? Date.now() - prev.currentView.startTime
                  : 0,
              event: { type: "add_to_cart", time: new Date(Date.now()).toLocaleString() },
            },
          ],
        };

        localStorage.setItem("interaction", JSON.stringify(updated));
        return updated;
      });
    } else {
      setCmenu(true);
    }
  };

  const handleWishlist = async () => {
    setWishlist(!wishlist);
    if (user?.wishlist?.includes(Productid)){
      const res = await deleteWishlist(Productid)
    } else {
      const res = await updateWishlist(Productid)
    }
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: "Check this out!",
        text: "Cool product I found 👇",
        url: window.location.href,
      });
    } catch (err) {
      console.log("Share failed:", err);
    }
  };

  if (isLoading || mlLoading){
    return <ProductDetailSkeleton/>
  }
  
  function renderBoldItalic(text) {
    let html = text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
    html = html.replace(/\*(.*?)\*/g, "<i>$1</i>");
    html = html.replace(/\n/g, "<br/>");
    return html;
  }

  if (mlLoading){
    return <FavoritesSkeleton/>
  }
  return (
    <section className="product-detail flex flex-col items-center">
      <div className="product-detail-section w-[1200px] mt-[120px] mx-auto grid grid-cols-2 gap-10 p-6">
        <div onClick={() => navigate(-1)} className="cursor-pointer col-span-2 flex gap-[10px] items-center">
          <FaArrowLeft/>
          <p>Back to products</p>
        </div>
        <div className="product-detail-section-left">
          <img src={selectedImage} alt="Product" className="rounded-2xl shadow-md w-full h-[400px] object-contain"/>
          <div className="flex flex-wrap gap-2 mt-4">
            {product?.images.map((img, i) => (
              <img key={i} src={img} alt={`thumb-${i}`} onClick={() => setSelectedImage(img)} className={`w-20 h-20 rounded-lg object-contain cursor-pointer border ${selectedImage === img ? "border-black" : "border-gray-300"}`}/>
            ))}
          </div>
        </div>

        <div className="product-detail-section-right space-y-4">
          <div className="flex justify-between">
            <h1 className="text-2xl font-semibold">{product?.name}</h1>
            <div className="flex gap-[10px]">
              <Heart onClick={handleWishlist} className={`text-[22px] cursor-pointer ${wishlist ? "fill-red-600 text-red-600" : ""}`}/>
              <MdOutlineShare onClick={handleShare} className="text-[22px] cursor-pointer"/>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} className={i < Math.floor(product?.ratings?.average) ? "fill-yellow-500 text-yellow-500" : "text-gray-300"} />
            ))}
            <span className="text-sm text-gray-500">
              {product?.ratings?.average} ({product?.reviews.length} reviews)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-red-500">₹{product?.price}</span>
          </div>
          <div
            style={{ whiteSpace: "pre-line" }}
            dangerouslySetInnerHTML={{ __html: renderBoldItalic(product?.description || "") }}
          />
          <div className="p-3 bg-[#ececf0c0] rounded-md">
            <div className="flex items-center gap-[10px]">
              <HiOutlineTruck className="text-[20px]"/>
              <div>
                <p className="font-medium">Free Delivery on order above ₹499</p>
                <p className="text-sm text-gray-500">Express delivery for same day</p>
              </div>
            </div>
          </div>

          <div className="product-detail-section-btns flex items-center justify-between">
            <div className="flex flex-col gap-[10px]">
              <p className="text-[14px] text-gray-800">Quantity</p>
              {btn === "Add to Cart" ? <div className="flex items-center">
                <button className="border-[1px] rounded-md w-[30px] relative h-[30px] text-[20px]" onClick={() => setQuantity(Math.max(1, quantity - 1))} ><p className="absolute bottom-[2px] left-[34%]">-</p></button>
                <span  className="px-8">{quantity}</span>
                <button className="border-[1px] rounded-md w-[30px] relative h-[30px] text-[20px]" onClick={() => setQuantity(quantity + 1)}><p className="absolute bottom-[2px] left-[25%]">+</p></button>
              </div> : ""}
            </div>
            <button onClick={(e) => {
                                      if (btn === "Add to Cart") {
                                        handleAddtoCart(e);
                                        setPopUp(true);
                                      } else {
                                        handleAddtoCart(e);
                                      }
                                    }}
              className="bg-black text-white rounded-md text-[14px] w-[350px] h-[30px]">
              {btn}
            </button>
          </div>
          <div className="text-sm text-gray-500 mt-2">
            Total: ₹{(product?.price * quantity).toFixed(2)}
          </div>
        </div>
      </div>
      <div className="other-details w-[1200px] mt-[70px] relative">
        <div className="w-fit rounded-xl bg-[#ececf0] p-[5px] flex justify-between mb-[20px]">
          {
            ["Detail", "Vendor Info", "Reviews"].map((item, index) => (
              <div onClick={() => setSelect(index)} key={index} className={`cursor-pointer w-fit px-[10px] font-medium rounded-xl text-[14px] ${select===index ? "bg-white" : "bg-transparent"}`}>{item}</div>
            ))
          }
        </div>
        {select===0 ? <Detail product={product}/> :
         select===1 ? <Vendor vendor={product?.vendor?.vendor}/> : 
         <Reviews product={product} refetch={refetch}/>}
        <div className="feature-products w-[1200px] mb-[30px]">
            <div className="flex justify-start">
                <div className="font-medium text-[24px] text-black text-center mt-[30px] mb-[30px]">
                    You Might Also Like
                </div>
            </div>
            {!mlprd?.recommendations ? <FavoritesSkeleton/> : <div className="w-full flex gap-4 flex-wrap justify-start">
                {
                    (mlprd?.recommendations && mlprd?.recommendations.slice(0, 10).map((product, index) => {
                        return <ProductShow key={index} product={product} />
                    }))
                }
            </div>}
        </div>
      </div>
      <CartPopup show={popUp} message="Product added to cart!" />
    </section>
  );
};

export default ProductDetails;