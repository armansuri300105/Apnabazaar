import { useParams } from "react-router-dom"
import { ProductShow } from "../Home/Components/productshow"
import { useQuery } from "@tanstack/react-query";
import Loading from "../Loading/loading";
import { searchProduct } from "../../../API/api";

const Search = () => {
    const {text} = useParams();
    console.log(text)
    const {data, isLoading} = useQuery({
        queryKey: ["search"],
        queryFn: () => searchProduct(text),
        select: (res) => res?.data
    })

    if (isLoading){
        return <Loading/>
    }
    let products = [];
    if (data?.success){
        products = data?.data;
    }
    console.log(data)
  return (
    <>
        <div className="bg-white mb-[30px] relative flex flex-col items-center mt-[100px]">
            {products.length > 0 ? <div className="feature-products w-[1200px]">
                <div className="flex justify-start">
                    <div className="text-[24px] text-black text-center">
                        Search Result for <b>"{text}"</b>
                    </div>
                </div>
                <div className="w-full mt-8 flex gap-4 flex-wrap justify-start">
                    {
                        (products && products.slice(0, 10).map((product, index) => {
                            return <ProductShow key={index} product={product} />
                        }))
                    }
                </div>
            </div> : <h2 className="text-[22px] font-bold mt-[50px] mb-[50px]">No Product Found</h2>}
        </div>
    </>
  )
}

export default Search