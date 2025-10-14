import { useState } from "react";
import { Bell, Settings, LogOut, Plus, Eye, Edit, Trash } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getproducts, getVendors, removeproduct } from "../../API/product";
import AddProductForm from "./AddProduct";
import Swal from "sweetalert2";
import "./Products.css";

export default function Products() {
  const [addProduct, setAddProduct] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selected, setSelected] = useState("All")
  const {data, isLoading, refetch} = useQuery({
    queryKey: ["product"],
    queryFn: getproducts,
    select: (res) => res?.data || null
  })

  const {data:vendors} = useQuery({
    queryKey: ["vendors"],
    queryFn: getVendors,
    select: (res) => res?.data?.vendors || null
  })
  const [product, setProduct] = useState({
    name: "",
    price: "",
    vendor: "",
    stock: "",
    category: "",
    description: "",
    images: [],
  });

  const [mode, setMode] = useState("add")

  if (isLoading){
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const products = data.products;
  
  const toggleSelectProduct = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedProducts.length === 0) {
      Swal.fire("No Product Selected", "Please select at least one product.", "warning");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${selectedProducts.length} products!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete them!",
    });

    if (result.isConfirmed) {
      try {
        for (const id of selectedProducts) {
          await removeproduct(id);
        }
        Swal.fire("Deleted!", "Selected products have been deleted.", "success");
        setSelectedProducts([]);
        refetch();
      } catch (error) {
        Swal.fire("Oops!", "Something went wrong.", "error");
      }
    }
  };

  const handleRemoveItem = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const res = await removeproduct(id);
      if (res?.data?.success) {
        Swal.fire("Deleted!", "Selected products have been deleted.", "success");
        refetch();
      } else {
        Swal.fire("Oops!", "Something went wrong.", "error");
      }
    }
  };
  const handleEdit = (product) => {
    setMode("edit")
    setAddProduct(true)
    setProduct({
      id: product?._id,
      name: product?.name,
      price: product?.price,
      vendor: "",
      stock: product?.stock,
      category: product?.category,
      description: product?.description,
      images: product?.images,
    })
  }

  const filteredProducts = products.filter(p => {
    if (selected === "All") return true;

    if (selected === "Apnabazaar") {
      return !p?.vendor?.vendor?.companyName; // products without vendor name
    }

    return p?.vendor?.vendor?.companyName === selected;
  });
  return (
    <div className="products-container min-h-screen bg-gray-50">
      <div className="flex-1 w-full p-4 overflow-x-hidden products-content">
        {/* Top Bar - Enhanced for Responsiveness */}
        <div className="products-desktop-header flex justify-between items-center gap-3 mb-6 w-full">
          <h2 className="products-title text-2xl font-bold">Products Management</h2>
          <div className="flex gap-3 items-center">
            <button className="p-2 rounded-full hover:bg-gray-200">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-200">
              <Settings className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-red-100 text-red-600">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Summary Cards - Improved Grid for All Screens */}
        <div className="products-summary-grid grid grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-sm">Total Products</p>
            <p className="products-summary-number text-xl font-bold">{products.length}</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-sm">In Stock</p>
            <p className="products-summary-number text-xl font-bold">
              {products.filter((p) => p.stock > 0).length}
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-sm">Out of Stock</p>
            <p className="products-summary-number text-xl font-bold text-red-500">
              {products.filter((p) => p.stock <= 0).length}
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-sm">Avg. Price</p>
            <p className="products-summary-number text-xl font-bold">
              ₹
              {(
                products.reduce((acc, p) => acc + p.price, 0) / products.length
              ).toFixed(2)}
            </p>
          </div>
        </div>
        {addProduct ? <AddProductForm setAddProduct={setAddProduct} refetch={refetch} mode={mode} product = {product} setProduct = {setProduct} /> : ``}

        {selectedProducts.length > 0 && (
          <div className="mb-4">
            <button
              onClick={handleDeleteSelected}
              className="px-4 py-2 bg-red-500 text-white rounded-lg shadow"
            >
              Delete Selected ({selectedProducts.length})
            </button>
          </div>
        )}
        <div className="category-section-items flex items-center gap-4 justify-start mb-[20px]">
            <div className="flex gap-[10px] items-center">
                <select className="outline-none border-solid border-[1px] h-9 px-2 flex justify-center rounded-md border-grey-100" value={selected} onChange={e => setSelected(e.target.value)}>
                  <option value="All">All</option>
                  <option value="Apnabazaar">Apnabazaar</option>
                    {
                      vendors && vendors?.map((v, index) => {
                        return <option key={index} value={v?.vendor?.companyName}>{v?.vendor?.companyName}</option>
                      })
                    }
                </select>
            </div>
        </div>
        {/* Mobile Product Cards for Small Screens */}
        <div className="products-mobile-cards mb-6">
          <div className="p-3">
            <input
              type="checkbox"
              onChange={(e) =>
                setSelectedProducts(
                  e.target.checked ? products.map((p) => p._id) : []
                )
              }
              checked={selectedProducts.length === products.length}
            />
          </div>
          <div className="flex flex-col gap-[15px]">
            {filteredProducts.map((p, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(p._id)}
                      onChange={() => toggleSelectProduct(p._id)}
                    />
                  </div>
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{p.name}</h3>
                    <p className="text-xs text-gray-500">{p?.vendor?.vendor?.companyName ? p?.vendor?.vendor?.companyName : "Apnabazaar"}</p>
                    <span className="inline-block mt-1 px-2 py-1 bg-gray-100 rounded-full text-xs">
                      {p.category}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <p className="text-gray-500">Price</p>
                    <p className="font-bold">₹{p.price}{p.oldPrice && <span className="ml-2 line-through text-gray-400 text-xs">${p.oldPrice}</span>}</p>
                  </div>
                  <div className="justify-self-end flex flex-col items-center">
                    <p className="text-gray-800 font-bold">Status</p>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      parseInt(p.stock) > 0
                        ? "bg-green-100 text-green-600" 
                        : "bg-red-100 text-red-600"
                    }`}>
                      {parseInt(p.stock) > 0 ? `In Stock` : `Out Of Stock`}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-500">Rating</p>
                    <p>{p.ratings?.average} <span className="text-gray-400 text-xs">({p.reviews.length})</span></p>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <Edit onClick={() => handleEdit(p)} className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-red-100 text-red-600 rounded">
                    <Trash onClick={() => handleRemoveItem(p._id)} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Table for Medium and Large Screens */}
        <div className="products-desktop-table bg-white rounded-lg shadow">
          <table className="w-full text-left">
            <thead className="bg-gray-100 w-full text-sm">
              <tr>
                 <th className="p-3">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      setSelectedProducts(
                        e.target.checked ? products.map((p) => p._id) : []
                      )
                    }
                    checked={selectedProducts.length === products.length}
                  />
                </th>
                <th className="p-3">Product</th>
                <th className="p-3">Category</th>
                <th className="p-3">Vendor</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p, index) => (
                <tr
                  key={index}
                  className="border-t hover:bg-gray-50 text-sm"
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(p._id)}
                      onChange={() => toggleSelectProduct(p._id)}
                    />
                  </td>
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium truncate w-48">{p.name}</p>
                      <p className="text-xs text-gray-500">{p?.vendor?.vendor?.companyName ? p?.vendor?.vendor?.companyName : "Apnabazaar"}</p>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                      {p.category}
                    </span>
                  </td>
                  <td className="p-3">{p?.vendor?.vendor?.companyName ? p?.vendor?.vendor?.companyName : "Apnabazaar"}</td>
                  <td className="p-3">
                    <span className="font-bold">₹{p.price}</span>
                    {p.oldPrice && (
                      <span className="ml-2 line-through text-gray-400 text-xs">
                        ${p.oldPrice}
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      parseInt(p.stock) > 0
                        ? "bg-green-100 text-green-600" 
                        : "bg-red-100 text-red-600"
                    }`}>
                      {parseInt(p.stock) > 0 ? `In Stock` : `Out Of Stock`}
                  </span>
                  </td>
                  <td className="p-3">
                    {p.ratings?.average}{"⭐"}
                    <span className="text-gray-400 text-xs">({p.reviews.length} reviews)</span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded">
                      <Edit onClick={() => handleEdit(p)} className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-red-100 text-red-600 rounded">
                      <Trash onClick={() => handleRemoveItem(p._id)} className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="products-fab fixed bottom-6 right-6 z-40 flex items-end group">
        <div className="products-fab-tooltip w-fit p-2 absolute right-[70px] bg-black/70 rounded mb-2 hidden group-hover:block">
          <p className="text-white text-sm whitespace-nowrap px-2">Add Product</p>
        </div>
        <button 
          onClick={() => setAddProduct(!addProduct)}
          className="flex items-center justify-center w-14 h-14 bg-black text-white rounded-full shadow-lg transition-transform duration-200 hover:scale-110"
        >
          {addProduct ? <Plus className="w-6 h-6 rotate-45 transition-transform duration-200" /> : <Plus className="w-6 h-6 transition-transform duration-200"/>}
        </button>
      </div>
    </div>
  );
}