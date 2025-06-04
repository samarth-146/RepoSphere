"use client"

import { useEffect, useState } from "react"
import { Upload } from "lucide-react"
import axios from "axios"
import { toast } from "react-toastify"
import Navbar from "./Navbar"
import Right_Profile from "./Right_Profile"

const Profile = () => {
  const [user, setUser] = useState({})
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("userId")
        const response = await axios.get(`https://reposphere.onrender.com/user/profile/${userId}`)
        setUser(response.data)
      } catch (e) {
        toast.error("Something went wrong")
        console.log(e)
      }
    }
    fetchUser()
  }, [])

  const handleImageUpload = async (e) => {
    e.preventDefault()
    const fileInput = document.getElementById("image-upload")

    if (!fileInput.files[0]) {
      toast.error("Please select a file!")
      return
    }

    setIsUploading(true)
    const formData = new FormData()
    formData.append("image", fileInput.files[0])

    try {
      const userId = localStorage.getItem("userId")
      await axios.post(`https://reposphere.onrender.com/user/profile/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      toast.success("Image uploaded successfully!")
      // Refresh user data
      const response = await axios.get(`https://reposphere.onrender.com/user/profile/${userId}`)
      setUser(response.data)
    } catch (error) {
      toast.error("Failed to upload image")
      console.error(error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 text-white">
      <Navbar user={user} />
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-6xl">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-gray-700/20 rounded-xl p-8 shadow-lg">
            <div className="md:flex md:items-start md:space-x-8">
              {/* Left column - Avatar */}
              <div className="md:w-1/3 mb-8 md:mb-0">
                <div className="text-center">
                  <img
                    src={user?.image?.url || "/placeholder.svg?height=260&width=260"}
                    alt="Profile"
                    className="w-64 h-64 rounded-full border-4 border-teal-400/50 mx-auto shadow-lg"
                  />

                  <div className="mt-6 space-y-3">
                    <form onSubmit={handleImageUpload}>
                      <input id="image-upload" type="file" className="hidden" accept="image/*" />
                      <label
                        htmlFor="image-upload"
                        className="w-full bg-slate-700/70 hover:bg-slate-700 text-white py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center cursor-pointer border border-gray-600/30 hover:border-teal-500/50"
                      >
                        <Upload className="w-5 h-5 mr-2" />
                        Choose Image
                      </label>
                      <button
                        type="submit"
                        disabled={isUploading}
                        className={`w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center mt-3 shadow-md hover:shadow-lg ${
                          isUploading ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                      >
                        {isUploading ? "Uploading..." : "Upload Image"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              {/* Right column - User info */}
              <Right_Profile user={user} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
