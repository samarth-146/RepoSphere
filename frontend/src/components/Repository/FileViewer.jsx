"use client"

import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { FileText, ChevronLeft } from "lucide-react"
import axios from "axios"
import { toast } from "react-toastify"
import Navbar from "./Navbar"

const FileViewer = () => {
  const [fileName, setFileName] = useState("")
  const [fileContent, setFileContent] = useState("")
  const [repository, setRepository] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const { id, filename } = useParams()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const userId = localStorage.getItem("userId")

        // Fetch file content
        const contentResponse = await axios.get(`http://localhost:8080/repo/${userId}/${id}/${filename}`)
        setFileName(contentResponse.data.fileName)
        setFileContent(contentResponse.data.content)

        // Fetch repository details for breadcrumb
        const repoResponse = await axios.get(`http://localhost:8080/repo/${id}`)
        setRepository(repoResponse.data)
      } catch (error) {
        toast.error("Failed to fetch file content")
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id, filename])

  // Function to determine language for syntax highlighting
  const getLanguageFromFilename = (filename) => {
    const extension = filename.split(".").pop().toLowerCase()

    const languageMap = {
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      py: "python",
      java: "java",
      html: "html",
      css: "css",
      json: "json",
      md: "markdown",
      txt: "plaintext",
    }

    return languageMap[extension] || "plaintext"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Breadcrumb navigation */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-sm">
            <Link
              to={`/repo/${id}`}
              className="text-teal-400 hover:text-teal-300 flex items-center space-x-1 transition-colors duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to repository</span>
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-gray-300">{repository?.name}</span>
            <span className="text-gray-500">/</span>
            <span className="text-white font-medium">{fileName}</span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500 mb-4"></div>
            <p className="text-gray-400">Loading file content...</p>
          </div>
        ) : (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-gray-700/20 rounded-xl overflow-hidden shadow-lg">
            {/* File header */}
            <div className="bg-slate-700/50 border-b border-gray-700/30 px-6 py-4 flex items-center">
              <FileText className="w-5 h-5 text-teal-400 mr-3" />
              <span className="text-lg font-medium">{fileName}</span>
            </div>

            {/* File content */}
            <div className="p-6 overflow-x-auto">
              <pre className="text-sm font-mono whitespace-pre-wrap break-words text-gray-300 bg-slate-900/50 p-4 rounded-lg border border-gray-700/30">
                {fileContent}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FileViewer
