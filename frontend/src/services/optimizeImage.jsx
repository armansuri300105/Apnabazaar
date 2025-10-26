/**
 * Optimize Cloudinary image for performance
 * - Dynamically resizes, compresses, and serves modern formats (WebP/AVIF)
 * 
 * @param {string} url - Original Cloudinary image URL
 * @param {number} [width=300] - Desired width
 * @param {number} [height=300] - Desired height
 * @param {string} [cropMode="c_fill"] - Cloudinary crop mode (e.g., c_fill, c_fit)
 * @returns {string} Optimized Cloudinary image URL
 */
export const optimizeImage = (url, width = 300, height = 300, cropMode = "c_fill") => {
  if (!url || typeof url !== "string" || !url.includes("/upload/")) return url;

  return url.replace(
    "/upload/",
    `/upload/w_${width},h_${height},${cropMode},q_auto,f_auto/`
  );
};