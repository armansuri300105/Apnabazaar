import { useContext, useState } from "react";
import { addVendor } from "../../../API/api";
import { CartProductContext } from "../../services/context";

export default function VendorForm() {
    const {user, loadinguser} = useContext(CartProductContext)

  const [vendor, setVendor] = useState({
    address: "",
    companyName: "",
  });

  const [errors, setErrors] = useState({});

  // validation function
  const validate = () => {
    const newErrors = {};
    if (!vendor.address.trim()) newErrors.address = "Address is required";
    if (!vendor.companyName.trim())
      newErrors.companyName = "Company name is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendor((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
      console.log("Vendor Data: ", vendor);
      const res = await addVendor(vendor);
      console.log(res);
    if (res?.data?.success) alert("Application Submitted successfully!");
    else alert("Something went wrong")
  };
  
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
  console.log(user?.role === 'vendor' && user?.vendor?.status === "Pending")
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      {user?.role === 'vendor' && user?.vendor?.status === "Pending" ? (
        <div>
          <p>Application Under Review</p>
        </div>
      ) : user?.vendor?.status === "Active" ? (
        <div>
          <p>🎉🎉Congratulations, your application is accepted, you are now become a vendor</p>
        </div>
      ) : <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-6 rounded-xl shadow-md space-y-4"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
           Vendor Application Form
        </h2>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium mb-1">Address *</label>
          <textarea
            name="address"
            value={vendor.address}
            onChange={handleChange}
            className="w-full border rounded-md p-2 text-sm outline-none"
          />
          {errors.address && (
            <p className="text-red-600 text-xs">{errors.address}</p>
          )}
        </div>

        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Company Name *
          </label>
          <input
            type="text"
            name="companyName"
            value={vendor.companyName}
            onChange={handleChange}
            className="w-full border rounded-md p-2 text-sm outline-none"
          />
          {errors.companyName && (
            <p className="text-red-600 text-xs">{errors.companyName}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
        >
          Apply
        </button>
      </form>}
    </div>
  );
}