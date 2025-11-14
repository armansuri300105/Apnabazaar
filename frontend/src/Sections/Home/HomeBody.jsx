// This file creates the main homepage layout of the e-commerce website

// Import necessary components and functions
import { useContext } from "react"
// Import different sections of the homepage
import { FeaturedLocalProducts } from "./Parts/Featuredprod"      // Shows popular local products
import { Hbody1 } from "./Parts/Hbody1"                          // Main hero/banner section
import { ShopbyCategory } from "./Parts/ShopBycategory"          // Category navigation
// Import shopping cart information
import { CartProductContext } from "../../services/context"
import { NearByProducts } from "./Parts/NearByProducts"

// Main homepage component
export const HomeBody = () =>{
    // Get loading state to show loading animations while data loads
    const { loadinguser } = useContext(CartProductContext)
    
    return (
    <div>
        {/* Main banner/hero section with featured content */}
        <Hbody1 loadinguser={loadinguser}/>
        
        {/* Browse products by categories (Electronics, Fashion, etc.) */}
        <ShopbyCategory loadinguser={loadinguser}/>
        
        {/* Display featured products from local sellers */}
        <FeaturedLocalProducts loadinguser={loadinguser}/>
    </div>
)} 