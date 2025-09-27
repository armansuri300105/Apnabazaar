import { Star } from 'lucide-react'

const Reviews = ({product}) => {
  return (
    <>
      <div className="w-full p-[20px] border-2 rounded-xl flex flex-col gap-[30px]">
        <h2>Customer Reviews</h2>
        <div className='flex gap-[20px]'>
            <img className="w-[50px] h-[50px] rounded-[50%]" src="/profile.jpg" alt="" />
            <div>
                <div className='review-rating flex gap-[25px] items-center flex-wrap'>
                    <p>Name</p>
                    <div className='flex gap-[5px]'>
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={16} className={i < Math.floor(product?.rating) ? "fill-yellow-500 text-yellow-500" : "text-gray-300"} />
                        ))}
                    </div>
                    <p className="text-[#717182]">Date</p>
                </div>
                <p className="text-[#717182]">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus necessitatibus voluptate in odio pariatur rem impedit atque nemo voluptatem dolor.</p>
            </div>
        </div>
      </div>
    </>
  )
}

export default Reviews
