import { getWishlist } from "../../../../API/api";
import { ProductShow } from "../../Home/Components/productshow";
import { useQuery } from "@tanstack/react-query";
import FavoritesSkeleton from "./Skeletons/favoritesSkeleton";
import { useNavigate } from "react-router-dom";

const Favorites = () => {
  const navigate = useNavigate();

  const { data: favorites, isLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
    select: (res) => res?.data?.data?.wishlist || [],
  });

  if (isLoading) return <FavoritesSkeleton />;

  if (!favorites || favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[200px] text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-3">
          💔 No items in your Wishlist
        </h2>
        <p className="text-gray-500 mb-6">
          Looks like you haven’t added anything yet.
        </p>
        <button
          onClick={() => navigate("/categories")}
          className="px-5 py-2 bg-black text-white rounded-lg transition"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <section className="flex flex-wrap gap-[20px] justify-center">
      {favorites.map((item, index) => (
        <ProductShow key={index} product={item} />
      ))}
    </section>
  );
};

export default Favorites;