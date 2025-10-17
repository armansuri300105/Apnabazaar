import { useState, useEffect } from "react";
import { sendVerification } from "../../../API/api";

const SendVerification = () => {
  const [message, setMessage] = useState("Sending verification mail...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sendVerificationMail = async () => {
      try {
        const res = await sendVerification();
        if (res?.data?.success) {
          setMessage("Verification mail sent successfully! Please check your email and verify your account. 📩");
        } else {
          setMessage(res?.data?.message || "Something went wrong. Please try again later.");
        }
      } catch (error) {
        console.error(error);
        setMessage("Failed to send verification mail. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    sendVerificationMail();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f7fa]">
      <div className="bg-white shadow-lg rounded-2xl p-8 text-center w-[90%] max-w-md">
        <img
          src="https://res.cloudinary.com/do9m8kc0b/image/upload/v1760161496/esftuk6irpikvltmbevx.png"
          alt="ApnaBazaar"
          className="w-28 mx-auto mb-4"
        />

        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 text-sm">Sending verification mail...</p>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Email Verification</h2>
            <p className="text-gray-600 text-sm">{message}</p>
            {!message.toLowerCase().includes("successfully") ? (
              <button
                onClick={() => window.location.reload()}
                className="mt-5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
              >
                Try Again
              </button>
            ) : (
              <p className="mt-5 text-green-600 font-medium">✅ Verification mail sent!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SendVerification;