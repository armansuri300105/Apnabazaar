import { useContext, useEffect, useState } from "react";
import { FiMail, FiPhone, FiUser, FiLock } from "react-icons/fi";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { NavLink, useNavigate } from "react-router-dom";
import { googleLogin, signup } from "../../../API/api";
import { useGoogleLogin } from "@react-oauth/google";
import LoginError from "./loginError";
import { CartProductContext } from "../../services/context";

export default function SignupForm() {
  const { refetch } = useContext(CartProductContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const [eye1, setEye1] = useState(false);
  const [eye2, setEye2] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});

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

  // Email validation
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Phone validation
  const isValidPhone = (phone) => /^[0-9]{10}$/.test(phone);

  // Password strength validation
  const isValidPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/.test(
      password
    );

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";

    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!isValidEmail(formData.email))
      errors.email = "Enter a valid email";

    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    else if (!isValidPhone(formData.phone))
      errors.phone = "Enter a valid 10-digit phone number";

    if (!formData.password) errors.password = "Password is required";
    else if (!isValidPassword(formData.password))
      errors.password =
        "Must be 8+ chars with uppercase, lowercase, number & symbol";

    if (!formData.confirmPassword)
      errors.confirmPassword = "Confirm your password";
    else if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = "Passwords do not match";

    if (!formData.agree)
      errors.agree = "You must agree to the Terms and Privacy Policy";

    return errors;
  };

  const sendUserData = async (userData) => {
    try {
      return await signup(userData);
    } catch (error) {
      console.log(error);
    }
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    const { email, phone, password, subscribe } = formData;
    const sendData = {
      name: formData.firstName + " " + formData.lastName,
      email,
      phone,
      password,
      subscribe,
    };

    const res = await sendUserData(sendData);
    if (res?.data?.success) {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        agree: false,
        subscribe: true,
      });
      setLoading(false)
      refetch();
      navigate("/signin");
    } else {
      setErrorMessage(res?.data?.message)
    }

    setLoading(false)
  };

  // Google Login
  const responseGoogle = async (authResult) => {
    try {
      if (authResult["code"]) {
        const res = await googleLogin(authResult["code"]);
        refetch();
        if (res?.data?.success) return navigate("/");
        setErrorMessage("Login Error From Google");
      }
    } catch (error) {
      console.error("Google Login Error:", error.message);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  const Icon1 = eye1 ? IoIosEye : IoIosEyeOff;
  const Icon2 = eye2 ? IoIosEye : IoIosEyeOff;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 rounded-lg">
        <div className="flex justify-center mb-4">
          <img className="w-[150px]" src="/logo.webp" alt="ApnaBazaar" />
        </div>

        {errorMessage && (
          <LoginError message={errorMessage} onClose={() => setErrorMessage("")} />
        )}

        <h1 className="text-xl font-semibold text-center">Join Apnabazaar</h1>
        <p className="text-gray-500 text-center mb-6">
          Create your account and start supporting local businesses
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-gray-50 border-[#d8d8d8] border-[1px] rounded-xl p-[20px]"
        >
          {/* First & Last Name */}
          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="text-[13px] ml-[3px] font-medium">First Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-[8px] text-gray-600" />
                <input
                  type="text"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="outline-none bg-[#f3f3f5] w-full pl-10 pr-3 h-[30px] border rounded-md text-sm"
                />
              </div>
              {formErrors.firstName && (
                <p className="text-[11px] text-red-600 ml-1">{formErrors.firstName}</p>
              )}
            </div>

            <div className="w-1/2">
              <label className="text-[13px] ml-[3px] font-medium">Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                className="outline-none bg-[#f3f3f5] w-full pl-3 pr-3 h-[30px] border rounded-md text-sm"
              />
              {formErrors.lastName && (
                <p className="text-[11px] text-red-600 ml-1">{formErrors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-[13px] ml-[3px] font-medium">Email Address*</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-[8px] text-gray-600" />
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                className="outline-none bg-[#f3f3f5] w-full pl-10 pr-3 h-[30px] border rounded-md text-sm"
              />
            </div>
            {formErrors.email && (
              <p className="text-[11px] text-red-600 ml-1">{formErrors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="text-[13px] ml-[3px] font-medium">Phone Number*</label>
            <div className="relative">
              <FiPhone className="absolute left-3 top-[8px] text-gray-600" />
              <input
                type="tel"
                name="phone"
                placeholder="1234567890"
                value={formData.phone}
                onChange={handleChange}
                className="outline-none bg-[#f3f3f5] w-full pl-10 pr-3 h-[30px] border rounded-md text-sm"
              />
            </div>
            {formErrors.phone && (
              <p className="text-[11px] text-red-600 ml-1">{formErrors.phone}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-[13px] ml-[3px] font-medium">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-[8px] text-gray-600" />
              <input
                type={eye1 ? "text" : "password"}
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                className="outline-none bg-[#f3f3f5] w-full pl-10 pr-3 h-[30px] border rounded-md text-sm"
              />
              <Icon1
                onClick={() => setEye1(!eye1)}
                className="absolute cursor-pointer right-3 top-[8px] text-gray-600"
              />
            </div>
            {formErrors.password && (
              <p className="text-[11px] text-red-600 ml-1">{formErrors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-[13px] ml-[3px] font-medium">Confirm Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-[8px] text-gray-600" />
              <input
                type={eye2 ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="outline-none bg-[#f3f3f5] w-full pl-10 pr-3 h-[30px] border rounded-md text-sm"
              />
              <Icon2
                onClick={() => setEye2(!eye2)}
                className="absolute cursor-pointer right-3 top-[8px] text-gray-600"
              />
            </div>
            {formErrors.confirmPassword && (
              <p className="text-[11px] text-red-600 ml-1">{formErrors.confirmPassword}</p>
            )}
          </div>

          {/* Checkboxes */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
              className="mt-1"
            />
            <label className="text-sm text-gray-600">
              I agree to the{" "}
              <a href="#" className="text-black font-medium">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-black font-medium">
                Privacy Policy
              </a>
            </label>
          </div>
          {formErrors.agree && (
            <p className="text-[11px] text-red-600 ml-1">{formErrors.agree}</p>
          )}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="subscribe"
              checked={formData.subscribe}
              onChange={handleChange}
            />
            <label className="text-sm text-gray-600">
              Subscribe to our newsletter for local deals and updates
            </label>
          </div>

          {/* Submit */}
          <button
            disabled={loading}
            type="submit"
            className={`w-full h-[35px] text-[13px] text-white rounded-md ${
              formData.agree && !loading ? "bg-gray-800 hover:bg-black" : "bg-gray-400"
            }`}
          >
            {!loading ? "Create Account" : "Loading..."}
          </button>

          {/* OR Google */}
          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-gray-500 text-[12px]">OR SIGN UP WITH</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <button
            onClick={handleGoogleLogin}
            type="button"
            className="flex items-center justify-center gap-2 border rounded-md h-[35px] w-full hover:bg-gray-50 text-sm"
          >
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Google
          </button>

          <div className="flex justify-center text-[12px] mt-4">
            <p>Already have an account?</p>
            <NavLink to="/signin" className="ml-1 font-medium">
              Sign in here
            </NavLink>
          </div>
        </form>

        <NavLink to="/">
          <p className="text-[12px] text-gray-500 text-center mt-[20px]">
            ← Back to Apnabazaar
          </p>
        </NavLink>
      </div>
    </div>
  );
}