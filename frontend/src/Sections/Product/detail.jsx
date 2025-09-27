const Detail = ({product}) => {
  return (
    <>
        <div className="product-other-detail w-full p-[20px] border-2 rounded-xl flex gap-[30px]">
            <div className="product-other-detail-left w-[50%]">
              <h2 className="font-medium mb-[20px]">Product Specification</h2>
              <div className="flex flex-col gap-[10px]">
                  <div className="flex justify-between">
                    <p className="text-[#717182]">Origin:</p>
                    <p>India</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-[#717182]">Category:</p>
                    <p>{product?.category}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-[#717182]">Availability:</p>
                    <p>{product?.stock > 0 ? "In Stock" : "Out Of Stock"}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-[#717182]">Vendor:</p>
                    <p>Local</p>
                  </div>
              </div>
            </div>
            <div className="product-other-detail-right w-[50%]">
              <h2 className="font-medium mb-[20px]">About this Product</h2>
              <p className="text-[#717182]">{product?.description}</p>
            </div>
        </div>
    </>
  )
}

export default Detail
