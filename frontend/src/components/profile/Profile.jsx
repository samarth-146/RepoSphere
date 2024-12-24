import React, { useEffect, useState } from 'react';
// import { MapPin, LinkIcon, Twitter, Users, Home, Star, Menu } from 'lucide-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import Navbar from './Navbar';
import Right_Profile from './Right_Profile';

const Profile = () => {
  const [user, setUser] = useState([]);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(`http://localhost:8080/user/profile/${userId}`);
        setUser(response.data);

      } catch (e) {
        toast.error("Something went wrong");
        console.log(e);
      }
    };
    fetchUser();
  }, [])

  return (
    <div className="bg-[#0d1117] text-white min-h-screen flex flex-col">
      <Navbar user={user} />
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-5xl">
          <div className="md:flex md:items-start">
            {/* Left column - Avatar */}
            <div className="md:w-1/3 mb-4 md:mb-0">
              <img
                src={user?.image?.url || "default-avatar.png"}
                alt={`${user.name}'s image`}
                className="w-64 h-64 rounded-full border-4 border-[#30363d]"
              />
              <div className="mt-4 space-y-2">

                <form
                  encType="multipart/form-data"
                  onSubmit={async (e) => {
                    e.preventDefault(); // Prevent the form from refreshing the page
                    const fileInput = document.getElementById('image-upload');
                    if (!fileInput.files[0]) {
                      toast.error('Please select a file!');
                      return;
                    }

                    const formData = new FormData();
                    formData.append('image', fileInput.files[0]); // Append the file with the key 'avatar'

                    try {
                      const userId = localStorage.getItem('userId');
                      const response = await axios.post(
                        `http://localhost:8080/user/profile/${userId}`,
                        formData,
                        {
                          headers: {
                            'Content-Type': 'multipart/form-data',
                          },
                        }
                      );
                      toast.success('Image uploaded successfully!');
                    } catch (error) {
                      toast.error('Failed to upload image');
                      console.error(error);
                    }
                  }}
                >
                  <input
                    id="image-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                  />
                  <label
                    htmlFor="image-upload"
                    className="w-full bg-[#238636] text-white py-2 px-4 rounded-md hover:bg-[#2ea043] transition-colors duration-200 flex items-center justify-center cursor-pointer"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                    Choose Image
                  </label>
                  <button
                    type="submit"
                    className="w-full bg-[#238636] text-white py-2 px-4 rounded-md hover:bg-[#2ea043] transition-colors duration-200 flex items-center justify-center mt-4"
                  >
                    Upload Image
                  </button>
                </form>

              </div>
            </div>
            <Right_Profile user={user} />
          </div>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default Profile;

