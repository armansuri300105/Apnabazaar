import { useContext, useEffect, useState } from "react";
import { Edit, LogOut } from "lucide-react";
import {CartProductContext} from "../../../services/context"
import Overview from "./overview";
import PersonalInfo from "./personal";
import {SavedAddresses} from "./address";
import {logout} from "../../../../API/api"
import { useNavigate } from "react-router-dom";
import "./profile.css"
import Favorites from "./favorites";
import ProfileSkeleton from "./Skeletons/ProfileSkeleton"

const Profile = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { user, loadinguser } = useContext(CartProductContext)
  const navigate = useNavigate()

  const tabs = ["Overview", "Personal", "Addresses", "Favorites"];
  const handleLogout = async () => {
    try {
      const res = await logout();
      if (!res?.data?.success){
        return
      }
      navigate("/signup")
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    if (!loadinguser && !user){
      navigate(`/signup`)
    }
  },[user])
  
  return loadinguser ? <ProfileSkeleton/> : (
    <section className="min-h-screen bg-gray-50 flex justify-center">
      <div className="profile-section w-[1200px] p-6 mt-[120px]">
        <div className="profile-section-heading flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">My Profile</h1>
            <p className="text-gray-500">
              Manage your account settings and preferences
            </p>
          </div>
          <button onClick={handleLogout} className={`signOut-btn items-center gap-2 px-4 py-2 rounded-lg text-red-500 border border-red-300 hover:bg-red-100 transition ${user ? "flex" : "hidden"}`}>
            <LogOut className="logout-icon" size={18} /> Sign Out
          </button>
        </div>

        <div className="profile-section-box bg-white shadow rounded-xl p-6 flex justify-between items-center mb-6">
          <div className="profile-view-section flex items-center gap-4">
            <img src="/profile.jpg" alt="profile" className="w-20 h-20 rounded-full object-cover" />
            <div>
              <h2 className="text-xl font-bold">{user?.name}</h2>
              <p className="text-gray-500">{user?.email}</p>
              <div className="flex gap-4 text-sm text-gray-500 mt-2">
                <span>📅 {user?.createdAt}</span>
                <span>📦 {user?.orders?.length}</span>
              </div>
            </div>
          </div>
          <button onClick={() => setActiveTab(1)} className="edit-userprofile flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition">
            <Edit size={18} /> Edit Profile
          </button>
        </div>

        <div className="flex bg-gray-100 rounded-lg overflow-hidden mb-6 p-[5px]">
          {tabs.map((tab,index) => (
            <button key={index} onClick={() => setActiveTab(index)} className={`profile-tabs flex-1 py-2 rounded-lg font-medium ${ activeTab === index ? "bg-white shadow text-black" : "text-gray-500 hover:text-black" }`} >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 0 ? <Overview user={user} loadinguser={loadinguser} /> : activeTab === 1 ? <PersonalInfo user={user} loadinguser={loadinguser} /> : activeTab === 2 ? <SavedAddresses user={user} loadinguser={loadinguser} /> : <Favorites loadinguser={loadinguser}/>}
      </div>
    </section>
  );
};

export default Profile;