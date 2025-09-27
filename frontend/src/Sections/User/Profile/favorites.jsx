import { getWishlist } from "../../../../API/api"
import {ProductShow} from "../../Home/Components/productshow"
import {useQuery} from "@tanstack/react-query"
import FavoritesSkeleton from "./Skeletons/favoritesSkeleton"

const Favorites = () => {
  const {data: favorites, isLoading} = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
    select: (res) => (res?.data?.data?.wishlist) || []
  })
  return isLoading ? <FavoritesSkeleton/> : (
    <>
      <section className="flex flex-wrap gap-[20px] justify-center">
        {
            favorites?.map((item, index) => {
                return <ProductShow key={index} product={item}/>
            })
        }
      </section>
    </>
  )
}

export default Favorites
