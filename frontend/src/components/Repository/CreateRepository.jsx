"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { Database, Globe, Lock } from "lucide-react"
import Navbar from "./Navbar"

const CreateRepository = () => {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [visibility, setVisibility] = useState(true)
  const [userName, setUserName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem("userId")
        const user = await axios.get(`https://reposphere.onrender.com/user/profile/${userId}`)
        setUserName(user.data.username)
      } catch (error) {
        toast.error("Failed to fetch user profile")
      }
    }
    fetchProfile()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const userId = localStorage.getItem("userId")
      const visibilityValue = visibility ? "public" : "private"

      await axios.post("https://reposphere.onrender.com/repo", {
        name,
        description,
        owner: userId,
        visibility: visibilityValue,
      })

      toast.success("Repository created successfully")
      navigate("/")
    } catch (e) {
      if (e.response) {
        const { status } = e.response
        const message = e.response.data.message

        if (status === 400) {
          toast.error(`${message}`)
        } else if (status === 404) {
          toast.error(`${message}`)
        } else {
          toast.error("Internal Server Error")
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800">
      <Navbar />
      <div className="max-w-3xl mx-auto p-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Database className="h-6 w-6 text-teal-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Create a new repository
            </h1>
          </div>
          <p className="text-gray-400">A repository contains all project files, including the revision history.</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-gray-700/20 rounded-xl p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="relative inline-block">
                  <div className="bg-slate-700/70 text-white px-4 py-2 rounded-lg border border-gray-600/30 flex items-center space-x-2">
                    <span className="font-medium text-teal-300">{userName}</span>
                  </div>
                </div>
                <span className="text-gray-500">/</span>
                <input
                  type="text"
                  className="flex-1 bg-slate-700/50 border border-gray-600/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  placeholder="Repository name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <p className="text-sm text-gray-400 pl-1">
                Great repository names are short and memorable. Need inspiration?{" "}
                <span className="text-teal-400">legendary-octo-robot</span>
              </p>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300 pl-1">
                  Description <span className="text-gray-500">(optional)</span>
                </label>
                <textarea
                  className="w-full bg-slate-700/50 border border-gray-600/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your repository (optional)"
                />
              </div>

              <div className="space-y-4 mt-8">
                <h3 className="text-lg font-medium text-white mb-2">Repository visibility</h3>

                <div className="flex items-start space-x-3 p-3 rounded-lg bg-slate-700/30 border border-gray-600/20 hover:bg-slate-700/50 transition-colors duration-200">
                  <div className="flex-shrink-0 mt-1">
                    <input
                      type="radio"
                      name="visibility"
                      id="public"
                      checked={visibility}
                      onChange={() => setVisibility(true)}
                      className="focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-700 bg-gray-700"
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="public"
                      className="font-medium text-white flex items-center space-x-2 cursor-pointer"
                    >
                      <Globe className="h-5 w-5 text-teal-400" />
                      <span>Public</span>
                    </label>
                    <p className="text-sm text-gray-400 mt-1">Anyone on the internet can see this repository</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-lg bg-slate-700/30 border border-gray-600/20 hover:bg-slate-700/50 transition-colors duration-200">
                  <div className="flex-shrink-0 mt-1">
                    <input
                      type="radio"
                      name="visibility"
                      id="private"
                      checked={!visibility}
                      onChange={() => setVisibility(false)}
                      className="focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-700 bg-gray-700"
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="private"
                      className="font-medium text-white flex items-center space-x-2 cursor-pointer"
                    >
                      <Lock className="h-5 w-5 text-teal-400" />
                      <span>Private</span>
                    </label>
                    <p className="text-sm text-gray-400 mt-1">Only you can see this repository</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className={`bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Creating..." : "Create repository"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateRepository
