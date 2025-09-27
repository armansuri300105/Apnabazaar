import { useEffect, useState } from "react";
import { FiMail, FiLock } from "react-icons/fi";
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import {NavLink, useNavigate} from "react-router-dom"
import { googleLogin, signin } from "../../API/product";
import {useGoogleLogin} from "@react-oauth/google"
import LoginError from "./loginError";

export default function SigninForm({setCheckAuth}) {
  const [eye1, setEye1] = useState(false);
  const [showbtn, setShowbtn] = useState(false);
  const [check, setCheck] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  useEffect(() => {
    if (formData.email==="" || formData.password===""){
      setShowbtn(false);
    } else {
      setShowbtn(true);
    }
  },[formData])

  const Icon1 = eye1 ? IoIosEye : IoIosEyeOff;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sendData = async (userData) => {
    try {
      return await signin(userData);
    } catch (error) {
      console.log("Sign in Error",error);
      throw error; // Re-throw to handle in handleSubmit
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isValidEmail(formData.email)){
      setCheck(true);
      setTimeout(() => {
        setCheck(false)
      }, 3000);
      return;
    }

    if (formData.email==="" || formData.password===""){
      alert("don't use your extra brain, just fill the form and continue")
      return;
    }

    try {
      const res = await sendData(formData);
      console.log(res); // Now res is defined
      
      if (res?.data?.success){
        // Update the authentication state in context
        setCheckAuth(true);
        navigate('/');
      } else {
        // Handle login failure
        setErrorMessage(res?.data?.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Login failed. Please try again.");
    }

    setFormData({
      email: "",
      password: "",
    })
  };

  const responseGoogle = async (authResult) => {
    try {
      if (authResult['code']){
        const res = await googleLogin(authResult['code']);
        if (res?.data?.success){
          // Update the authentication state for Google login too
          setCheckAuth(true);
          return navigate("/");
        }
        setErrorMessage("Login Error From google")
      }
    } catch (error) {
      console.error("Error while logging in with Google: ", error.message);
      setErrorMessage("Google login failed. Please try again.");
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

        <h1 className="text-xl font-semibold text-center">Welcome back to Apnabazaar</h1>
        <p className="text-gray-500 text-center mb-6">
          Sign in to your account to continue shopping local
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 border-[#d8d8d8] border-[1px] rounded-xl p-[20px]">
          <h2 className="text-center font-medium">Sign In</h2>
          <p className="text-gray-500 text-center text-sm mb-4">
            Enter your credentials to access your account
          </p>

          {/* Email */}
          <div>
            <label className="text-[13px] ml-[3px] font-medium">Email Address*</label>
            <div className="relative w-full">
              <FiMail className="absolute left-3 top-[8px] text-gray-600" />
              <input 
                type="email" 
                name="email" 
                placeholder="your@email.com" 
                value={formData.email} 
                onChange={handleChange} 
                className=" outline-none bg-[#f3f3f5] w-full pl-10 pr-3 h-[30px] border rounded-md text-sm"/>
            </div>
            <p className={`${check ? "block" : "hidden"} text-[10px] text-red-700 ml-[3px] font-medium`}>Enter a valid email</p>
          </div>

          {/* Password */}
          <div>
            <label className="text-[13px] ml-[3px] font-medium">Password</label>
            <div className="relative w-full">
              <FiLock className="absolute left-3 top-[8px] text-gray-600" />
              <input 
                type={eye1 ? "text" : "password"} 
                name="password" 
                placeholder="Create a strong password" 
                value={formData.password} 
                onChange={handleChange} 
                className=" outline-none bg-[#f3f3f5] w-full pl-10 pr-3 h-[30px] border rounded-md text-sm"/>
              <Icon1 onClick={() => setEye1(!eye1)} className="absolute cursor-pointer right-3 top-[8px] text-gray-600"/>
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 8 characters with numbers and letters
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={showbtn ? false : true} 
            className={`w-full h-[30px] text-[13px] text-white rounded-md ${showbtn ? "bg-gray-800" : "bg-gray-500"}`}>
            Sign in
          </button>

          {/* Divider */}
          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-gray-500 text-[12px]">OR SIGN UP WITH</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Social Buttons */}
          <div className="flex gap-3">
            <button onClick={handleGoogleLogin} className="flex-1 flex items-center justify-center gap-2 border rounded-md h-[30px] hover:bg-gray-50">
              <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-5 h-5"/>
              Google
            </button>
          </div>

          <div className="flex gap-[5px] justify-center">
            <p className="text-[12px] text-center">Already have an account?</p>
            <NavLink className="text-[12px] font-medium" to="/signup">Sign Up here</NavLink>
          </div>
        </form>

        <NavLink to="/"><p className="text-[12px] text-gray-500 text-center mt-[20px]">← Back to Apnabazaar</p></NavLink>
      </div>
    </div>
  );
}