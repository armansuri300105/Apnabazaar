import { useState } from "react"

export const SerachBar = ({
    text,
}) =>{
    return( 
    <div className={`search-bar relative h-[31.5px] bg-[#f3f3f5] flex items-center gap-3 rounded-lg w-[30vw]`}>
        <SearchIcon/>
        <input className="w-full text-black text-[17px] font-medium font-lg h-[30px] bg-[#f3f3f5] outline-none" placeholder={text}/>
        <div className="text-[#8d8d9b] text-[12px] font-lg">
        </div>
    </div>)
}

function SearchIcon(){
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="size-4 stroke-[#8d8d9b] ml-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>

}