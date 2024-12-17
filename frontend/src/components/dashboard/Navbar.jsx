import { Search, Bell, Plus, Menu } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-[#161b22] border-b border-gray-700 px-4 py-3 flex justify-between">
            <div className="flex items-center space-x-4">
                <p className="text-3xl font-bold text-center text-gray-800 text-white">
                    <FontAwesomeIcon icon={faGithub} />
                </p>
                <div className="relative hidden md:block">
                    <input
                        type="text"
                        placeholder="Search RepoSphere"
                        className="bg-[#0d1117] border border-gray-700 rounded-md px-3 py-1 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>
            <div className="flex items-center space-x-6">
                <Link to="/create" className="text-white-500 hover:text-blue-300 font-bold text-sm"><Plus className="h-5 w-5" /></Link>
                <Link to="/profile"><img
                    src=""
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                /></Link>

            </div>
        </nav>
    )
};
export default Navbar;
