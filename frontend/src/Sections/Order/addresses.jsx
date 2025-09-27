import { useState } from "react";
import AddressForm from "./addressForm";

const Addresses = ({user, addNew, setaddNew, addressForm, setAddressForm, setCount, count}) => {
  const [select, setSelect] = useState(false)
  const handleSelectAddress = (index) => {
    setAddressForm({
      email: user?.addresses[index]?.email,
      name: user?.addresses[index]?.name,
      street: user?.addresses[index]?.street,
      city: user?.addresses[index]?.city,
      state: user?.addresses[index]?.state,
      phone: user?.addresses[index]?.phone,
      zipcode: user?.addresses[index]?.zipcode,
      remember: false
    })
    setCount(2)
    setSelect(true)
  }
  return (
    <>
        {user?.addresses?.map((address, index) => (
          <div onClick={() => handleSelectAddress(index)} key={index} className={`${count===1 ? "cursor-pointer" : "cursor-not-allowed"} flex flex-col gap-[7px] p-6 border-2 rounded-xl ${select ? "border-yellow-400" : ""}`}>
            <div className="flex justify-between items-center">
                <h2 className="font-medium">Address</h2>
            </div>
            <p>{address?.name}</p>
            <p>{address?.email}</p>
            <p>{address?.phone}</p>
            <p>{address?.street}</p>
            <p>{address?.zipcode}</p>
            <p>{address?.city}</p>
            <p>{address?.state}</p>
          </div>
        ))}
        {!select && <button onClick={() => setaddNew(!addNew)} className="w-full h-[30px] bg-black text-white rounded-md text-[13px]">{addNew ? "Cancel"  : "Add New Address"}</button>}
        {addNew && <AddressForm addressForm={addressForm} setAddressForm={setAddressForm} setCount={setCount} addNew={addNew}/>}
    </>
  )
}

export default Addresses
