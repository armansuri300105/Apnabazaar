import { useContext, useEffect, useState } from "react";
import { FiMail, FiPhone, FiUser, FiLock } from "react-icons/fi";
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import {NavLink, useNavigate} from "react-router-dom"
import { googleLogin, signup } from "../../../API/api";
import {useGoogleLogin} from "@react-oauth/google"
import LoginError from "./loginError";
import { CartProductContext } from "../../services/context";

export default function SignupForm() {
  const {setCheckAuth} = useContext(CartProductContext)
    const [eye1, setEye1] = useState(false);
    const [eye2, setEye2] = useState(false);
    const [showbtn, setShowbtn] = useState(false);
    const [check, setCheck] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: false,
    subscribe: true,
  });

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  useEffect(() => {
    if (formData.firstName==="" || formData.lastName==="" || formData.email==="" || formData.phone==="" || formData.password==="" || formData.confirmPassword===""){
      setShowbtn(false);
    } else {
      setShowbtn(true);
    }
  },[formData])

  const Icon1 = eye1 ? IoIosEye : IoIosEyeOff;
  const Icon2 = eye2 ? IoIosEye : IoIosEyeOff;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const sendUserData = async (userData) => {
    try {
      return await signup(userData);
    } catch (error) {
      console.log(error);
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValidEmail(formData.email)){
      setCheck(true);
      setTimeout(() => {
        setCheck(false)
      }, 3000);
      return;
    }
    if (formData.firstName==="" || formData.lastName==="" || formData.email==="" || formData.phone==="" || formData.password==="" || formData.confirmPassword===""){
      alert("don't use your extra brain, just fill the form and continue")
      return;
    }
    const {email, phone, password, subscribe} = formData;
    const sendData = {
      name: formData.firstName + " " + formData.lastName,
      email,
      phone,
      password,
      subscribe
    }
    const res = sendUserData(sendData);
    navigate('/signin')
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      agree: false,
      subscribe: true,
    })
  };
  const responseGoogle = async (authResult) => {
    try {
      if (authResult['code']){
        const res = await googleLogin(authResult['code']);
        if (res?.data?.success){
          return navigate("/");
        }
        setErrorMessage("Login Error From google")
      }
    } catch (error) {
      console.error("Error while logging in with Google: ", error.message);
    }
  }
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code"
  })
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 rounded-lg">
        <div className="flex justify-center mb-4">
          <div className="font-semibold"><img className="w-[150px]" src="/logo.png" alt="ApnaBazaar" /></div>
        </div>
        {errorMessage && (
          <LoginError message={errorMessage} onClose={() => setErrorMessage("")} />
        )}
        <h1 className="text-xl font-semibold text-center">Join Apnabazaar</h1>
        <p className="text-gray-500 text-center mb-6">
          Create your account and start supporting local businesses
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 border-[#d8d8d8] border-[1px] rounded-xl p-[20px]">
          <h2 className="text-center font-medium">Create Account</h2>
          <p className="text-gray-500 text-center text-sm mb-4">
            Fill in your details to get started
          </p>

          <div className="flex gap-2">
            <div>
                <label className="text-[13px] ml-[3px] font-medium">First Name</label>
                <div  className="relative w-full">
                    <FiUser className="absolute left-3 top-[8px] text-gray-600" />
                    <input type="text" name="firstName" placeholder="John" value={formData.firstName} onChange={handleChange} className=" outline-none w-full pl-10 pr-3 h-[30px] border rounded-md text-sm bg-[#f3f3f5]"/>
                </div>
            </div>
            <div>
                <label className="text-[13px] ml-[3px] font-medium">Last Name</label>
                <div className="relative w-full">
                    <input type="text" name="lastName" placeholder="Doe" value={formData.lastName} onChange={handleChange} className=" outline-none bg-[#f3f3f5] w-full pl-3 pr-3 h-[30px] border rounded-md text-sm"/>
                </div>
            </div>
          </div>

          {/* Email */}
            <div>
                <label className="text-[13px] ml-[3px] font-medium">Email Address*</label>
                <div  className="relative w-full">
                    <FiMail className="absolute left-3 top-[8px] text-gray-600" />
                    <input type="email" name="email" placeholder="your@email.com" value={formData.email} onChange={handleChange} className=" outline-none bg-[#f3f3f5] w-full pl-10 pr-3 h-[30px] border rounded-md text-sm"/>
                </div>
                <p className={`${check ? "block" : "hidden"} text-[10px] text-red-700 ml-[3px] font-medium`}>Enter a valid email</p>
            </div>

          {/* Phone */}
          <div>
            <label className="text-[13px] ml-[3px] font-medium">Phone Number*</label>
            <div  className="relative w-full">
                <FiPhone className="absolute left-3 top-[8px] text-gray-600" />
                <input type="tel" name="phone" placeholder="+91 1234567124" value={formData.phone} onChange={handleChange} className=" outline-none bg-[#f3f3f5] w-full pl-10 pr-3 h-[30px] border rounded-md text-sm"/>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-[13px] ml-[3px] font-medium">Password</label>
            <div  className="relative w-full">
                <FiLock className="absolute left-3 top-[8px] text-gray-600" />
                <input type={eye1 ? "text" : "password"} name="password" placeholder="Create a strong password" value={formData.password} onChange={handleChange} className=" outline-none bg-[#f3f3f5] w-full pl-10 pr-3 h-[30px] border rounded-md text-sm"/>
                <Icon1 onClick={() => setEye1(!eye1)} className="absolute cursor-pointer right-3 top-[8px] text-gray-600"/>
                <p className="text-xs text-gray-500 mt-1">
                Must be at least 8 characters with numbers and letters
                </p> 
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-[13px] ml-[3px] font-medium">Confirm Password</label>
            <div  className="relative w-full">
                <FiLock className="absolute left-3 top-[8px] text-gray-600" />
                <input type={eye2 ? "text" : "password"} name="confirmPassword" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} className=" outline-none bg-[#f3f3f5] w-full pl-10 pr-3 h-[30px] border rounded-md text-sm"/>
                <Icon2 onClick={() => setEye2(!eye2)} className="absolute cursor-pointer right-3 top-[8px] text-gray-600"/>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex items-center gap-2">
            <input type="checkbox" name="agree" checked={formData.agree} onChange={handleChange}/>
            <label className="text-sm text-gray-600">
              I agree to the{" "}
              <a href="#" className="text-black font-medium">Terms of Service</a>{" "}
              and{" "}
              <a href="#" className="text-black font-medium">Privacy Policy</a>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" name="subscribe" checked={formData.subscribe} onChange={handleChange}/>
            <label className="text-sm text-gray-600">
              Subscribe to our newsletter for local deals and updates
            </label>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={formData.agree && showbtn ? false : true} className={`w-full h-[30px] text-[13px] text-white rounded-md ${formData.agree && showbtn ? "bg-gray-800" : "bg-gray-500"}`}>
            Create Account
          </button>

          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-gray-500 text-[12px]">OR SIGN UP WITH</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Social Buttons */}
          <div className="flex gap-3">
            <button onClick={handleGoogleLogin} className="flex-1 flex items-center justify-center text-[14px] gap-2 border rounded-md h-[30px] hover:bg-gray-50">
              <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-5 h-5"/>
              Google
            </button>
          </div>
          <div className="flex gap-[5px] justify-center">
            <p className="text-[12px] text-center">Already have an account?</p>
            <NavLink className="text-[12px] font-medium" to="/signin">Sign in here</NavLink>
          </div>
        </form>
        <NavLink to="/"><p className="text-[12px] text-gray-500 text-center mt-[20px]">← Back to Apnabazaar</p></NavLink>
      </div>
    </div>
  );
}
