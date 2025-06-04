"use client"

import { Edit, LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import { useEffect } from "react"
import { useState } from "react"

const Right_Profile = ({ user }) => {
    const [stats, setStats] = useState({
    repositories: 0,
    starred: 0,
  });
  const navigate = useNavigate()

  const handleEdit = () => {
    navigate("/edit")
  }

  useEffect(()=>{
 const fetchUserStats = async () => {
      try {
        const userId=localStorage.getItem('userId');
        const response = await axios.get(`http://localhost:8080/user/profile/${userId}`);
        const userData = response.data;

        const repoCount = userData.repositories?.length || 0;
        const starredCount = userData.starred_repositories?.length || 0;

        setStats({ repositories: repoCount, starred: starredCount });
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };
    fetchUserStats();
  },[]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token")
      await axios.post(
        "http://localhost:8080/user/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        },
      )
      localStorage.removeItem("token")
      localStorage.removeItem("userId")
      toast.success("Logged out successfully")
      navigate("/auth")
    } catch (e) {
      console.error("Logout failed", e)
      toast.error("Logout failed")
    }
  }

  return (
    <div className="md:w-2/3 flex flex-col justify-center">
      <div className="mb-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent mb-2">
          {user.username || "Username"}
        </h1>
        <p className="text-xl text-gray-400">{user.email || "email@example.com"}</p>
      </div>

      <div className="space-y-4">
        <button
          onClick={handleEdit}
          className="w-full md:w-auto bg-slate-700/70 hover:bg-slate-700 border border-gray-600/30 hover:border-teal-500/50 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
        >
          <Edit className="w-4 h-4" />
          <span>Edit Profile</span>
        </button>

        <button
          onClick={handleLogout}
          className="w-full md:w-auto bg-red-600/80 hover:bg-red-600 border border-red-500/30 hover:border-red-500 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      <div className="mt-8 p-4 bg-slate-700/30 rounded-lg border border-gray-600/20">
        <h3 className="text-lg font-semibold text-teal-300 mb-2">Profile Stats</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <span className="text-gray-400">Repositories</span>
        <p className="text-white font-medium">{stats.repositories}</p>
      </div>
      <div>
        <span className="text-gray-400">Starred</span>
        <p className="text-white font-medium">{stats.starred}</p>
      </div>
    </div>
      </div>
    </div>
  )
}

export default Right_Profile
