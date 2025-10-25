import { useState } from 'react'
import { cancelOrder } from '../../../API/api';
import Swal from 'sweetalert2';

const CancelForm = ({orderId, refetch}) => {
    const [cancel, setCancel] = useState(false);
    const [reason, setReason] = useState("");
    const [note, setNote] = useState("");

    const handleCancelOrder = async ({reason, note}) => {
      const res = await cancelOrder({orderId, reason, note})
      if (res?.data?.success){
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Order cancelled successfully",
          timer: 2000,
          showConfirmButton: false,
        });
        
        refetch()
      }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!reason) return alert("Please select a reason for cancellation.");

        handleCancelOrder({ reason, note });

        setCancel(false);
        setReason("");
        setNote("");
    };
  return (
    <div className="mt-4">
      {!cancel && (
        <button
          onClick={() => setCancel(true)}
          className="w-[120px] h-[40px] rounded-md bg-red-500 text-white hover:bg-red-600 transition-all"
        >
          Cancel Order
        </button>
      )}

      {cancel && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 p-4 border rounded-lg shadow-md bg-gray-50 w-[350px]"
        >
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            Cancel Order
          </h3>

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason for cancellation
          </label>
          <select
            className="w-full p-2 border rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-red-400"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          >
            <option value="">-- Select Reason --</option>
            <option value="Ordered by mistake">Ordered by mistake</option>
            <option value="Found cheaper elsewhere">Found cheaper elsewhere</option>
            <option value="Item not needed anymore">Item not needed anymore</option>
            <option value="Other">Other</option>
          </select>

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional note (optional)
          </label>
          <textarea
            className="w-full p-2 border rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-red-400"
            rows="3"
            placeholder="Write your note here..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setCancel(false)}
              className="w-[100px] h-[35px] rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400 transition-all"
            >
              Back
            </button>
            <button
              type="submit"
              className="w-[100px] h-[35px] rounded-md bg-red-500 text-white hover:bg-red-600 transition-all"
            >
              Confirm
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default CancelForm