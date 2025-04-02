"use client"

import { useEffect, useState } from "react"
import { FolderClosed, Trash2, AlertCircle } from "lucide-react"
import { Link, useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"

const RepoDashboard = () => {
    const [repository, setRepository] = useState({})
    const [files, setFiles] = useState([])
    const [profile, setProfile] = useState("")
    const { id } = useParams()
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [isOwner, setIsOwner] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchRepository = async () => {
            try {
                const repo = await axios.get(`13.234.31.127:8080/repo/${id}`)
                setRepository(repo.data)
                const userId = localStorage.getItem('userId');
                if (repo.data.owner._id == userId) {
                    setIsOwner(true);
                }
            } catch (error) {
                toast.error("Failed to fetch repository")
            }
        }

        const fetchFiles = async () => {
            try {
                const userId = localStorage.getItem("userId")
                const response = await axios.get(`13.234.31.127:8080/repo/files/${userId}/${id}`)
                setFiles(response.data)
            } catch (error) {
                toast.error("Failed to fetch files")
            }
        }

        const fetchProfile = async () => {
            try {
                const userId = localStorage.getItem("userId")
                const user = await axios.get(`13.234.31.127:8080/user/profile/${userId}`)
                setProfile(user.data.username)
            } catch (error) {
                toast.error("Failed to fetch profile")
            }
        }

        fetchProfile()
        fetchRepository()
        fetchFiles()
    }, [id])

    const handleDelete = async () => {
        try {
            const userId = localStorage.getItem("userId")
            if (userId) {
                await axios.delete(`13.234.31.127:8080/repo/${id}`);
                toast.success("Repository deleted successfully");
                navigate("/");
            }
        } catch (error) {
            toast.error("Failed to delete repository");
        }
        setShowDeleteModal(false)
    }

    return (
        <div className="min-h-screen bg-[#0d1117] text-white">
            {/* Top navigation */}
            <div className="border-b border-[#30363d] bg-[#161b22]">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <Link to="/" className="text-xl font-semibold hover:text-blue-400">
                                {profile} / {repository.name}
                            </Link>
                            <span className="px-2 py-0.5 text-xs rounded-full border border-[#30363d]">{repository.visibility}</span>
                        </div>
                        {isOwner && (
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="px-3 py-1.5 text-red-400 hover:text-red-300 hover:bg-[#21262d] rounded-md transition-colors duration-200 flex items-center space-x-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete repository</span>
                            </button>
                        )}

                    </div>
                </div>
            </div>

            {/* Repository content */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Repository files */}
                <div className="bg-[#161b22] border border-[#30363d] rounded-md">
                    {files.length > 0 ? (
                        files.map((file, index) => (
                            <div className="border-b border-[#30363d] last:border-b-0" key={index}>
                                <div className="flex items-center justify-between px-4 py-3 hover:bg-[#21262d] cursor-pointer">
                                    <div className="flex items-center space-x-2">
                                        <FolderClosed className="w-4 h-4 text-[#7d8590]" />
                                        <Link to={`/repo/${repository._id}/${file.fileName}`} className="text-blue-400 hover:underline">
                                            {file.fileName}
                                        </Link>
                                    </div>
                                    <div className="text-gray-400 text-sm flex flex-col items-end">
                                        <p className="text-xs">{file.commitMessage}</p>
                                        <p className="text-xs">{new Date(file.commitDate).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16">
                            <FolderClosed className="w-8 h-8 text-gray-500 mb-2" />
                            <p className="text-gray-400">No files found in this repository</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete confirmation modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-[#161b22] border border-[#30363d] rounded-lg max-w-md w-full p-6">
                        <div className="flex items-start space-x-3 text-red-500 mb-4">
                            <AlertCircle className="w-5 h-5 mt-0.5" />
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Are you sure you want to delete this repository?</h3>
                                <p className="text-sm text-gray-400">
                                    This action cannot be undone. This will permanently delete the {repository.name} repository and all
                                    its contents.
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-[#21262d] rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                            >
                                Delete this repository
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default RepoDashboard

