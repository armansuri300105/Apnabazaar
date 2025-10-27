import { ProductShow } from "../../Home/Components/productshow";
import { useState, useMemo, useContext, useEffect } from "react";
import "./category.css";
import { getProducts } from "../../../../API/api";
import { useQuery } from "@tanstack/react-query";
import CategorySkeleton from "./categorySkeleton";
import { CartProductContext } from "../../../services/context";
import { useNavigate, useParams } from "react-router-dom";

export const CategoryBody = () => {
  const { loadinguser } = useContext(CartProductContext);
  const { catname } = useParams();
  const navigate = useNavigate();

  const [selected, setSelected] = useState("name");
  // Removed redundant state: [items, setItems]

  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    select: (res) => res?.data?.products || [],
  });

  const category = catname ? decodeURIComponent(catname) : "All Products";

  // Scrolling logic, primarily triggered by category change
  useEffect(() => {
    const isMobile = window.innerWidth <= 600;

    if (isMobile) {
      const productsSection = document.getElementById("products-section");
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [category]); // Removed 'selected' dependency to prevent scrolling on sort change

  // Memoize unique categories list
  const categories = useMemo(() => {
    if (!data) return ["All Products"];
    const uniqueCategories = [
      ...new Set(data.map((p) => p.category?.trim())),
    ];
    return ["All Products", ...uniqueCategories];
  }, [data]);

  // Memoize the filtered and sorted product list in one step for efficiency
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = data || [];
    
    // 1. Filtering
    if (category !== "All Products") {
      filtered = filtered.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // 2. Sorting (operate on a copy)
    let sorted = [...filtered];

    if (selected === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (selected === "date") {
      sorted.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (selected === "rating") {
      // Use fallback (|| 0) for safe comparison
      sorted.sort(
        (a, b) => (b.ratings?.average || 0) - (a.ratings?.average || 0)
      );
    } else if (selected === "price") {
      sorted.sort((a, b) => a.price - b.price);
    }

    return sorted;
  }, [category, data, selected]); // Recalculates only when these dependencies change

  // Memoize categories with their counts
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

  // Removed old useMemo that set 'items' state

  if (isError) return <p>Error: {error.message}</p>;
  if (isLoading || loadinguser) return <CategorySkeleton />;

  return (
    <div className="category-section-top w-[90vw] grid grid-cols-1 gap-[40px] mb-[50px]">
      <div className="category-section-start mt-[100px] w-[90vw] flex justify-between items-end justify-self-start relative">
        <div>
          <div className="text-[31.5px] font-semibold pt-4">
            Categories
          </div>
          <div className="text-[14px] text-[#717182] py-3">
            Browse our complete selection of local products organized by
            category
          </div>
        </div>
        <div className="category-section-items flex items-center gap-4 justify-start">
          <div className="flex gap-[10px] items-center">
            <select
              className="outline-none border-solid border-[1px] h-9 px-2 flex justify-center rounded-md border-grey-100"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="date">Sort by Date</option>
              <option value="rating">Sort by Rating</option>
              <option value="price">Sort by Price</option>
            </select>
          </div>
        </div>
      </div>

      <div className="category-grid flex gap-[20px]">
        {/* Sidebar */}
        <div className="sticky top-[100px] h-screen overflow-y-auto">
          <div className="text-[14px] font-semibold mb-2">Categories</div>
          {categoriesWithCount.map((item, index) => (
            <div
              id={index === categoriesWithCount.length - 1 ? "products-section" : ""}
              key={index}
              onClick={() =>
                navigate(
                  item.name === "All Products"
                    ? "/categories"
                    : `/categories/${encodeURIComponent(item.name)}`
                )
              }
              className={`category-select-btn ${
                category === item.name
                  ? "bg-black text-white"
                  : "bg-neutral-200 text-black"
              } px-3 text-[16px] flex justify-between items-center w-[250px] h-[41px] rounded-lg mb-2 cursor-pointer`}
            >
              {item.name}
              <div className="text-black w-[25px] h-[25px] rounded-lg p-2 bg-neutral-200 border-solid border-[1px] border-grey-100 flex items-center justify-center">
                {item.quantity}
              </div>
            </div>
          ))}
        </div>

        {/* Products Section */}
        <div className="flex-1">
          {/* Display length directly from memoized array */}
          <div>{filteredAndSortedProducts.length !== 0 ? `Showing ${filteredAndSortedProducts.length} products` : ""}</div>
          <div className="category-product-section flex gap-6 mt-2 flex-wrap relative">
            {filteredAndSortedProducts?.length === 0 ? (
              <p className="w-[100%] h-[100%] text-center text-2xl font-bold">
                Product Not Available
              </p>
            ) : (
              filteredAndSortedProducts.map((product, index) => (
                <ProductShow key={index} product={product} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};