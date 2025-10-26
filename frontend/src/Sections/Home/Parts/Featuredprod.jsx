import { ProductShow } from "../Components/productshow";
import { getProducts } from "../../../../API/api";
import { useQuery } from "@tanstack/react-query";
import FavoritesSkeleton from "../../User/Profile/Skeletons/favoritesSkeleton";
import { recommendedProducts } from "../../../../API/ml";
import { CartProductContext } from "../../../services/context";
import { useContext } from "react";

export const FeaturedLocalProducts = () => {
    const { user } = useContext(CartProductContext);

    const { data, isLoading: prdLoading } = useQuery({
        queryKey: ["recommendedPrd", user?._id],
        queryFn: () => recommendedProducts(user?._id),
        select: (res) => res?.data || [],
        enabled: !!user
    });

    const { data: allProducts, isLoading: allLoading } = useQuery({
        queryKey: ["featurePrd"],
        queryFn: getProducts,
        select: (res) => res?.data?.products || []
    });

    if (prdLoading || allLoading) {
        return <FavoritesSkeleton />;
    }
    let recommendedProduct = []

    if (data?.success){
        recommendedProduct = data?.recommendations
    }

    const productsToShow = (!user || (user && recommendedProduct && recommendedProduct?.length === 0))
        ? allProducts.slice(0, 10)
        : recommendedProduct;

    return (
        <div id="feature-products" className="bg-white mb-[30px] relative flex flex-col items-center">
            <div className="feature-products w-[1200px]">
                <div className="flex justify-center text-[26.5px] mt-[10px] mb-[14px] font-[500]">
                    Featured Local Products
                </div>
                <div className="flex justify-center">
                    <div className="text-[14px] text-[#717182] text-center">
                        Discover fresh, local products from trusted vendors in your community
                    </div>
                </div>
                <div className="w-full mt-8 flex gap-4 flex-wrap justify-center">
                    {productsToShow?.map((product, index) => (
                        <ProductShow key={index} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
};