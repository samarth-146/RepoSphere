import React, { useEffect, useState } from "react";
import { Star, CircleAlert, FolderClosed, ChevronDown, Code } from "lucide-react";
import { Link, useParams } from 'react-router-dom';
import axios from "axios";

const RepoDashboard = () => {
    const [repository, setRepository] = useState({});
    const [files, setFiles] = useState([]);
    const [profile, setProfile] = useState("");
    const { id } = useParams();

    useEffect(() => {
        const fetchRepository = async () => {
            const repo = await axios.get(`http://localhost:8080/repo/${id}`);
            setRepository(repo.data);
        };

        const fetchFiles = async () => {
            const userId = localStorage.getItem('userId');
            let response = await axios.get(`http://localhost:8080/repo/files/${userId}/${id}`);
            const files = response.data; // This now contains only the latest version of each file

            console.log(files);
        
            setFiles(files);
        };
        

        const fetchProfile = async () => {
            const userId = localStorage.getItem('userId');
            const user = await axios.get(`http://localhost:8080/user/profile/${userId}`);
            setProfile(user.data.username);
        };

        fetchProfile();
        fetchRepository();
        fetchFiles();
    }, [id]);

    return (
        <div className="min-h-screen bg-[#0d1117] text-white">
            {/* Top navigation */}
            <div className="border-b border-[#30363d] bg-[#161b22]">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center h-16">
                        <div className="flex items-center space-x-4">
                            <a href="#" className="text-xl font-semibold hover:text-blue-400">
                                {profile} / {repository.name}
                            </a>
                            <span className="px-2 py-0.5 text-xs rounded-full border border-[#30363d]">
                                {repository.visibility}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Repository content */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Repository files */}
                <div className="bg-[#161b22] border border-[#30363d] rounded-md">
                    {files.length > 0 ? (
                        files.map((file, index) => (
                            <div className="border-b border-[#30363d]" key={index}>
                                <div className="flex items-center justify-between px-4 py-2 hover:bg-[#21262d] cursor-pointer">
                                    <div className="flex items-center space-x-2">
                                        <FolderClosed className="w-4 h-4 text-[#7d8590]" />
                                        <Link to={`/repo/${repository._id}/${file.fileName}`} className="text-blue-400 hover:underline">
                                            {file.fileName}
                                        </Link>
                                    </div>
                                    <div className="text-gray-500 text-sm">
                                        <p><strong>Commit:</strong> {file.commitMessage}</p>
                                        <p><strong>Date:</strong> {new Date(file.commitDate).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-400 py-4">No files found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RepoDashboard;
