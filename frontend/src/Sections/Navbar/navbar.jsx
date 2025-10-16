import { useContext, useEffect, useState } from "react"
import { SearchBar } from "./components/SearchBar"
import { NavLink } from 'react-router-dom'
import { BsCart3 } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { IoMdMenu } from "react-icons/io";
import "./navbar.css"
import Cart from "../Cart/cart";
import { CartProductContext } from "../../services/context";
import NavbarSkeleton from "./NavbarSkeleton.jsx"

export const NavBar = () =>{
    const [menu, setMenu] = useState(false);
    const {cartItems, items, setItems, checkAuth, cmenu, setCmenu, loadinguser} = useContext(CartProductContext)
    useEffect(() => {
        let total = 0;
        for (let i=0;i<cartItems.length;i++){
            total += cartItems[i].quantity;
        }
        setItems(total);
    },[cartItems])
    const handleMenu = () => {
        setMenu(false);
        setCmenu(false);
    }

    const Icon = menu ? IoMdClose : IoMdMenu
    const handleCartMenu = () => {
        setCmenu(true);
    }

    return (
        <div  className="navbar z-[1] fixed top-0 items-center right-0 left-0 flex justify-center shadow-sm backdrop-blur-md p-[20px]" style={{backgroundColor: "color-mix(in oklab, #fff 60%, transparent)"}}>
            {loadinguser ? (
                <NavbarSkeleton/>
            ) : 
            (<nav className="navbar-section flex justify-around items-center w-[1200px]">
                <div className="logo flex items-center">
                    <div>
                        <NavLink to="/"><div className="font-semibold"><img className="w-[150px]" src="/logo.png" alt="ApnaBazaar" /></div></NavLink>
                    </div>
                </div>
                <ul className={`options flex gap-8 justify-between cursor-pointer text-[20px]`}>
                    <NavLink className="link [&.active>li]:font-bold" onClick={handleMenu} to="/"><li>Home</li></NavLink>
                    <NavLink className="link [&.active>li]:font-bold" onClick={handleMenu} to="/categories"><li>Categories</li></NavLink>
                    <NavLink className="link [&.active>li]:font-bold" onClick={handleMenu} to="/about"><li>About</li></NavLink>
                    <NavLink className="link [&.active>li]:font-bold" onClick={handleMenu} to="/contact"><li>Contact</li></NavLink>
                </ul>
                <ul className={`mobile-options hidden flex-col items-center text-[20px] gap-[14px] justify-between cursor-pointer overflow-hidden duration-300 ease-linear tarnsition-all ${(menu) ? "h-[155px]" : "h-0"}`}>
                    <NavLink className="link [&.active>li]:font-bold" onClick={handleMenu} to="/"><li>Home</li></NavLink>
                    <NavLink className="link [&.active>li]:font-bold" onClick={handleMenu} to="/categories"><li>Categories</li></NavLink>
                    <NavLink className="link [&.active>li]:font-bold" onClick={handleMenu} to="/about"><li>About</li></NavLink>
                    <NavLink className="link [&.active>li]:font-bold" onClick={handleMenu} to="/contact"><li>Contact</li></NavLink>
                </ul>
                <SearchBar/>
                <div className="icons flex gap-[15px] items-center">
                    {checkAuth ? 
                        (<NavLink to="/profile"><div className="w-[40px] h-[40px] relative rounded-[50%] group">
                            <img className="cursor-pointer w-[40px] h-[40px] rounded-[50%]" src="/profile.jpg" alt="" />
                            <div className="absolute top-[50px] w-fit hidden bg-black/70 backdrop-blur-sm group-hover:block"><p className="text-white px-[5px] py-[2px] text-[11px]">Profile</p></div>
                        </div></NavLink>) : 
                        (<NavLink to="/signup">
                            <button className={`w-[70px] h-[27px] bg-black text-white rounded-md text-[12px] font-medium ${checkAuth && loadinguser ? "hidden" : "block"}`}>Sign Up</button>
                        </NavLink>)
                    }
                    <div onClick={handleCartMenu} className="relative">
                        <BsCart3 className="cart-icon text-2xl cursor-pointer"/>
                        {cartItems.length!==0 ? <div className="w-[20px] h-[20px] rounded-[50%] bg-red-700 flex justify-center items-center p-[3px] absolute top-[-9px] right-[-9px]"><p className="text-white text-[11px]">{items}</p></div> : ""}
                    </div>
                    <Icon onClick={() => setMenu(!menu)} className="menu-icon cursor-pointer hidden text-2xl font-medium"/>
                </div>
                <div className={`absolute top-0 right-0 duration-300 ease-linear transition-transform ${cmenu ? "translate-x-0" : "translate-x-[100%]"}`}><Cart cmenu={cmenu} setCmenu={setCmenu}/></div>
            </nav>)}
        </div>
)}