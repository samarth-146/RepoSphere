"use client"

import { Plus, Database } from "lucide-react"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"

const Navbar = () => {
  const [profile, setProfile] = useState({})

  useEffect(() => {
    const fetchProfilePic = async () => {
      const userId = localStorage.getItem("userId")
      const response = await axios.get(`https://reposphere.onrender.com/user/profilepic/${userId}`)
      setProfile(response.data)
    }
    fetchProfilePic()
  }, [])

  return (
    <nav className="bg-slate-800/90 backdrop-blur-sm border-b border-gray-700/30 px-6 py-4 shadow-lg">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg">
              <Database className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              RepoSphere
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <Link
            to="/create"
            className="flex items-center space-x-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Plus className="h-4 w-4" />
            <span className="font-medium">New</span>
          </Link>
          <Link to="/profile" className="relative">
            <img
              src={profile?.url || "/placeholder.svg?height=32&width=32"}
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-teal-400 hover:border-cyan-400 transition-colors duration-200"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-800"></div>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
