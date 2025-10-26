import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiLock } from "react-icons/fi";
import { resetPassword } from "../../../API/api";
import Swal from "sweetalert2";

const ResetPassword = () => {
  const { verificationToken } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const res = await resetPassword({ verificationToken, password });
    setLoading(false);

    if (res?.data?.success) {
      Swal.fire({
        icon: "success",
        title: "Password Reset Successful",
        text: "You can now log in with your new password.",
        confirmButtonColor: "#0f172a",
      });
      navigate("/signin");
    } else {
      Swal.fire({
        icon: "error",
        title: "Reset Failed",
        text: res?.data?.message || "Invalid or expired reset link.",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 rounded-lg bg-white shadow-md">
        <div className="flex justify-center mb-4">
          <img
            className="w-[150px]"
            src="/logo.webp"
            alt="ApnaBazaar"
          />
        </div>
        <h1 className="text-xl font-semibold text-center">Reset Your Password</h1>
        <p className="text-gray-500 text-center mb-6">
          Enter your new password below to secure your account.
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-2 rounded mb-3 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Password */}
          <div>
            <label className="text-[13px] ml-[3px] font-medium">
              New Password*
            </label>
            <div className="relative w-full">
              <FiLock className="absolute left-3 top-[8px] text-gray-600" />
              <input
                type="password"
                name="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="outline-none bg-[#f3f3f5] w-full pl-10 pr-3 h-[35px] border rounded-md text-sm"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-[13px] ml-[3px] font-medium">
              Confirm Password*
            </label>
            <div className="relative w-full">
              <FiLock className="absolute left-3 top-[8px] text-gray-600" />
              <input
                type="password"
                name="confirm"
                placeholder="Confirm new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="outline-none bg-[#f3f3f5] w-full pl-10 pr-3 h-[35px] border rounded-md text-sm"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full h-[35px] text-[13px] text-white rounded-md font-medium transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gray-800 hover:bg-gray-900"
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="text-[12px] text-gray-500 text-center mt-[20px]">
          ← Back to{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-[#0f172a] cursor-pointer font-medium"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;