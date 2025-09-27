import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import "./footer.css"
import FooterSkeleton from './footerSkeleton';

export const FooterSection = ({loadinguser}) => {
  return loadinguser ? <FooterSkeleton/> : (
    <>
      <footer className="bg-gray-50 border-t border-gray-200 px-6">
        <div className="footer-grid max-w-7xl mx-auto grid grid-cols-4 gap-12 p-[50px]">
          <div>
            <div className="font-semibold mb-[25px]"><img className="w-[150px]" src="/logo.png" alt="ApnaBazaar" /></div>
            <p className="text-[12px] text-gray-600 mb-4">
              Connecting communities with fresh, local products from trusted vendors. Support your neighborhood while enjoying quality goods.
            </p>
            <div className="flex space-x-4 text-gray-500 text-lg">
              <a href="/"><FaFacebookF /></a>
              <a href="/"><FaTwitter /></a>
              <a href="/"><FaInstagram /></a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-[12px] text-gray-700">
              <li><a href="#">About Us</a></li>
              <li><a href="#">How It Works</a></li>
              <li><a href="#">Become a Vendor</a></li>
              <li><a href="#">Delivery Info</a></li>
              <li><a href="#">Help & Support</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Categories</h4>
            <ul className="space-y-2 text-[12px] text-gray-700">
              <li><a href="#">Fresh Produce</a></li>
              <li><a href="#">Dairy & Eggs</a></li>
              <li><a href="#">Bakery</a></li>
              <li><a href="#">Meat & Seafood</a></li>
              <li><a href="#">Artisan Crafts</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Stay Updated</h4>
            <p className="text-[12px] text-gray-600 mb-3">
              Get notified about new vendors and special offers in your area.
            </p>
            <form className="flex flex-col gap-[5px] mb-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-black w-full text-sm"
              />
              <button
                type="submit"
                className="bg-black text-white px-4 py-2 rounded-md text-sm font-semibold"
              >Subscribe</button>
            </form>
            <div className="text-sm text-gray-700 flex flex-col space-y-1">
              <span>
                <span className="font-medium">✉</span> hello@apnabazaar.com
              </span>
              <span>
                <span className="font-medium">☎</span> (555) 123-4567
              </span>
            </div>
          </div>
        </div>

        <div className="copyright max-w-7xl mx-auto flex justify-between items-center mb-[10px] mt-10 pt-6 border-t border-gray-200 text-xs text-gray-500">
          <span>© 2025 Apnabazaar. All rights reserved.</span>
          <div className="flex space-x-4 mt-2">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </footer>
    </>
  )
}
