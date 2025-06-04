"use client"

import axios from "axios"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Star, GitFork, Globe } from "lucide-react"

const Main = ({ mainRepos }) => {
  const [starredRepos, setStarredRepos] = useState([])
  const userId = localStorage.getItem("userId")

  useEffect(() => {
    const fetchStarredRepositories = async () => {
      try {
        const response = await axios.get(`https://reposphere.onrender.com/user/starred/${userId}`)
        if (response.status === 200) {
          const starredRepoIds = response.data.map((ele) => ele._id)
          setStarredRepos(starredRepoIds)
        } else {
          console.error("No repository found")
        }
      } catch (e) {
        console.error("Error fetching starred repositories:", e)
      }
    }
    fetchStarredRepositories()
  }, [])

  const handleStarClick = async (repoId) => {
    try {
      if (starredRepos.includes(repoId)) {
        const response = await axios.delete(`https://reposphere.onrender.com/starred/${repoId}/${userId}`)
        if (response.status === 200) {
          setStarredRepos((prev) => prev.filter((id) => id !== repoId))
          toast.success("Repository unmarked", { position: "top-right" })
        } else {
          console.error(`Failed to unstar repository with id ${repoId}`)
        }
      } else {
        const response = await axios.post(`https://reposphere.onrender.com/starred/${repoId}/${userId}`)
        if (response.status === 200) {
          setStarredRepos((prev) => [...prev, repoId])
          toast.success("Repository starred successfully", { position: "top-right" })
        } else {
          console.error(`Failed to star repository with id ${repoId}`)
        }
      }
    } catch (error) {
      console.error(`Error while toggling star for repository with id ${repoId}:`, error)
    }
  }

  return (
    <main className="flex-1 p-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Globe className="h-6 w-6 text-teal-400" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
            Discover Projects
          </h1>
        </div>
        <p className="text-gray-400">Explore amazing projects from the community</p>
      </div>

      <div className="grid gap-6">
        {mainRepos
          .filter((repo) => repo.owner._id !== userId)
          .map((repo) => (
            <div
              key={repo._id}
              className="bg-slate-800/50 backdrop-blur-sm border border-gray-700/20 rounded-xl p-6 hover:border-teal-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/10"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 hover:text-teal-300 transition-colors duration-200">
                    {repo.name}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{repo.description || "No description available"}</p>
                </div>
                <button
                  onClick={() => handleStarClick(repo._id)}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    starredRepos.includes(repo._id)
                      ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                      : "bg-slate-700/50 text-gray-400 hover:bg-slate-700 hover:text-amber-400"
                  }`}
                >
                  <Star className="h-5 w-5" fill={starredRepos.includes(repo._id) ? "currentColor" : "none"} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-teal-400 rounded-full"></div>
                    <span>Public</span>
                  </span>
                  
                </div>
                <Link key={repo._id}
                  to={`/repo/${repo._id}`}
                  className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md"
                >
                  View Project
                </Link>
              </div>
            </div>
          ))}
      </div>
    </main>
  )
}

export default Main
