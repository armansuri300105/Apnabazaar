const Vendor = ({vendor}) => {
  return (
    <>
      <div className="w-full p-[20px] border-2 rounded-xl">
        <div className="flex gap-[20px]">
            <img className="w-[50px] h-[50px] rounded-[50%]" src="/profile.jpg" alt="" />
            <div>
                <p>{vendor?.companyName}</p>
                <p className="text-[#717182]">{vendor?.address}</p>
            </div>
        </div>
      </div>
    </>
  )
}

export default Vendor