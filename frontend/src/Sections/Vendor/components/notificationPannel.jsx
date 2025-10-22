import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { getNotifications, readNotification } from "../../../../API/api";
import { useNavigate } from "react-router-dom"

const NotificationPanel = ({setSelectedField}) => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(null)
  const panelRef = useRef(null);
  const navigate = useNavigate();
  const unreadCount = notifications?.filter(n => !n.isRead).length;

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const getNotification = async () => {
        const res = await getNotifications()
        setNotifications(res?.data?.notifications)
    }

    getNotification();
  },[])

  const handleNotificationRead = async (note) => {
    if (!note.isRead) await readNotification(note._id)
    if (note.type==="product_status"){
      setSelectedField("products")
    } else {
      setSelectedField("dashboard")
    }
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-all duration-200 shadow-sm"
      >
        <Bell className="w-5 h-5 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-xl border border-gray-200 z-50 overflow-hidden">
          <div className="p-3 border-b border-gray-100 font-semibold text-gray-800 bg-gray-50">
            Notifications
          </div>

          <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
            {notifications.length > 0 ? (
              notifications.map((note, index) => (
                <div
                onClick={() => handleNotificationRead(note)}
                  key={index}
                  className={`p-3 border-b border-gray-100 cursor-pointer transition-all duration-200 ${
                    note.isRead
                      ? "bg-white hover:bg-gray-50"
                      : "bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-l-4 border-blue-500 shadow-sm"
                  }`}
                >
                  <p className={`font-semibold mb-1 ${note.isRead ? "text-gray-800" : "text-blue-700"}`}>
                    {note.type}
                  </p>
                  <p className={`text-sm leading-snug ${note.isRead ? "text-gray-600" : "text-blue-600"}`}>
                    {note.message}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 text-sm">
                No new notifications
              </div>
            )}
          </div>

          <div className="p-2 text-center text-blue-600 text-sm font-medium hover:underline cursor-pointer bg-gray-50">
            View all
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;