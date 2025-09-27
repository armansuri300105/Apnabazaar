import { useContext } from "react"
import { FeaturedLocalProducts } from "./Parts/Featuredprod"
import { Hbody1 } from "./Parts/Hbody1"
import { ShopbyCategory } from "./Parts/ShopBycategory"
import { CartProductContext } from "../../services/context"

export const HomeBody = () =>{
    const { loadinguser } = useContext(CartProductContext)
    return (
    <div>
        <Hbody1 loadinguser={loadinguser}/>
        <ShopbyCategory loadinguser={loadinguser}/>
        <FeaturedLocalProducts loadinguser={loadinguser}/>
    </div>
)} 