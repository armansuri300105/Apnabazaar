import { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { addVendorProduct } from "../../../../API/api";

const CLOUDINARY_UPLOAD_PRESET = "ecommerce";
const CLOUDINARY_CLOUD_NAME = "do9m8kc0b";
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

const AddProductForm = ({setAddProduct}) => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    images: [],
  });

  const [uploading, setUploading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Upload images to cloudinary
  const onDrop = async (acceptedFiles) => {
    setUploading(true);
    try {
      const uploadedImages = await Promise.all(
        acceptedFiles.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

          const res = await axios.post(CLOUDINARY_URL, formData);
          return res.data.secure_url; // return the uploaded URL
        })
      );

      setProduct((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedImages],
      }));
    } catch (err) {
      console.error("Cloudinary upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: { "image/*": [] },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Final Product Data:", product);
    const res = await addVendorProduct(product);
    if (res?.data?.success){
      alert("Product Added Successfully")
    } else {
      alert("Something went Wrong")
    }
    setProduct({
        name: "",
        price: "",
        stock: "",
        category: "",
        description: "",
        images: [],
    })
  };
  const options = ["Groceries & Staples","Fruits & Vegetables","Dairy & Bakery","Snacks & Beverages","Personal Care","Home & Cleaning Essentials","Packaged Foods","Baby & Kids Care","Stationery & Household Items","Meat, Fish & Frozen Foods"]
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-6 mt-[30px] mb-[30px]">
      <h2 className="text-lg font-semibold mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Product Name */}
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleChange}
          className="border rounded-md px-3 py-2 focus:outline-none focus:ring w-full"
        />

        {/* Price */}
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={product.price}
          onChange={handleChange}
          className="border rounded-md px-3 py-2 focus:outline-none focus:ring w-full"
        />

        <input
          type="text"
          name="stock"
          placeholder="Stock"
          value={product.stock}
          onChange={handleChange}
          className="border rounded-md px-3 py-2 focus:outline-none focus:ring w-full"
        />
        {/* Category */}
        <select
          name="category"
          value={product.category}
          onChange={handleChange}
          className="border rounded-md px-3 py-2 focus:outline-none focus:ring w-full"
        >
          <option value="">Select Category</option>
          {
            options.map((option, index) => {
              return <option key={index} value={option}>{option}</option>
            })
          }
        </select>

        {/* Drag and Drop File Upload */}
        <div
          {...getRootProps()}
          className={`col-span-2 border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer ${
            isDragActive ? "border-indigo-500 bg-indigo-50" : "border-gray-300"
          }`}
        >
          <input {...getInputProps()} />
          <p className="text-gray-600 text-sm">
            {uploading
              ? "Uploading..."
              : isDragActive
              ? "Drop the files here..."
              : "Drag & drop product images here, or click to select files"}
          </p>
        </div>

        {/* Preview of selected files */}
        <div className="col-span-2 flex gap-3 flex-wrap">
          {product.images.map((url, idx) => (
            <div key={idx} className="w-20 h-20 relative border rounded-md overflow-hidden">
              <img src={url} alt={`uploaded-${idx}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {/* Description */}
        <textarea
          name="description"
          placeholder="Product Description"
          value={product.description}
          onChange={handleChange}
          className="col-span-2 border rounded-md px-3 py-2 focus:outline-none focus:ring w-full"
          rows="3"
        ></textarea>

        {/* Buttons */}
        <div className="col-span-2 flex gap-3 mt-2">
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
          >
            Add Product
          </button>
          <button
            onClick={() => setAddProduct(false)}
            type="button"
            className="border px-4 py-2 rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;