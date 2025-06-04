"use client"

import { Home, Star, Menu, Database } from "lucide-react"
import { Link } from "react-router-dom"

const Navbar = ({ user }) => {
  return (
    <nav className="bg-slate-800/90 backdrop-blur-sm border-b border-gray-700/30 px-6 py-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button className="md:hidden text-white">
            <Menu size={24} />
          </button>
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg">
              <Database className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              RepoSphere
            </span>
          </Link>
        </div>

        <div className="hidden md:flex space-x-6">
          <Link
            to="/"
            className="text-gray-300 hover:text-teal-300 flex items-center space-x-2 transition-colors duration-200"
          >
            <Home size={18} />
            <span>Home</span>
          </Link>
          <Link
            to="/starred"
            className="text-gray-300 hover:text-teal-300 flex items-center space-x-2 transition-colors duration-200"
          >
            <Star size={18} />
            <span>Starred</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/profile" className="relative">
            <img
              src={user?.image?.url || "/placeholder.svg?height=32&width=32"}
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
