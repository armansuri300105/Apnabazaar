import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { verifyEmail } from "../../../API/api";

const VerifyAccount = () => {
  const { verificationcode } = useParams();
  const [message, setMessage] = useState("Verifying your email...");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await verifyEmail(verificationcode);
        if (res?.data?.success) {
          setSuccess(true);
          setMessage("🎉 Your email has been verified successfully!");
        } else {
          setMessage(res?.data?.message || "Invalid or expired verification link.");
        }
      } catch (error) {
        console.error(error);
        setMessage("Something went wrong while verifying your account. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [verificationcode]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f7fa]">
      <div className="bg-white shadow-lg rounded-2xl p-8 text-center w-[90%] max-w-md">
        <img
          src="https://res.cloudinary.com/do9m8kc0b/image/upload/v1760161496/esftuk6irpikvltmbevx.png"
          alt="ApnaBazaar"
          className="w-28 mx-auto mb-5"
        />

        {loading ? (
          <>
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600 mt-4 text-sm">Verifying your email...</p>
          </>
        ) : (
          <>
            <h2
              className={`text-xl font-semibold mb-2 ${
                success ? "text-green-600" : "text-red-600"
              }`}
            >
              {success ? "Verification Successful ✅" : "Verification Failed ❌"}
            </h2>
            <p className="text-gray-600 text-sm">{message}</p>

            {success ? (
              <Link
                to="/signin"
                className="inline-block mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
              >
                Go to Login
              </Link>
            ) : (
              <button
                onClick={() => window.location.reload()}
                className="inline-block mt-6 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
              >
                Try Again
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyAccount;