import { useContext, useEffect, useState } from 'react'
import { Edit, Star, Trash } from 'lucide-react'
import { CartProductContext } from '../../services/context'
import { deleteReview, editReview, RatingAndReview } from '../../../API/api'

const Reviews = ({ product, refetch }) => {
  const {user, loadinguser} = useContext(CartProductContext)
  const [canComment, setCanComment] = useState(false);
  const [mode, setMode] = useState('add')

  useEffect(() => {
    const comment = product?.reviews?.filter(r => r.user===user?._id)
    if (comment.length===0) setCanComment(true)
    else setCanComment(false)
  },[user, product])

  const [showForm, setShowForm] = useState(false)
  const [newReview, setNewReview] = useState({ rating: 0, review: '' })

  const handleAddReview = async (e) => {
    e.preventDefault()
    if (!newReview.review.trim() || newReview.rating === 0) return

    const reviewData = {
      user: user?._id,
      name: user?.name,
      rating: newReview.rating,
      review: newReview.review,
      date: new Date().toLocaleDateString('en-GB'),
      productID: product?._id
    }
    let res;
    if (mode==='add'){
      res = await RatingAndReview(reviewData);
    } else {
      res = await editReview(reviewData);
    }
    if (res?.data?.success){
      setNewReview({ rating: 0, review: '' })
    } else {
      alert("There is an error to add rating")
    }
    setShowForm(false)
    setMode('add')
    refetch()
  }

  if (loadinguser){
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const handleEditComment = (review) => {
    setMode("edit")
    setShowForm(true)
    setNewReview({ rating: review?.rating, review: review?.comment })
  }

  const handleDeleteComment = async (id) => {
    await deleteReview(id);
    refetch()
  }
  return (
    <div className="w-full p-5 border-2 rounded-xl flex flex-col gap-6">
      <h2 className="text-lg font-semibold">Customer Reviews</h2>

      {user && canComment ? <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg w-fit hover:bg-blue-700 transition-all"
      >
        {showForm ? 'Cancel' : 'Add Review'}
      </button> : ""}

      {showForm && (
        <form onSubmit={handleAddReview} className="flex flex-col gap-3 p-4 border rounded-lg bg-gray-50">
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={20}
                className={`cursor-pointer ${i < newReview.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`}
                onClick={() => setNewReview({ ...newReview, rating: i + 1 })}
              />
            ))}
          </div>

          <textarea
            placeholder="Write your review..."
            className="border p-2 rounded-md resize-none"
            rows={3}
            value={newReview.review}
            onChange={(e) => setNewReview({ ...newReview, review: e.target.value })}
          />
          <div className='flex gap-[10px]'>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-md w-fit hover:bg-green-700 transition-all"
            >
              {mode==="add" ? "Submit Review" : "Edit Review"}
            </button>
            <button onClick={() => { setMode('add'); setShowForm(false)}} className="bg-transparent text-black px-4 py-2 rounded-md w-fit border-black border-[1px]">Cancel</button>
          </div>
        </form>
      )}

      {product?.reviews.map((r, idx) => (
        <div key={idx} className="grid grid-cols-[50px_1fr_100px] gap-4 border-b pb-4">
          <img className="w-12 h-12 rounded-full" src="/profile.jpg" alt="profile" />
          <div>
            <div className="flex gap-4 items-center flex-wrap">
              <p className="font-medium">{r?.username}</p>
              <div className="flex gap-[3px]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < r?.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}
                  />
                ))}
              </div>
              <p className="text-gray-500 text-sm">{new Date(r?.createdAt).toLocaleDateString()}</p>
            </div>
            <p className="text-gray-600 mt-1">{r?.comment}</p>
          </div>
          {r?.user===user?._id && mode!=='edit' ? <div className='flex gap-[20px]'>
            <button onClick={() => handleEditComment(r)}><Edit className='w-[17px]'/></button>
            <button onClick={() => handleDeleteComment(product?._id)}><Trash className='w-[17px]' color='red'/></button>
          </div> : ""}
        </div>
      ))}
    </div>
  )
}

export default Reviews