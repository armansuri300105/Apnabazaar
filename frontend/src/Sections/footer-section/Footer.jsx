import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import "./footer.css"
import FooterSkeleton from './footerSkeleton';
import {NavLink} from "react-router-dom"
import { MessageCircle } from 'lucide-react';
import ChatBot from '../chatbot/chatbot';

export const FooterSection = ({loadinguser}) => {
  return loadinguser ? <FooterSkeleton/> : (
    <>
      <footer className="bg-gray-50 border-t border-gray-200 px-6">
        <div className="footer-grid max-w-7xl mx-auto grid grid-cols-4 gap-12 p-[50px]">
          <div>
            <NavLink to="/"><div className="font-semibold mb-[25px]"><img className="w-[150px]" src="/logo.webp" alt="ApnaBazaar" /></div></NavLink>
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
              <li><NavLink to='/about'>About Us</NavLink></li>
              <li><NavLink to='/'>How It Works</NavLink></li>
              <li><NavLink to='/vendor/form'>Become a Vendor</NavLink></li>
              <li><NavLink to='/'>Delivery Info</NavLink></li>
              <li><NavLink to='/'>Help & Support</NavLink></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Categories</h4>
            <ul className="space-y-2 text-[12px] text-gray-700">
              <li><NavLink to='/categories/Dry%20Fruits'>Dry Fruits</NavLink></li>
              <li><NavLink to='/categories/Home%20%26%20Cleaning%20Essentials'>Home & Cleaning Essentials</NavLink></li>
              <li><NavLink to='/categories/Groceries%20%26%20Staples'>Groceries & Staples</NavLink></li>
              <li><NavLink to='/categories/Fruits%20%26%20Vegetables'>Fruits & Vegetables</NavLink></li>
              <li><NavLink to='/categories/Personal%20Care'>Personal Care</NavLink></li>
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
                <span className="font-medium">✉</span> apnabazaarbussiness.com
              </span>
              <span>
                <span className="font-medium">☎</span> 8529921648
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
        {<ChatBot/>}
      </footer>
    </>
  )
}
