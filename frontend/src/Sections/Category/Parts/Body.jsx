import { ProductShow } from "../../Home/Components/productshow";
import { useState, useMemo, useContext } from "react";
import "./category.css";
import { getProducts } from "../../../../API/api";
import { useQuery } from "@tanstack/react-query";
import CategorySkeleton from "./categorySkeleton";
import { CartProductContext } from "../../../services/context";

export const CategoryBody = () => {
  const { loadinguser } = useContext(CartProductContext);
  const [category, setCategory] = useState("All Products");
  const [items, setItems] = useState("");

  const { data, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    select: (res) => res?.data?.products || [],
  });

  // ✅ Build category list dynamically from products
  const categories = useMemo(() => {
    if (!data) return ["All Products"];
    const uniqueCategories = [
      ...new Set(data.map((p) => p.category?.trim())),
    ];
    return ["All Products", ...uniqueCategories];
  }, [data]);

  const products = useMemo(() => {
    if (!data) return [];
    if (category === "All Products") return data;
    return data.filter(
      (p) => p.category?.toLowerCase() === category.toLowerCase()
    );
  }, [category, data]);

  const categoriesWithCount = useMemo(() => {
    if (!data) return categories.map((c) => ({ name: c, quantity: 0 }));
    return categories.map((c) => ({
      name: c,
      quantity:
        c === "All Products"
          ? data.length
          : data.filter(
              (p) => p.category?.toLowerCase() === c.toLowerCase()
            ).length,
    }));
  }, [categories, data]);

  // update item count when products change
  useMemo(() => {
    setItems(products?.length || 0);
  }, [products]);

  if (isError) return <p>Error: {error.message}</p>;

  return loadinguser ? (
    <CategorySkeleton />
  ) : (
    <div className="category-grid flex gap-[20px]">
      <div>
        <div className="text-[14px] font-semibold mb-2">Categories</div>
        {categoriesWithCount.map((item, index) => (
          <div
            key={index}
            onClick={() => setCategory(item.name)}
            className={`category-select-btn ${
              category === item.name
                ? "bg-black text-white"
                : "bg-neutral-200 text-black"
            } px-3 text-[12.25px] flex justify-between items-center w-[15vw] h-[41px] rounded-lg mb-2`}
          >
            {item.name}
            <div className="text-black h-5 w-5 rounded-lg bg-neutral-200 border-solid border-[1px] border-grey-100 flex items-center justify-center">
              {item.quantity}
            </div>
          </div>
        ))}
      </div>

      <div>
        <div>{items !== 0 ? `Showing ${items} products` : ""}</div>
        <div className="flex gap-6 mt-2 flex-wrap relative">
          {products?.length === 0 ? (
            <p className="w-[100%] h-[100%] text-center text-2xl font-bold">
              Product Not Available
            </p>
          ) : (
            products?.map((product, index) => (
              <ProductShow key={index} product={product} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};