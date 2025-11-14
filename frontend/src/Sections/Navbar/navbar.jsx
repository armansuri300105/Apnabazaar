// This file creates the navigation bar that appears at the top of every page

// Import necessary tools and components
import { useContext, useEffect, useState } from "react"
import { SearchBar } from "./components/SearchBar"         // Search input field
import { NavLink } from 'react-router-dom'                // Page navigation links
import { BsCart3 } from "react-icons/bs";                 // Shopping cart icon
import { IoMdClose } from "react-icons/io";               // Close menu icon
import { IoMdMenu } from "react-icons/io";                // Open menu icon
import "./navbar.css"
import Cart from "../Cart/cart";                          // Shopping cart panel
import { CartProductContext } from "../../services/context";  // Shopping cart data
import NavbarSkeleton from "./NavbarSkeleton.jsx"         // Loading animation
import LocationFetcher from "../location/locationFetcher.jsx";

// Main navigation bar component
export const NavBar = () =>{
    // Track mobile menu state (open/closed)
    const [menu, setMenu] = useState(false);
    
    // Get cart data and user info from global state
    const {cartItems, items, setItems, checkAuth, cmenu, setCmenu, loadinguser, user, setUserLocation} = useContext(CartProductContext)
    
    // Calculate total items in cart whenever cart changes
    useEffect(() => {
        let total = 0;
        for (let i=0;i<cartItems.length;i++){
            total += cartItems[i].quantity;
        }
        setItems(total);
    },[cartItems])

    // Close all menus (mobile and cart)
    const handleMenu = () => {
        setMenu(false);
        setCmenu(false);
    }

    // Toggle between menu and close icons
    const Icon = menu ? IoMdClose : IoMdMenu
    
    // Open shopping cart panel
    const handleCartMenu = () => {
        setCmenu(true);
    }

    return (
        // Main navigation bar - stays at top of screen
        <div  className="navbar z-[1] fixed top-0 items-center right-0 left-0 flex justify-center shadow-sm backdrop-blur-md p-[20px]" style={{backgroundColor: "color-mix(in oklab, #fff 60%, transparent)"}}>
            {loadinguser ? (
                <NavbarSkeleton/>  // Show loading animation while user data loads
            ) : 
            (<nav className="navbar-section flex justify-around items-center w-[1200px]">
                {/* Website logo */}
                <div className="absolute bottom-0 left-[calc(50% - 70px)]"><LocationFetcher/></div>
                <div className="logo flex items-center">
                    <div>
                        <NavLink to="/"><div className="font-semibold"><img className="w-[150px]" src="/logo.webp" alt="ApnaBazaar" /></div></NavLink>
                    </div>
                </div>
                {/* Desktop navigation menu */}
                <ul className={`options flex gap-8 justify-between cursor-pointer text-[20px]`}>
                    <NavLink className="link [&.active>li]:font-bold" onClick={handleMenu} to="/"><li>Home</li></NavLink>
                    <NavLink className="link [&.active>li]:font-bold" onClick={handleMenu} to="/categories"><li>Categories</li></NavLink>
                    <NavLink className="link [&.active>li]:font-bold" onClick={handleMenu} to="/about"><li>About</li></NavLink>
                    <NavLink className="link [&.active>li]:font-bold" onClick={handleMenu} to="/contact"><li>Contact</li></NavLink>
                </ul>
                {/* Mobile navigation menu - shows on small screens */}
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
                            <img className="cursor-pointer w-[40px] h-[40px] rounded-[50%]" src="/profile.webp" alt="" />
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
                {user ? user?.isVerified ? "" : <div className="email-verification-alert absolute left-0 bottom-[-30px] bg-green-500 p-[7px] w-full flex gap-[20px] justify-center">
                    <p>Your Account is Not verified, Please verify for placing orders</p>
                    <a href="/user/send" className="text-blue-600 cursor-pointer">Verify Now</a>
                </div> : ""}
                <div className={`absolute top-0 right-0 duration-300 ease-linear transition-transform ${cmenu ? "translate-x-0" : "translate-x-[100%]"}`}><Cart cmenu={cmenu} setCmenu={setCmenu}/></div>
            </nav>)}
        </div>
)}