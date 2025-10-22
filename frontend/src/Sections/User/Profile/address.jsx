import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import AddressSkeleton from "./Skeletons/addressSkeleton";
import { updateAddress } from "../../../../API/api";

const AddressCard = ({ address, onEdit }) => {
  return (
    <div className="relative border rounded-2xl p-4 min-w-[250px] shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <h3 className="font-medium">{address.label}</h3>
        <button
          onClick={() => onEdit(address)}
          className="text-gray-500 hover:text-black"
        >
          <Pencil size={16} />
        </button>
      </div>
      <p className="mt-2 font-semibold">{address?.email}</p>
      <p className="mt-2 font-semibold">{address?.name}</p>
      <p className="text-gray-600">{address?.street}</p>
      <p className="text-gray-600">{address?.city}, {address?.zipcode}</p>
      <p className="text-gray-600">{address?.state}</p>
      {address.default && (
        <span className="absolute top-3 right-10 text-xs bg-gray-100 px-2 py-1 rounded-md">
          Default
        </span>
      )}
    </div>
  );
};

export const SavedAddresses = ({user, loadinguser}) => {
  const [addresses, setAddresses] = useState([]);
  useEffect(() => {
    setAddresses(user?.addresses)
  },[user])
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const handleEdit = (address) => {
    setEditing(address.id);
    setForm(address);
  };

  const handleSave = async () => {
    setAddresses((prev) =>
      prev.map((addr) => (addr.id === editing ? form : addr))
    );
    const res = await updateAddress(form)
    if (!res?.data?.success){
      alert("Something went wrong")
    }
    setEditing(null);
  };

  return loadinguser ? <AddressSkeleton/> : (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="font-semibold text-lg">Saved Addresses</h2>
          <p className="text-gray-500 text-sm">Manage your delivery addresses</p>
        </div>
      </div>

      <div className="flex gap-6 flex-col">
        {addresses?.map((addr, index) =>
          editing === addr.id ? (
            <div key={index} className="border rounded-2xl p-4 min-w-[280px] bg-gray-50" >
              <input type="text" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border rounded-lg p-2 mb-2"/>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border rounded-lg p-2 mb-2"/>
              <input type="text" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} className="w-full border rounded-lg p-2 mb-2"/>
              <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full border rounded-lg p-2 mb-2"/>
              <input type="text" value={form.zipcode} onChange={(e) => setForm({ ...form, zipcode: e.target.value })} className="w-full border rounded-lg p-2 mb-2"/>
              <input type="text" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="w-full border rounded-lg p-2 mb-2"/>

              <div className="flex justify-end gap-2">
                <button onClick={() => setEditing(null)} className="px-3 py-1 rounded-lg border" >Cancel</button>
                <button onClick={handleSave} className="px-3 py-1 rounded-lg bg-black text-white" >Save</button>
              </div>
            </div>
          ) : (
            <AddressCard key={index} address={addr} onEdit={handleEdit} />
          )
        )}
      </div>
    </div>
  );
}