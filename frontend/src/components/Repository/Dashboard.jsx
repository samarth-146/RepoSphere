"use client"

import { useEffect, useState } from "react"
import { FolderClosed, Trash2, AlertCircle, FileText } from "lucide-react"
import { Link, useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import Navbar from "./Navbar"

const RepoDashboard = () => {
  const [repository, setRepository] = useState({})
  const [files, setFiles] = useState([])
  const [profile, setProfile] = useState("")
  const { id } = useParams()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch repository details
        const repoResponse = await axios.get(`https://reposphere.onrender.com/repo/${id}`)
        // console.log(repoResponse.data);
        setRepository(repoResponse.data)

        // Check if user is owner
        const userId = localStorage.getItem("userId")
        if (repoResponse.data.owner._id === userId) {
          setIsOwner(true)
        }

        // Fetch files
        const filesResponse = await axios.get(`https://reposphere.onrender.com/repo/files/${repoResponse.data?.owner?._id}/${id}`)
        
        setFiles(filesResponse.data)

        // Fetch user profile
        const userResponse = await axios.get(`https://reposphere.onrender.com/user/profile/${userId}`)
        setProfile(userResponse.data.username)
      } catch (error) {
        toast.error("Failed to fetch repository data")
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleDelete = async () => {
    try {
      const userId = localStorage.getItem("userId")
      if (userId) {
        await axios.delete(`https://reposphere.onrender.com/repo/${id}`)
        toast.success("Repository deleted successfully")
        navigate("/")
      }
    } catch (error) {
      toast.error("Failed to delete repository")
    }
    setShowDeleteModal(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 text-white">
      <Navbar />

      {/* Repository header */}
      <div className="border-b border-gray-700/30 bg-slate-800/50 backdrop-blur-sm shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-xl font-semibold text-teal-400 hover:text-teal-300 transition-colors duration-200"
              >
                {repository?.owner?.username || profile}
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-xl font-semibold text-white">{repository.name}</span>
              <span
                className={`px-3 py-1 text-xs rounded-full ${
                  repository.visibility === "public"
                    ? "bg-teal-900/30 text-teal-400 border border-teal-700/30"
                    : "bg-amber-900/30 text-amber-400 border border-amber-700/30"
                }`}
              >
                {repository.visibility}
              </span>
            </div>

            {isOwner && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 bg-red-900/30 text-red-400 hover:bg-red-900/50 border border-red-700/30 rounded-lg transition-all duration-200 flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete repository</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Repository content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Repository Files</h2>
          <p className="text-gray-400">{repository.description || "No description provided for this repository."}</p>
        </div>

        {/* Repository files */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-gray-700/20 rounded-xl overflow-hidden shadow-lg">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500 mb-4"></div>
              <p className="text-gray-400">Loading files...</p>
            </div>
          ) : files.length > 0 ? (
            files.map((file, index) => (
              <div className="border-b border-gray-700/30 last:border-b-0" key={index}>
                <div className="flex items-center justify-between px-6 py-4 hover:bg-slate-700/30 transition-colors duration-200">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-teal-400" />
                    <Link
                      to={`/repo/${repository._id}/${file.fileName}`}
                      className="text-teal-400 hover:text-teal-300 hover:underline transition-colors duration-200 font-medium"
                    >
                      {file.fileName}
                    </Link>
                  </div>
                  <div className="text-gray-400 text-sm">
                    <p className="text-right">{file.commitMessage}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(file.commitDate).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <FolderClosed className="w-12 h-12 text-gray-500 mb-4" />
              <p className="text-gray-400 mb-2">No files found in this repository</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-gray-700/50 rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-start space-x-4 text-red-400 mb-6">
              <AlertCircle className="w-6 h-6 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-3">Delete Repository</h3>
                <p className="text-gray-300 mb-2">Are you sure you want to delete this repository?</p>
                <p className="text-sm text-gray-400">
                  This action cannot be undone. This will permanently delete the{" "}
                  <span className="font-semibold text-white">{repository.name}</span> repository and all its contents.
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete repository</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default RepoDashboard
