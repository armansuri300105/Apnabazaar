import { Search } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

export const SearchBar = () =>{
    const [search, setSearch] = useState("")
    const navigate = useNavigate()
    const handleSearch = async (e) => {
        e.preventDefault();
        if (search){
            navigate(`/search/${search}`)
        }
    }
    return(
        <form onSubmit={handleSearch} className={`search-bar relative h-[31.5px] bg-[#f3f3f5] flex items-center gap-3 rounded-lg w-[30vw]`}>
            <Search width="23px" className="pl-[4px]"/>
            <input onChange={(e) => setSearch(e.target.value)} value={search} className="w-full text-black text-[17px] font-medium font-lg h-[30px] bg-[#f3f3f5] outline-none" placeholder="Search Local Products..."/>
            <div className="text-[#8d8d9b] text-[12px] font-lg">
            </div>
        </form>
    )
}