import axios from 'axios';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Main = ({ mainRepos }) => {
    const [starredRepos, setStarredRepos] = useState([]);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchStarredRepositories = async () => {
            try {
                const response = await axios.get(`13.234.31.127:8080/user/starred/${userId}`);
                if (response.status === 200) {
                    const starredRepoIds = response.data.map((ele) => ele._id);
                    setStarredRepos(starredRepoIds);
                } else {
                    console.error("No repository found");
                }
            } catch (e) {
                console.error("Error fetching starred repositories:", e);
            }
        };
        fetchStarredRepositories();
    }, []);

    const handleStarClick = async (repoId) => {
        try {
            if (starredRepos.includes(repoId)) {
                const response = await axios.delete(`13.234.31.127:8080/starred/${repoId}/${userId}`);
                if (response.status === 200) {
                    setStarredRepos((prev) => prev.filter((id) => id !== repoId));
                    toast.success("Repository is unmarked");
                } else {
                    console.error(`Failed to unstar repository with id ${repoId}`);
                }
            } else {
                const response = await axios.post(`13.234.31.127:8080/starred/${repoId}/${userId}`);
                if (response.status === 200) {
                    setStarredRepos((prev) => [...prev, repoId]);
                    toast.success("Repository starred successfully", { position: "top-right" });
                } else {
                    console.error(`Failed to star repository with id ${repoId}`);
                }
            }
        } catch (error) {
            console.error(`Error while toggling star for repository with id ${repoId}:`, error);
        }
    };

    return (
        <main className="flex-1 p-6">
            <h1 className="text-2xl font-bold mb-6">Global Repositories</h1>
            <div className="space-y-4">
                {mainRepos
                    .filter((repo) => repo.owner._id !== userId) // Filter out user's own repositories
                    .map((repo) => (
                        <div key={repo._id} className="bg-[#161b22] border border-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-semibold mb-2">{repo.name}</h3>
                                <button
                                    onClick={() => handleStarClick(repo._id)}
                                    className="text-yellow-400 hover:text-yellow-300 text-xl"
                                >
                                    <i
                                        className={`fas fa-star ${starredRepos.includes(repo._id) ? 'text-yellow-400' : 'text-gray-500'}`}
                                    ></i>
                                </button>
                            </div>
                            <p className="text-gray-400 mb-4">{repo.description}</p>
                            <Link to={`/repo/${repo._id}`} className='text-blue-400 hover:text-blue-300 text-sm'>VIEW REPOSITORY</Link>
                        </div>
                    ))}
            </div>
            <ToastContainer />
        </main>
    );
}

export default Main;
