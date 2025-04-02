import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import {Search} from 'lucide-react';
import Left_Sidebar from './left_sidebar';
import Main from './main';
import axios from 'axios';


const Dashboard = () => {
    const [repository,setRepository]=useState([]);
    const [globalRepository,setGlobalRepository]=useState([]);

    useEffect(()=>{
        const displayUserRepo=async()=>{
            const userId=localStorage.getItem("userId");
            const response=await axios.get(`13.234.31.127:8080/repo/all/${userId}`);
            setRepository(response.data);
        };
        // const fetchProfilePic=async()=>{
        //     const userId=localStorage.getItem("userId");
        //     const respons
        // }
        const displayAllRepo=async()=>{
            const response=await axios.get('13.234.31.127:8080/repo/all');
            const publicRepo=response.data.filter((ele)=>ele.visibility=='public');
            setGlobalRepository(publicRepo);
        };
        displayUserRepo();
        displayAllRepo();
    },[]);

    return (
        <div className="min-h-screen bg-[#0d1117] text-white">
            <Navbar/>
            <div className="flex">
                <Left_Sidebar recentRepos={repository}/>
                <Main mainRepos={globalRepository}/>
            </div>
        </div>
    );
};

export default Dashboard;

