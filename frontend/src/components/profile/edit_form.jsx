"use client"

import { useEffect, useState } from "react"
import { Home, Database, User } from "lucide-react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const Navbar = () => {
  return (
    <nav className="bg-slate-800/90 backdrop-blur-sm border-b border-gray-700/30 px-6 py-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="p-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg">
            <Database className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
            RepoSphere
          </span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className="text-gray-300 hover:text-teal-300 flex items-center space-x-2 transition-colors duration-200"
          >
            <Home size={18} />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}

const Edit_Form = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("userId")
        const response = await axios.get(`http://localhost:8080/user/profile/${userId}`)
        setUser(response.data)
        setEmail(response.data.email)
      } catch (error) {
        toast.error("Failed to fetch user profile")
      }
    }
    fetchUser()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const data = {
        email: email,
        password: password,
      }
      const userId = localStorage.getItem("userId")
      await axios.put(`http://localhost:8080/user/${userId}`, data)

      toast.success("Profile updated successfully", { position: "top-right" })
      navigate("/profile")
    } catch (e) {
      if (e.response) {
        const { status } = e.response
        if(status==400)
          toast.error("Email already exists",{position:"top-right"});
        else if (status === 500) {
          toast.error("Internal Server Error", { position: "top-right" })
        } else {
          toast.error("Something went wrong!!", { position: "top-right" })
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-white text-lg">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6">
        <div className="w-full max-w-md">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-gray-700/20 rounded-xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full">
                  <User className="h-8 w-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Edit Your Profile
              </h2>
              <p className="text-gray-400 mt-2">Update your account information</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-700/50 border border-gray-600/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-700/50 border border-gray-600/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter new password (optional)"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Updating..." : "Update Profile"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Edit_Form
