import React, { useEffect, useState } from 'react';
// import { MapPin, LinkIcon, Twitter, Users, Home, Star, Menu } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from './Navbar';
import Right_Profile from './Right_Profile';

const Profile = () => {
    const [user,setUser]=useState([]);
    useEffect(()=>{
        const fetchUser=async()=>{
            try{
                const userId=localStorage.getItem("userId");
                const response=await axios.get(`http://localhost:8080/user/profile/${userId}`);
                setUser(response.data);

            }catch(e){
                toast.error("Something went wrong");
                console.log(e);
            }
        };
        fetchUser();
    },[])

  return (
    <div className="bg-[#0d1117] text-white min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-5xl">
          <div className="md:flex md:items-start">
            {/* Left column - Avatar */}
            <div className="md:w-1/3 mb-4 md:mb-0">
              <img
                src={user.avatar}
                alt={`${user.name}'s avatar`}
                className="w-64 h-64 rounded-full border-4 border-[#30363d]"
              />
            </div>
           <Right_Profile user={user}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

