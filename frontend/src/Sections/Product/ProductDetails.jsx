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
  
  const {data: product, isLoading, refetch} = useQuery({
    queryKey : ["showproduct"],
    queryFn: () => getProductsById(Productid),
    select: (res) => (res?.data?.product) || [],
    enabled: !!Productid,
  })

  useEffect(() => {
    if (product?.images?.length > 0) {
      setSelectedImage(product.images[0]);
    }
  },[product])

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
                time: Date.now(),
                duration,
                event: { type: "view", time: Date.now() },
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
              time: Date.now(),
              duration:
                prev.currentView && prev.currentView.product.productID === product._id
                  ? Date.now() - prev.currentView.startTime
                  : 0,
              event: { type: "add_to_cart", time: Date.now() },
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

  if (isLoading) return (<p>Loading Products....</p>)
  function renderBoldItalic(text) {
    // Replace **bold** with <b>bold</b>
    let html = text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
    // Replace *italic* with <i>italic</i>
    html = html.replace(/\*(.*?)\*/g, "<i>$1</i>");
    // Preserve line breaks
    html = html.replace(/\n/g, "<br/>");
    return html;
  }
  return (
    <section className="product-detail w-screen flex flex-col items-center">
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
            <span className="line-through text-gray-400">₹{product?.oldPrice}</span>
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
            <button onClick={handleAddtoCart} className="bg-black text-white rounded-md text-[14px] w-[350px] h-[30px]">
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
        {select===0 ? <Detail product={product}/> : select===1 ? <Vendor vendor={product?.vendor?.vendor}/> : <Reviews product={product} refetch={refetch}/>}
        <div className="other-details w-[1200px] mt-[40px] relative">
          <h2 className="mb-[20px]">You Might Also Like</h2>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
