const LoginError = ({ message, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center">
                <h2 className="text-xl font-bold text-red-500 mb-2">Login Failed</h2>
                <p className="text-gray-700 mb-4">{message}</p>
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default LoginError;
