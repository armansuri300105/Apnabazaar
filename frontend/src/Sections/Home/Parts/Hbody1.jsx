import "../home.css"
import HeroSkeleton from "../Skeleton/hbody"
import { LuClock3 } from "react-icons/lu";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { CiDeliveryTruck } from "react-icons/ci";
import { FaArrowRight } from "react-icons/fa6";
import {NavLink} from "react-router-dom"
import { useContext } from "react";
import { CartProductContext } from "../../../services/context";

export const Hbody1 = () => {
  const {user, loadinguser} = useContext(CartProductContext)

  const handleScroll = () => {
    const productsSection = document.getElementById("feature-products");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  }
  return (
    <div className="home-hero bg-[#f8f8f9] flex justify-center pt-[130px]">
      <div className="hero w-[80vw] flex justify-center gap-[30px] items-center">
        {loadinguser ? (
          <HeroSkeleton />
        ) : (
            <>
          <div className="hero-top-seciton">
            <div className="hero-text hero-section-text text-[42px] text-[#070616]">
              <div>Fresh Local Products</div>
              <div>Delivered to Your Door</div>
            </div>
            <div className="hero-text text-[20px] mt-6 text-neutral-500 font-xl">
              Discover the best local vendors in your area. From farm-fresh
              produce to artisanal crafts, support your community while getting
              quality products.
            </div>
            <div className="home-buttons-div flex gap-4 mt-5">
              <div onClick={handleScroll} className="shopnow-btn cursor-pointer h-[35px] w-[114px] bg-black text-white font-semibold flex justify-between px-3 items-center rounded-lg text-[12.25px]">
                Shop Now
                <FaArrowRight/>
              </div>

              {user?.role==="vendor" && user?.vendor?.status==="Active" ? <NavLink to="/vendor/dashboard"><div className="cursor-pointer vendor-btn h-[35px] w-[141px] border-blur border-[1px] border-grey bg-white text-black font-semibold flex justify-center items-center rounded-lg text-[12.25px]">
                Vendor Dashboard
              </div></NavLink> : <NavLink to="/vendor/form"><div className="cursor-pointer vendor-btn h-[35px] w-[141px] border-blur border-[1px] border-grey bg-white text-black font-semibold flex justify-center items-center rounded-lg text-[12.25px]">
                Become a Vendor
              </div></NavLink>}
            </div>

            <div className="hero-text quality-btns h-[98px] flex justify-between px-10 pt-10">
              <div>
                <div className="flex justify-center">
                  <div className="h-[42px] w-[42px] bg-[#e3e3e6] flex justify-center items-center rounded-lg">
                    <CiDeliveryTruck/>
                  </div>
                </div>
                <div className="text-[12.25px] pt-2">Same Day Delivery</div>
              </div>

              <div>
                <div className="flex justify-center">
                  <div className=" h-[42px] w-[42px] bg-[#e3e3e6] flex justify-center items-center rounded-lg">
                    <IoShieldCheckmarkOutline/>
                  </div>
                </div>
                <div className="text-[12.25px] pt-2">Quality Guaranteed</div>
              </div>

              <div>
                <div className="flex justify-center">
                  <div className="h-[42px] w-[42px] bg-[#e3e3e6] flex justify-center items-center rounded-lg">
                    <LuClock3/>
                  </div>
                </div>
                <div className="text-[12.25px] pt-2">Fresh Daily</div>
              </div>
            </div>
          </div>
          <div>
            <div className="fruitimg-right ml-[400px] flex justify-center translate-x-6 translate-y-12 h-[76px] items-center bg-white w-[126px] rounded-2xl shadow-lg">
              <div>
                <div className="text-[21px] justify-center flex">10K+</div>
                <div className="text-[12.25px] text-[#717182] ">
                  Happy Customers
                </div>
              </div>
            </div>
            <img
              src="https://res.cloudinary.com/do9m8kc0b/image/upload/v1761470552/cznquruiggogxjiusc30.webp"
              className="hero-text w-[532px] h-[399px] object-cover rounded-xl"
            />
            <div className="fruitimg-left h-[76px] w-[105px] bg-white rounded-2xl shadow-lg flex justify-center items-center -translate-x-6 -translate-y-12 ">
              <div>
                <div className="text-[21px] justify-center flex">500+</div>
                <div className="text-[12.25px] text-[#717182] ">
                  Local Vendors
                </div>
              </div>
            </div>
          </div>
          </>
        )}
      </div>
    </div>
  )
}