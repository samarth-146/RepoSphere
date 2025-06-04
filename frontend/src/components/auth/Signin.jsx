"use client"

import { useState } from "react"
import { Database, Mail, Lock, LogIn } from "lucide-react"
import axios from "axios"
import { useAuth } from "../../authContext"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "react-toastify"
import "./auth.css"

const Signin = () => {
  const navigate = useNavigate()
  const { currentUser, setCurrentUser } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const data = {
        email: email,
        password: password,
      }

      const response = await axios.post("http://localhost:8080/user/signin", data)
      const token = response.data.token
      const userId = response.data.id

      localStorage.setItem("token", token)
      localStorage.setItem("userId", userId)
      setCurrentUser(userId)

      setEmail("")
      setPassword("")
      toast.success("Logged in successfully")
      navigate("/")
    } catch (e) {
      if (e.response) {
        const { status } = e.response
        if (status === 404) {
          toast.error("User doesn't exist")
        } else if (status === 401) {
          toast.error("Invalid email or password")
        } else if (status === 500) {
          toast.error("Internal Server Error")
        } else {
          toast.error("Something went wrong!")
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full">
              <Database className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Welcome back
          </h1>
          <p className="text-gray-400">Sign in to RepoSphere</p>
        </div>

        {/* Sign In Form */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-gray-700/20 rounded-xl p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-700/50 border border-gray-600/30 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-700/50 border border-gray-600/30 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Sign Up Link */}
        <div className="bg-slate-800/30 backdrop-blur-sm border border-gray-700/20 rounded-xl p-4 mt-6 text-center">
          <p className="text-gray-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-teal-400 hover:text-teal-300 font-medium transition-colors duration-200">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signin
