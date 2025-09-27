export const HomeBottom =() =>{
    const data = [
        ["🚚","Fast Delivery","Same-day delivery from local vendors in your neighborhood"],
        ["🌱","Fresh & Local","Sourced directly from local farmers and artisans"],
        ["💛","Support Local","Every purchase supports your local community"],
    ]
    return (
    <div className="homeBotton-box bg-[#f5f5f7] py-[42px] flex justify-center">
        {
            data.map((item, index) => {
                return (
                    <div key={index} className="h-[122.5px] ml-2 w-[346px]">
                        <div className="flex justify-center">
                            <span className="rounded-full bg-black p-3 text-xl">{item[0]}</span>
                        </div>
                        <div className="mt-4 flex justify-center text-[14px]">
                            {item[1]}
                        </div>
                        <div className="mt-4 text-[12.25px] text-[#717182] text-center">
                            {item[2]}
                        </div>
                    </div>
                )
            })
        }
            
    </div>)
}