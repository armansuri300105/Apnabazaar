import { useEffect, useState } from "react";
import { updateUserDetail } from "../../../../API/api";
import PersonalSkeleton from "./Skeletons/personalSkeleton";

const PersonalInfo = ({user, loadinguser}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });
  const [originalData, setOriginalData] = useState({});
  
  useEffect(() => {
    if (user){
      const initialData = {
        firstName: user?.name?.split(" ")[0] || "",
        lastName: user?.name?.split(" ").slice(1).join(" ") || "",
        email: user?.email || "",
        phone: user?.phone || ""
      }
      setFormData(initialData)
      setOriginalData(initialData)
    }
  },[user])
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const updateUser = async () => {
    try {
      const res = await updateUserDetail(formData)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSave = () => {
    setIsEditing(false);
    setLoading(true)
    
    const isChanged = Object.keys(formData).some(
      (key) => formData[key] !== originalData[key]
    )

    if (isChanged){
      updateUser(formData);
    } else {
      console.log("No change made")
    }

    setLoading(false);
  };

  return loadinguser ? <PersonalSkeleton/> : (
    <div className="w-full mt-10 p-6 border rounded-2xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium">Personal Information</h2>
        {!isEditing ? (
          <button disabled={!user ? true : false} onClick={() => setIsEditing(true)} className="px-4 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700" >Edit</button>
        ) : (
          <button onClick={handleSave} className="px-4 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">{loading ? "Saving...." : "Save"}</button>
        )}
      </div>

      {user && <form className="grid grid-cols-1 gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-1">First Name</label>
            <input type="text" name="firstName" value={formData?.firstName} onChange={handleChange} readOnly={!isEditing} className={`outline-none text-[#717182] w-full rounded-lg border p-2 ${isEditing ? "border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400" : "bg-gray-50 border-gray-200 cursor-not-allowed"}`}/>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Last Name</label>
            <input type="text" name="lastName" value={formData?.lastName} onChange={handleChange} readOnly={!isEditing} className={`outline-none text-[#717182] w-full rounded-lg border p-2 ${isEditing ? "border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400" : "bg-gray-50 border-gray-200 cursor-not-allowed"}`}/>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Email Address</label>
          <input type="email" name="email" value={formData?.email} onChange={handleChange} readOnly={!isEditing} className={`outline-none text-[#717182] w-full rounded-lg border p-2 ${isEditing ? "border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400" : "bg-gray-50 border-gray-200 cursor-not-allowed"}`}/>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Phone Number</label>
          <input type="tel" name="phone" value={formData?.phone} onChange={handleChange} readOnly={!isEditing} className={`outline-none text-[#717182] w-full rounded-lg border p-2 ${isEditing ? "border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400" : "bg-gray-50 border-gray-200 cursor-not-allowed"}`}/>
        </div>
      </form>}
    </div>
  );
};

export default PersonalInfo;
