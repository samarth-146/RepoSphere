
import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGithub } from "@fortawesome/free-brands-svg-icons"
import { Home } from "lucide-react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../auth/auth.css"

const Navbar = () => {
    return (
        <nav className="bg-[#0d1117] border-b border-[#30363d] py-3 px-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/dashboard" className="text-white text-xl font-bold">
                    RepoSphere
                </Link>
            </div>
        </nav>
    )
}

const Edit_Form = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [user, setUser] = useState(null)

    useEffect(() => {
        const fetchUser = async () => {
            const userId = localStorage.getItem("userId")
            const response = await axios.get(`http://localhost:8080/user/profile/${userId}`)
            setUser(response.data)
            setEmail(response.data.email)
        }
        fetchUser()
    }, [])

    const handleSubmit = async (e) => {
        try {
            e.preventDefault()
            const data = {
                email: email,
                password: password,
            }
            const userId = localStorage.getItem("userId")
            const response = await axios.put(`http://localhost:8080/user/${userId}`, data)
            setEmail("")
            setPassword("")
            toast.success("Profile updated successfully", { position: "top-right" })
            navigate("/profile")
        } catch (e) {
            if (e.response) {
                const { status } = e.response
                if (status === 200) {
                    toast.success("Profile updated successfully", { position: "top-right" })
                } else if (status === 500) {
                    toast.error("Internal Server Error", { position: "top-right" })
                } else {
                    toast.error("Something went wrong!!", { position: "top-right" })
                }
            }
        }
    }

    if (!user) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
                    <div className="text-white">Loading...</div>
                </div>
            </>
        )
    }

    return (
        <>
            <Navbar />
            <div className="h-screen bg-[#0d1117] flex items-center justify-center overflow-hidden">
                <div className="maindiv">
                    <div className="p-6 rounded-lg shadow-md w-full max-w-auto">
                        <p className="text-3xl font-bold text-center mb-4 text-gray-800 text-white">
                            <FontAwesomeIcon icon={faGithub} />
                        </p>
                        <h2 className="text-center text-white mb-6 text-3xl">Edit Your Profile</h2>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-auto">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter your password"
                                />
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300"
                                >
                                    Update Profile
                                </button>
                            </div>
                        </form>
                    </div>
                    <ToastContainer />
                </div>
            </div>
        </>
    )
}

export default Edit_Form

