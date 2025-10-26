export const MeetTeam = () =>{
    const data = [
        {image: "", role: "Full stack", name: "Md. ARSHAD MANSURI", bio: "Backend and Frontend Developer"},
        {image: "", role: "ML Developer", name: "Om Chiddarwar", bio: "ML Developer"},
        {image: "", role: "Full Stack", name: "ANIKET GUPTA", bio: "Frontend Developer"},
        {image: "", role: "Designer", name: "AWHAN RAY", bio: "UI & UX Design"},
    ]
    return (
    <div className="py-[56px] flex justify-center">
        <div className="team-section flex flex-col items-center">
            <div className="text-[26.25px] mb-[14px] font-semibold">Meet our team</div>
            <div className="text-[14.25px] mb-[42px] text-[#717182] text-center">
                We're a passionate group of individuals dedicated to making local commerce accessible and enjoyable for everyone.
            </div>
            <div className="team-section-box grid grid-cols-4 justify-center gap-8">
                {
                    data.map((detail, index) => {
                        return (
                            <div key={index} className="h-[238px] w-[251px] p-[21px] border-soild border-[1px] justify-self-center border-grey-100 rounded-xl">
                                <div className="flex flex-col items-center gap-[7px]">
                                    <div className="bg-black h-20 w-20 rounded-[50%] mb-4">
                                        <img className="w-20 h-20 rounded-[50%]" src={detail.image || "/profile.webp"} alt="" />
                                    </div>
                                    <div className="text-[14px] text-center font-semibold">{detail.name}</div>
                                    <div className="text-[12.25px] mb-[7px]">{detail.role}</div>
                                    <div className="text-[12.25px] text-[#717182] text-center">{detail.bio}</div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    </div>)
}