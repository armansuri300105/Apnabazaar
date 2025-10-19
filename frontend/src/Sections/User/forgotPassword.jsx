import { useState } from "react";
import { FiMail } from "react-icons/fi";
import { NavLink } from "react-router-dom";

const ForgotPassword = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if (!isValidEmail(formData.email)){
        // setCheck(true);
        // setTimeout(() => {
        //     setCheck(false)
        // }, 3000);
        // return;
        // }
        if (formData.email==="" || formData.password===""){
            alert("don't use your extra brain, just fill the form and continue")
            return;
        }
        // const res = await sendData(formData);
        // refetch()
        // if (res?.data?.success){
        //     setLoading(false)
        //     navigate('/');
        // } else {
        //     setLoading(false)
        //     setErrorMessage(res?.data?.message)
        // }
        setFormData({
            email: "",
            password: "",
        })
    };
  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 rounded-lg">
        <div className="flex justify-center mb-4">
          <div className="font-semibold"><img className="w-[150px]" src="/logo.png" alt="ApnaBazaar" /></div>
        </div>
        <h1 className="text-xl font-semibold text-center">Welcome back to Apnabazaar</h1>
        <p className="text-gray-500 text-center mb-6">
          Forgot Your Passoword
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 border-[#d8d8d8] border-[1px] rounded-xl p-[20px]">
          <h2 className="text-center font-medium">Sign In</h2>
          <p className="text-gray-500 text-center text-sm mb-4">
            Enter your credentials to access your account
          </p>

          {/* Email */}
            <div>
                <label className="text-[13px] ml-[3px] font-medium">Email Address*</label>
                <div  className="relative w-full">
                    <FiMail className="absolute left-3 top-[8px] text-gray-600" />
                    <input type="email" name="email" placeholder="your@email.com" value={formData.email} onChange={handleChange} className=" outline-none bg-[#f3f3f5] w-full pl-10 pr-3 h-[30px] border rounded-md text-sm"/>
                </div>
                {/* <p className={`${check ? "block" : "hidden"} text-[10px] text-red-700 ml-[3px] font-medium`}>Enter a valid email</p> */}
            </div>

          {/* Submit Button */}
          <button type="submit" className={`w-full h-[30px] text-[13px] text-white rounded-md bg-gray-800`}>
            Forgot Password
          </button>
        </form>
        <NavLink to="/"><p className="text-[12px] text-gray-500 text-center mt-[20px]">← Back to Apnabazaar</p></NavLink>
      </div>
    </div>
    </>
  )
}

export default ForgotPassword