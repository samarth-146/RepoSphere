"use client"

import { useEffect, useState } from "react"
import { Star, GitFork, Globe, Lock } from "lucide-react"
import Navbar from "./Navbar"
import axios from "axios"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"

const StarredRepos = () => {
  const [starredRepos, setStarredRepos] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStarredRepositories = async () => {
      setIsLoading(true)
      try {
        const userId = localStorage.getItem("userId")
        const response = await axios.get(`http://localhost:8080/user/starred/${userId}`)
        if (response.status === 200) {
          setStarredRepos(response.data)
        } else {
          console.error("No repository found")
        }
      } catch (e) {
        console.error("Error fetching starred repositories:", e)
        toast.error("Failed to fetch starred repositories")
      } finally {
        setIsLoading(false)
      }
    }
    fetchStarredRepositories()
  }, [])

  const handleUnstar = async (repoId) => {
    try {
      const userId = localStorage.getItem("userId")
      const response = await axios.delete(`http://localhost:8080/starred/${repoId}/${userId}`)
      if (response.status === 200) {
        setStarredRepos((prev) => prev.filter((repo) => repo._id !== repoId))
        toast.success("Repository unstarred successfully")
      }
    } catch (error) {
      toast.error("Failed to unstar repository")
      console.error("Error unstarring repository:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Star className="h-6 w-6 text-amber-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Starred Repositories
            </h1>
          </div>
          <p className="text-gray-400">Repositories you've starred for quick access</p>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500 mb-4"></div>
            <p className="text-gray-400">Loading starred repositories...</p>
          </div>
        ) : starredRepos.length > 0 ? (
          /* Repository grid */
          <div className="grid gap-6">
            {starredRepos.map((repo) => (
              <div
                key={repo._id}
                className="bg-slate-800/50 backdrop-blur-sm border border-gray-700/20 rounded-xl p-6 hover:border-teal-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/10"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-white hover:text-teal-300 transition-colors duration-200">
                        {repo.name}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          repo.visibility === "public"
                            ? "bg-teal-900/30 text-teal-400 border border-teal-700/30"
                            : "bg-amber-900/30 text-amber-400 border border-amber-700/30"
                        }`}
                      >
                        {repo.visibility === "public" ? (
                          <div className="flex items-center space-x-1">
                            <Globe className="w-3 h-3" />
                            <span>Public</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1">
                            <Lock className="w-3 h-3" />
                            <span>Private</span>
                          </div>
                        )}
                      </span>
                    </div>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      {repo.description || "No description available"}
                    </p>
                    <div className="text-sm text-gray-400">
                      <span>by {repo.owner?.username || "Unknown"}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleUnstar(repo._id)}
                    className="p-2 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-all duration-200 ml-4"
                    title="Unstar repository"
                  >
                    <Star className="h-5 w-5" fill="currentColor" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-teal-400 rounded-full"></div>
                      <span>{repo.visibility}</span>
                    </span>
                    
                  </div>
                  <Link
                    to={`/repo/${repo._id}`}
                    className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md"
                  >
                    View Repository
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-gray-700/20 rounded-xl p-8 text-center max-w-md">
              <Star className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No starred repositories</h3>
              <p className="text-gray-400 mb-6">Star repositories to keep track of projects that interest you.</p>
              <Link
                to="/"
                className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Explore Repositories
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StarredRepos
