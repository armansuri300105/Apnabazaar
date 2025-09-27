import "../about.css"
export const Story = ()=>{
    return (
    <div className="about-story-main mt-[130px] bg-white flex justify-center">
        <div className="about-story-box flex gap-12 items-center mb-[56px]">
            <div className="w-[500px] pd-[20px]">
                <div className="bg-black text-white text-[10.5px] w-[57px] h-[19px] rounded-md flex items-center justify-center">
                    Our story
                </div>
                <div className="about-story-heading text-[42px] mb-[21px]">
                    Connecting Communities Through
                    Local Commerce
                </div>
                <div className="about-story-detail text-[15.75px] text-[#717182] mb-[21px]">
                    Founded in 2020, Apnabazaar was born from a simple belief: communities thrive when neighbors support
                    each other. We're building a platform where local producers can reach more customers while shoppers
                    discover the best their community has to offer
                </div>
                <div className="h-[35px] w-[149px] text-[12.25px] font-semibold text-white bg-black rounded-lg flex items-center justify-center gap-2">
                    Join our Mission
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                    </svg>
                </div>
            </div>
            <img className="about-story-img w-[500px] h-[500px] rounded-xl"  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=600&fit=crop"/>
        </div>
    </div>)
}