import { useState } from "react";
import { RiGridFill } from "react-icons/ri";
import { IoSearchOutline } from "react-icons/io5";
export const Heading1 =() =>{
    const [selected, setSelected] = useState('name');
    return (
    <div className="category-section-start mt-[100px] w-[70vw] justify-self-start relative">
        <div className="text-[31.5px] font-semibold pt-4">Categories</div>
        <div className="text-[14px] text-[#717182] py-3">Browse our complete selection of local products organized by category</div>
        <div className="category-section-items flex items-center gap-4 justify-start">
            <div className="input-div w-[70%] flex relative">
                <div className="flex justify-center items-center w-[30px] h-[40px] bg-[#f3f3f5] rounded-l-md"><IoSearchOutline className="text-[18px] ml-[10px] text-[#717182]"/></div>
                <input type="text" placeholder="Search Products..." className="w-[100%] outline-none border-none h-[40px] bg-[#f3f3f5] text-[#717182] pl-[10px] rounded-r-md" />
            </div>
            <div className="flex gap-[10px] items-center">
                <select className="outline-none border-solid border-[1px] h-9 px-2 flex justify-center rounded-md border-grey-100" value={selected} onChange={e => setSelected(e.target.value)}>
                    <option value="name">Sort by Name</option>
                    <option value="date">Sort by Date</option>
                    <option value="priority">Sort by Priority</option>
                </select>  
                <RiGridFill className="text-2xl cursor-pointer"/>
            </div>
        </div>
    </div>)
}