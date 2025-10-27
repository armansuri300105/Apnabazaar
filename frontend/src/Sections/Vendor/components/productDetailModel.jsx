import { X, DollarSign, Image } from "lucide-react";
import { useState, useEffect } from "react";

// --- Custom Markdown to HTML Converter ---
const renderMarkdown = (text) => {
    if (!text) return { __html: "" };

    let html = text;
    
    // 1. Convert **Bold** to <strong>Bold</strong>
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // 2. Convert *Italic* to <em>Italic</em>
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // 3. Convert newlines to breaks for readability
    html = html.replace(/\n/g, '<br>');

    return { __html: html };
};

export const ProductDetailModal = ({ product, onClose }) => {
    if (!product) return null;

    const [mainImage, setMainImage] = useState(product.images[0]);
    const hasMultipleImages = product.images && product.images.length > 1;

    // FIX 1: Reset main image when a new product is passed to the modal
    useEffect(() => {
        if (product.images && product.images.length > 0) {
            setMainImage(product.images[0]);
        }
    }, [product._id]); // Assuming product has a unique _id

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
            <div className="bg-white relative w-full max-w-2xl rounded-xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                    <X className="w-6 h-6" />
                </button>
                
                <h2 className="text-2xl font-bold mb-4">{product.name} Details</h2>
                
                <div className="grid grid-cols-2 gap-6">
                    
                    {/* --- 1. Image Gallery / Display --- */}
                    <div className="col-span-2">
                        {/* Main Display Image */}
                        <div className="w-full h-80 rounded-lg overflow-hidden border border-gray-200 mb-3 flex items-center justify-center bg-gray-100">
                             {mainImage ? (
                                <img 
                                    src={mainImage} 
                                    alt={product.name} 
                                    className="w-full h-full object-contain"
                                />
                             ) : (
                                <span className="text-gray-500">No Main Image</span>
                             )}
                        </div>
                        
                        {/* Thumbnail Selector (Only if multiple images exist) */}
                        {hasMultipleImages && (
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {product.images.map((image, index) => (
                                    <div 
                                        key={index}
                                        onClick={() => setMainImage(image)}
                                        className={`w-16 h-16 flex-shrink-0 rounded-md overflow-hidden cursor-pointer border-2 transition-all 
                                            ${image === mainImage ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-blue-300'}`}
                                    >
                                        <img 
                                            src={image} 
                                            alt={`Thumbnail ${index + 1}`} 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                        {!product.images || product.images.length === 0 && (
                            <div className="h-20 flex items-center justify-center text-gray-500 bg-gray-100 rounded-lg">
                                <Image className="w-5 h-5 mr-2" /> No images available
                            </div>
                        )}
                    </div>
                    
                    {/* --- 2. Product Information --- */}
                    
                    {/* Key Info */}
                    <div className="flex flex-col">
                        <p className="text-gray-500 text-sm">Category</p>
                        <p className="font-medium">{product.category}</p>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-gray-500 text-sm">Price</p>
                        <p className="font-medium flex items-center">
                            <DollarSign className="w-4 h-4 mr-1"/>{product.price}
                        </p>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-gray-500 text-sm">Stock Available</p>
                        <p className={`font-medium ${product.stock <= 5 ? 'text-red-500' : 'text-green-600'}`}>
                            {product.stock} Units
                        </p>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-gray-500 text-sm">Rating</p>
                        <p className="font-medium">{product.ratings?.average} ⭐ ({product.reviews.length})</p>
                    </div>

                    {/* Description - FIX 2: Markdown Rendering */}
                    <div className="col-span-2 mt-2">
                        <p className="font-semibold mb-1">Description</p>
                        <div 
                            className="text-gray-600 text-sm leading-relaxed product-description-html"
                            // Use dangerouslySetInnerHTML to render the formatted HTML content
                            dangerouslySetInnerHTML={renderMarkdown(product.description)}
                        />
                    </div>
                    
                    {/* Vendor/Admin Status */}
                    <div className="col-span-2 mt-4 pt-3 border-t">
                        <p className="text-gray-500 text-sm">Admin Status</p>
                        <p className={`px-2 py-1 rounded-full text-xs w-fit ${
                            product.status === "Approved" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                        }`}>
                            {product.status}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};