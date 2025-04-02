import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';
import { useAuth } from '../../authContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./auth.css";


const Signin = () => {
    const navigate=useNavigate();
    let {currentUser,setCurrentUser}=useAuth();
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');

    const handleSubmit = async(e) => {
        try{
            e.preventDefault();
            let data={
                email:email,
                password:password,
            };
            const response=await axios.post('13.234.31.127:8080/user/signin',data);
            const token=response.data.token;
            const userId=response.data.id;
            localStorage.setItem("token",token);
            localStorage.setItem("userId",userId);
            setCurrentUser(userId);
            setEmail("");
            setPassword("");
            toast.success("Logged in successfully");
            navigate('/');
        }catch(e){
            if(e.response){
                const {status}=e.response;
                if(status==404){
                    toast.error("User doesn't exist", { position: "top-right" });
                }
                else if(status==401){
                    toast.error('Invalid email or password.', { position: "top-right" });
                }
                else if(status==500){
                    toast.error('Internal Server Error',{position:"top-right"});
                }
                else{
                    toast.error("Something is wrong!!",{position:"top-right"});
                }
            }
        }
    };

    return (
        <div className='maindiv'>
            <div className='p-6 rounded-lg shadow-md w-full max-w-auto'>
            <p className="text-3xl font-bold text-center mb-4 text-gray-800 text-white">
                    <FontAwesomeIcon icon={faGithub}/>
                </p>
                <h2 className="text-center text-white mb-6 text-3xl">
                    Sign in to RepoSphere
                </h2>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-auto">
                
                <form onSubmit={handleSubmit} className="space-y-6" >
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your password"
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300">
                            Sign In
                        </button>
                    </div>
                </form>

                
            </div>
            <div className='bg-white p-2 rounded-lg shadow-md w-full max-w-md mt-6'>
            <p className="p-4 text-center text-gray-500">
                    Don't have an account
                    <Link to="/signup" className="text-blue-500 hover:text-blue-700 font-bold text-sm"> Sign Up</Link>
                </p>
            </div>
        </div>
    )

}
export default Signin;
