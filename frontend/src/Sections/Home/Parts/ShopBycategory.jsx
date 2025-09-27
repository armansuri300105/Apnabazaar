import { CategoryItem } from "../Components/Categoryitem"
import CategorySection from "../Skeleton/category"

export const ShopbyCategory = ({loadinguser}) =>{
    const data = [
        {Categoryname:"Fresh Produce", no_of_items:0, img_link:"https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=300&h=300&fit=crop"},
        {Categoryname:"Dairy & Eggs", no_of_items:0, img_link:"https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=300&fit=crop"},
        {Categoryname:"Bakery", no_of_items:0, img_link:"https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop"},
        {Categoryname:"Meat and Seafoods", no_of_items:0, img_link:"https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=300&h=300&fit=crop"},
        {Categoryname:"Dry Fruits", no_of_items:0, img_link:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.itoozhiayurveda.in%2Fayurveda-guide-to-consume-dry-fruits%2F&psig=AOvVaw3YMkyr6F4cvFXK1MVlCqdI&ust=1754990172658000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCIDC9IG2go8DFQAAAAAdAAAAABAK"},
        {Categoryname:"Fruits", no_of_items:0, img_link:"https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&h=300&fit=crop"}
    ]
    return loadinguser ? <CategorySection/> : (
    <div className="bg-[#f5f5f7] pt-[42px] pb-[42px]">
        <div> 
            <div className="flex justify-center text-[26.5px] h-[32px] mb-[14px] font-[500]">
                Shop By Category
            </div>
            <div className="flex justify-center">
                <div className="text-[14px] h-[21px] text-[#717182] text-center">
                    Browse our wide selection of local products organized by category
                </div>
            </div>
            <div className="mt-8 flex gap-4 justify-center flex-wrap">
                {
                    data.map((item, index) => {
                        return (
                            <CategoryItem key={index} Categoryname={item.Categoryname} no_of_items={item.no_of_items} img_link={item.img_link}/>
                        )
                    })
                }
            </div>
        </div>
    </div>)

}