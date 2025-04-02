import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import Navbar from '../dashboard/Navbar';
import axios from 'axios';

const Main = () => {
    const [starredRepos, setStarredRepos] = useState([]);
    useEffect(() => {
        const fetchStarredRepositories = async () => {
            try {
                const userId = localStorage.getItem("userId");
                const response = await axios.get(`13.234.31.127:8080/user/starred/${userId}`);
                console.log(response.data);
                if (response.status === 200) {
                    setStarredRepos(response.data);
                } else {
                    console.error("No repository found");
                }
            } catch (e) {
                console.error("Error fetching starred repositories:", e);
            }
        };
        fetchStarredRepositories();
    }, []);
  const initialRepos = [
    {
      id: '1',
      name: 'RepoSphere',
      description: 'A GitHub-like platform for managing repositories',
      isStarred: false,
    },
    {
      id: '2',
      name: 'Blood_Bank_MERN',
      description: 'A MERN stack application for managing blood donations',
      isStarred: true,
    },
    {
      id: '3',
      name: 'Classroom-Flutter',
      description: 'A Flutter app for managing virtual classrooms',
      isStarred: false,
    },
    {
      id: '4',
      name: 'E-Commerce-Django',
      description: 'An e-commerce platform built with Django',
      isStarred: false,
    },
  ];

  const [repos, setRepos] = useState(initialRepos);

  const handleStarClick = (repoId) => {
    setRepos(repos.map(repo => 
      repo.id === repoId ? { ...repo, isStarred: !repo.isStarred } : repo
    ));
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <Navbar/>
        <div className="space-y-4 my-6">
          {starredRepos.map((repo) => (
            <div key={repo._id} className="bg-[#161b22] border border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold mb-2">{repo.name}</h3>
              </div>
              <p className="text-gray-400 mb-4">{repo.description}</p>
              <button className="text-blue-400 hover:text-blue-300 text-sm transition-colors duration-200">
                VIEW REPOSITORY
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Main;

