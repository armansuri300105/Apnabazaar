import {NavLink} from "react-router-dom"

export const CategoryItem = ({
    Categoryname,
    no_of_items,
    img_link
}) =>{
    return (
    <NavLink to="/categories"><div className="flex items-center justify-center group h-[222px] bg-white w-[169px] rounded-lg shadow-sm cursor-pointer hover:shadow-lg ">
        <div>
            <div className="h-[141px] w-[141px] overflow-hidden rounded-lg">
                <img className="transition-all group-hover:scale-[105%] duration-200" src={img_link} />
            </div>
            <div className="flex justify-center pt-2 text-[12.25px] h-[18px]">{Categoryname}</div>
            <div className="flex justify-center pt-2 text-[10.5px] h-[14x]">{no_of_items} Items</div>
        </div>
    </div></NavLink>)
}