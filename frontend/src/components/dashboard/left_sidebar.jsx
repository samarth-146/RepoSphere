import { useState } from 'react';
import { Link } from 'react-router-dom';

const Left_Sidebar = ({ recentRepos }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Filter repositories based on search input
    const filteredRepos = recentRepos.filter(repo =>
        repo.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <aside className="w-64 bg-[#0d1117] border-r border-gray-700 h-[calc(100vh-64px)] p-4 hidden md:block">
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">Recent</span>
            </div>
            <div className="relative mb-4">
                <input
                    type="text"
                    placeholder="Search repositories..."
                    value={searchTerm} // Bind input to state
                    onChange={(e) => setSearchTerm(e.target.value)} // Update state
                    className="w-full bg-[#161b22] border border-gray-700 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>
            <ul className="space-y-2">
                {filteredRepos.length > 0 ? (
                    filteredRepos.map((repo) => (
                        <li key={repo._id} className="flex items-center space-x-2">
                            <Link to={`/repo/${repo._id}`} className="text-white-400 hover:underline text-lg">
                                {repo.name}
                            </Link>
                        </li>
                    ))
                ) : (
                    <li className="text-gray-500 text-sm">No matching repositories found.</li>
                )}
            </ul>
        </aside>
    );
}

export default Left_Sidebar;
