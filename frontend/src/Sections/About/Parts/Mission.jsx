import { IoPeopleOutline } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import { LuLeaf } from "react-icons/lu";

export const Mission = () =>{
    const data = [
        [LuLeaf,"Sustainability","Reducing food miles and packaging waste by connecting customers with local producers."],
        [IoPeopleOutline,"Community","Building stronger relationships between neighbors, producers, and local businesses."],
        [CiHeart,"Quality","Ensuring every product meets our high standards for freshness and craftsmanship."]
    ]
    return (
    <div className="py-[56px] bg-[#f5f5f7] flex justify-center">
        <div className="mission-section w-[800px]">
            <div className="text-[26.25px] mb-[28px] flex justify-center">Our Mission</div>
            <div className="text-[16.25px] mb-[28px] text-[#717182] flex justify-center text-center">
                We believe that local commerce is the backbone of thriving communities. Our mission is to
                create a sustainable marketplace that empowers local producers, 
                delights customers with fresh quality products, and strengthens the economic fabric of 
                neighborhoods everywhere.
            </div>
            <div className="mission-section-box flex justify-center gap-8">
                {
                    data.map(([Icon, value, label], index) => {
                        return (
                            <div key={index} className="w-[242px] h-[186px] bg-white rounded-lg p-[21px] items-center">
                                <div className="justify-center flex">
                                    <div className="bg-black h-[39px] w-[39px] rounded-lg flex items-center mb-[10px] justify-center">
                                        <Icon className="text-2xl text-white"/>
                                    </div>
                                </div>
                                <div className="mb-[14px] flex justify-center">{value}</div>
                                <div className="text-[12.25px] text-[#717182] flex justify-center text-center">{label}</div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    </div>)
}