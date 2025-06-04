"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Search, Folder, Clock } from "lucide-react"

const Left_Sidebar = ({ recentRepos }) => {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredRepos = recentRepos.filter((repo) => repo.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <aside className="w-72 bg-slate-800/50 backdrop-blur-sm border-r border-gray-700/20 h-[calc(100vh-80px)] p-6">
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="h-5 w-5 text-teal-400" />
          <span className="text-lg font-semibold text-white">Recent Projects</span>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search repositories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-700/50 border border-gray-600/30 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>
      <div className="space-y-2">
        {filteredRepos.length > 0 ? (
          filteredRepos.map((repo) => (
            <Link
              key={repo._id}
              to={`/repo/${repo._id}`}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700/50 transition-all duration-200 group"
            >
              <div className="p-2 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-lg group-hover:from-teal-500/30 group-hover:to-cyan-500/30 transition-all duration-200">
                <Folder className="h-4 w-4 text-teal-400" />
              </div>
              <span className="text-white font-medium group-hover:text-teal-300 transition-colors duration-200">
                {repo.name}
              </span>
            </Link>
          ))
        ) : (
          <div className="text-center py-8">
            <Folder className="h-12 w-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">No repositories found</p>
          </div>
        )}
      </div>
    </aside>
  )
}

export default Left_Sidebar
