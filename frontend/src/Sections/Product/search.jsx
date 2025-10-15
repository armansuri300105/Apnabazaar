import { useParams } from "react-router-dom"
import { ProductShow } from "../Home/Components/productshow"
import { useQuery } from "@tanstack/react-query";
import Loading from "../Loading/loading";
import { searchProduct } from "../../../API/api";
import { userSearchMl } from "../../../API/ml";
import "./productdetail.css"
import { useState } from "react";

const Search = () => {
    const {text} = useParams();
    const [selected, setSelected] = useState('filter');
    const {data, isLoading} = useQuery({
        queryKey: ["search", text],
        queryFn: () => searchProduct(text),
        select: (res) => res?.data
    })

    const {data: mlprd, isLoading: productLoading} = useQuery({
        queryKey: ["mlproducts", text],
        queryFn: () => userSearchMl(text),
        select: (res) => res?.data
    })

    if (isLoading || productLoading){
        return <Loading/>
    }

    let products = [];
    if (data?.success){
        products = data?.data;
    }
    console.log(data)
    console.log("ml products", mlprd)

    if (selected=== 'filter'){
        products = products
    }
    else if (selected === 'name') {
        products = [...products].sort((a, b) =>
        a.name.localeCompare(b.name) // A-Z
        );
    } else if (selected === 'date') {
        products = [...products].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt) // Newest first
        );
    } else if (selected === 'rating') {
        products = [...products].sort(
        (a, b) => b.ratings?.average - a.ratings?.average // High → low
        );
    } else if (selected === 'price') {
        products = [...products].sort((a, b) => a.price - b.price); // Low → high
    }
  return (
    <>
        <div className="search-result-section bg-white mb-[30px] relative flex flex-col items-center mt-[120px]">
            {products.length > 0 ? 
            <div className="feature-products flex flex-col items-center">
                <div className="search-result-section-filter feature-products w-[1200px] flex justify-between">
                    <div className="text-[24px] text-black">
                        Search Result for <b>"{text}"</b>
                    </div>
                    <div className="category-section-items flex items-center gap-4 justify-start">
                        <div className="flex gap-[10px] items-center">
                            <select className="outline-none border-solid border-[1px] h-9 px-1 flex justify-center rounded-md border-grey-100" value={selected} onChange={e => setSelected(e.target.value)}>
                                <option value="filter">Filter</option>
                                <option value="name">Sort by Name</option>
                                <option value="date">Sort by Date</option>
                                <option value="priority">Sort by Priority</option>
                                <option value="price">Sort by Price</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="search-product-recommendation mt-8 flex gap-4 flex-wrap justify-center">
                    {
                        (products && products.map((product, index) => {
                            return <ProductShow key={index} product={product} />
                        }))
                    }
                </div>
            </div> : <h2 className="text-[22px] font-bold mt-[50px] mb-[50px]">No Product Found with <b>"{text}"</b></h2>}

            <div className="feature-products mt-[30px]">
                <div className="flex justify-center">
                    <div className="text-[24px] text-black text-center font-medium underline">
                        You Might Also Like
                    </div>
                </div>
                <div className="search-product-recommendation mt-8 flex gap-4 flex-wrap justify-center">
                    {
                        (mlprd?.recommendations && mlprd?.recommendations.map((product, index) => {
                            return <ProductShow key={index} product={product} />
                        }))
                    }
                </div>
            </div>
        </div>
    </>
  )
}

export default Search