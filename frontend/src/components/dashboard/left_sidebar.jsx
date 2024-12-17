import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Left_Sidebar = ({ recentRepos }) => {
    return (
        <aside className="w-64 bg-[#0d1117] border-r border-gray-700 h-[calc(100vh-64px)] p-4 hidden md:block">
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">Recent</span>
            </div>
            <div className="relative mb-4">
                <input
                    type="text"
                    placeholder="Search repositories..."
                    className="w-full bg-[#161b22] border border-gray-700 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>
            <ul className="space-y-2">
                {recentRepos.map((repo) => (
                    <li key={repo._id} className="flex items-center space-x-2">
                        <a href="#" className="text-white-400 hover:underline text-lg">
                            {repo.name}
                        </a>
                    </li>
                ))}
            </ul>
        </aside>
    );
}

export default Left_Sidebar;
