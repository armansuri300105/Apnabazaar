import { useContext, useEffect, useState } from "react";
import { HiOutlineTruck } from "react-icons/hi";
import { Star } from "lucide-react";
import { Heart } from "lucide-react";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { deleteWishlist, getProductsById, updateWishlist } from "../../../API/api";
import { MdOutlineShare } from "react-icons/md";
import { CartProductContext } from "../../services/context";
import "./productDetail.css"
import Detail from "./detail";
import Vendor from "./vendor";
import Reviews from "./reviews";
import {useQuery} from "@tanstack/react-query"
import ProductDetailSkeleton from "./productDetailSkeleton";
import CartPopup from "./cartPopUp";
import { userSearchMl } from "../../../API/ml";
import { ProductShow } from "../Home/Components/productshow";
import FavoritesSkeleton from "../User/Profile/Skeletons/favoritesSkeleton"

const ProductDetails = () => {
  const {user, cartItems, setCartItems, setCmenu, dataForMl, setDataForMl} = useContext(CartProductContext)
  const [wishlist, setWishlist] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [btn, setBtn] = useState("Add to Cart")
  const [select, setSelect] = useState(0)
  const navigate = useNavigate();
  const param = useParams();
  const Productid = param?.Productid
  const [selectedImage, setSelectedImage] = useState(null);
   const [popUp, setPopUp] = useState(false);
  
  const {data: product, isLoading, refetch} = useQuery({
    queryKey : ["showproduct", Productid],
    queryFn: () => getProductsById(Productid),
    select: (res) => (res?.data?.product) || [],
    enabled: !!Productid,
  })

  const {data: mlprd, mlLoading} = useQuery({
    queryKey: [`mlprd`, Productid],
    queryFn: () => userSearchMl(product?.name),
    select: (res) => res?.data,
    enabled: !!product?.name
  })

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
  },[cartItems])

  useEffect(() => {
    return () => {
      if (dataForMl?.currentView) {
        const duration = Date.now() - dataForMl.currentView.startTime;

        setDataForMl(prev => {
          const updated = {
            ...prev,
            products: [
              ...(prev.products || []),
              {
                product: {
                  productID: prev.currentView.product.productID,
                  category: prev.currentView.product.category,
                  name: prev.currentView.product.name
                },
                time: new Date(Date.now()).toLocaleString(),
                duration,
                event: { type: "view", time: new Date(Date.now()).toLocaleString() },
              },
            ],
            currentView: null,
          };

          localStorage.setItem("interaction", JSON.stringify(updated));
          return updated;
        });
      }
    };
  }, [dataForMl?.currentView]);

  const handleAddtoCart = () => {
    if (btn === "Add to Cart") {
      const exists = cartItems.some(item => item._id === product._id);
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
                productID: prev.currentView.product.productID,
                category: prev.currentView.product.category,
                name: prev.currentView.product.name
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

  console.log("ml products", mlprd)
  const handleWishlist = async () => {
    setWishlist(!wishlist);
    if (user?.wishlist?.includes(Productid)){
      const res = await deleteWishlist(Productid)
      console.log(res?.data)
    } else {
      const res = await updateWishlist(Productid)
      console.log(res?.data)
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
              <div className="flex items-center">
                <button className="border-[1px] rounded-md w-[30px] relative h-[30px] text-[20px]" onClick={() => setQuantity(Math.max(1, quantity - 1))} ><p className="absolute bottom-[2px] left-[34%]">-</p></button>
                <span  className="px-8">{quantity}</span>
                <button className="border-[1px] rounded-md w-[30px] relative h-[30px] text-[20px]" onClick={() => setQuantity(quantity + 1)}><p className="absolute bottom-[2px] left-[25%]">+</p></button>
              </div>
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
        <div className="feature-products w-[1200px]">
            <div className="flex justify-start">
                <div className="text-[24px] text-black text-center mt-[30px]">
                    You Might Also Like
                </div>
            </div>
            <div className="w-full mt-8 flex gap-4 flex-wrap justify-start">
                {
                    (mlprd?.recommendations && mlprd?.recommendations.slice(0, 10).map((product, index) => {
                        return <ProductShow key={index} product={product} />
                    }))
                }
            </div>
        </div>
      </div>
      <CartPopup show={popUp} message="Product added to cart!" />
    </section>
  );
};

export default ProductDetails;