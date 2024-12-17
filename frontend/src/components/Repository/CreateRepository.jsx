import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateRepository = () => {
  const navigate=useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  let [visibility, setVisibility] = useState(true);

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log({ name, description, visibility });
    const userId=localStorage.getItem("userId");
    if(visibility){
      visibility='public';
    }
    else{
      visibility='private';
    }
    const response=await axios.post('http://localhost:8080/repo',{
      name,
      description,
      owner:userId,
      visibility
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold mb-8">Create a new repository</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="relative inline-block">
                <button
                  type="button"
                  className="bg-[#21262d] text-white px-3 py-1.5 rounded-md border border-gray-700 flex items-center space-x-2"
                >
                  <span>samarth-146</span>
                </button>
              </div>
              <span className="text-gray-500">/</span>
              <input
                type="text"
                required
                className="flex-1 bg-[#0d1117] border border-gray-700 rounded-md px-3 py-1.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Repository name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <p className="text-sm text-gray-400">
              Great repository names are short and memorable. Need inspiration?{' '}
              <span className="text-green-500">legendary-octo-robot</span>?
            </p>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Description <span className="text-gray-500">(optional)</span>
              </label>
              <textarea
                className="w-full bg-[#0d1117] border border-gray-700 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-4 mt-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <input
                    type="radio"
                    name="visibility"
                    checked={visibility}
                    onChange={() => setVisibility(true)}
                    className="mt-1 focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-700 bg-gray-700"
                  />
                </div>
                <div>
                  <label className="font-medium text-white flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M3 6h18M3 18h18" />
                    </svg>
                    <span>Public</span>
                  </label>
                  <p className="text-sm text-gray-400">
                    Anyone on the internet can see this repository. You choose who can commit.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <input
                    type="radio"
                    name="visibility"
                    checked={!visibility}
                    onChange={() => setVisibility(false)}
                    className="mt-1 focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-700 bg-gray-700"
                  />
                </div>
                <div>
                  <label className="font-medium text-white flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Private</span>
                  </label>
                  <p className="text-sm text-gray-400">
                    You choose who can see and commit to this repository.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
            >
              Create repository
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRepository;

