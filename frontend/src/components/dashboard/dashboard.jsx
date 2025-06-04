"use client"

import { useEffect, useState } from "react"
import Navbar from "./Navbar"
import Left_Sidebar from "./left_sidebar"
import Main from "./main"
import axios from "axios"

const Dashboard = () => {
  const [repository, setRepository] = useState([])
  const [globalRepository, setGlobalRepository] = useState([])

  useEffect(() => {
    const displayUserRepo = async () => {
      const userId = localStorage.getItem("userId")
      const response = await axios.get(`https://reposphere.onrender.com/repo/all/${userId}`)
      setRepository(response.data)
    }
    const displayAllRepo = async () => {
      const response = await axios.get("https://reposphere.onrender.com/repo/all")
      const publicRepo = response.data.filter((ele) => ele.visibility == "public")
      setGlobalRepository(publicRepo)
    }
    displayUserRepo()
    displayAllRepo()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800">
      <Navbar />
      <div className="flex">
        <Left_Sidebar recentRepos={repository} />
        <Main mainRepos={globalRepository} />
      </div>
    </div>
  )
}

export default Dashboard
