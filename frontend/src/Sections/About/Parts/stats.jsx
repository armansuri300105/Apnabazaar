import { IoPeopleOutline } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import { LuLeaf } from "react-icons/lu";
import { IoMedalOutline } from "react-icons/io5";

export const Stats = () =>{
    const data = [
        [IoPeopleOutline,"500+","Local Vendors"],
        [CiHeart,"10K+","Happy Customers"],
        [LuLeaf,"50+","Communities Served"],
        [IoMedalOutline,"4.9","Customer Rating"]
    ]
    return (
    <div className="py-[56px] flex justify-center">
        <div className="stats-section grid grid-cols-4 gap-4 w-[1000px]">
            {
                data.map(([Icon, value, label], index) => {
                    return (
                        <div key={index} className="text-center">
                            <div className="flex justify-center">
                                <div className="bg-neutral-200 h-14 w-14 rounded-full flex items-center mb-2 justify-center">
                                    <Icon className="text-2xl"/>
                                </div>
                            </div>
                            <div className="text-2xl mb-2 font-semibold ">{value}</div>
                            <div className="text-sm text-gray-500 mb-2">{label}</div>
                        </div>
                    )
                })
            }
        </div>
    </div>)
}