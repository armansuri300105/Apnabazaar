import { NavLink } from "react-router-dom";
import {optimizeImage} from "../../../services/optimizeImage"

export const CategoryItem = ({ Categoryname, no_of_items, img_link }) => {
  return (
    <NavLink to={`/categories/${encodeURIComponent(Categoryname)}`}>
      <div className="flex flex-col items-center justify-between bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 h-[200px] sm:h-[220px] w-full cursor-pointer">
        <div className="w-full flex justify-center mt-3">
          <div className="h-[120px] w-[120px] overflow-hidden rounded-lg">
            <img
              decoding="async"
              loading="lazy"
              src={optimizeImage(img_link, 150, 150)}
              alt={Categoryname}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>
        <div className="text-center mt-2 mb-3">
          <p className="text-[15px] font-medium text-gray-800 truncate w-[140px] mx-auto">
            {Categoryname}
          </p>
          <p className="text-[12px] text-gray-500">{no_of_items} Items</p>
        </div>
      </div>
    </NavLink>
  );
};