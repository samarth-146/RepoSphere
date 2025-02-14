import { Search, Bell, Plus, Menu } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Navbar = () => {
    const [profile,setProfile]=useState({});
    useEffect(()=>{
        const fetchProfilePic=async()=>{
            const userId=localStorage.getItem('userId');
            const response=await axios.get(`http://localhost:8080/user/profilepic/${userId}`);
            setProfile(response.data);
        }
        fetchProfilePic();
    },[]);

    return (
        <nav className="bg-[#161b22] border-b border-gray-700 px-4 py-3 flex justify-between">
            <div className="flex items-center space-x-4">
                <p className="text-3xl font-bold text-center text-gray-800 text-white">
                    <FontAwesomeIcon icon={faGithub} />
                </p>
                
            </div>
            <div className="flex items-center space-x-6">
                <Link to="/create" className="text-white-500 hover:text-blue-300 font-bold text-sm"><Plus className="h-5 w-5" /></Link>
                <Link to="/profile"><img
                    src={profile?.url||"Default"}
                    alt="Default"
                    className="w-8 h-8 rounded-full"
                /></Link>

            </div>
        </nav>
    )
};
export default Navbar;
