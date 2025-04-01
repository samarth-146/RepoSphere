import {useRoutes,useNavigate} from 'react-router-dom'
import { useAuth } from './authContext';
import Signin from './components/auth/Signin';
import Dashboard from './components/dashboard/dashboard';
import Signup from './components/auth/Signup';
import { useEffect } from 'react';
import Profile from './components/profile/Profile';
import Edit_Form from './components/profile/edit_form';
import StarredRepository from './components/Repository/StarredRepository';
import RepoDashboard from './components/Repository/Dashboard';
import FileViewer from './components/Repository/FileViewer';
import CreateRepository from './components/Repository/createRepository';

const ProjectRouter=()=>{
    const navigate=useNavigate();
    const {currentUser,setCurrentUser}=useAuth();
    useEffect(()=>{
        const userIdStorage=localStorage.getItem("userId");
        if(userIdStorage && !currentUser){
            setCurrentUser(userIdStorage);
        }
        if(!userIdStorage && !["/auth","/signup"].includes(window.location.pathname)){
            navigate('/auth');
        }
        if(userIdStorage && window.location.pathname=='/auth'){
            navigate('/');
        }

    },[currentUser,navigate,setCurrentUser]);

    let route=useRoutes([
        {
            path:"/auth",
            element:<Signin/>
        },
        {
            path:"/",
            element:<Dashboard/>
        },
        {
            path:"/signup",
            element:<Signup/>
        },
        {
            path:"/create",
            element:<CreateRepository/>
        },
        {
            path:"/profile",
            element:<Profile/>
        },
        {
            path:"/edit",
            element:<Edit_Form/>
        },{
            path:"/starred",
            element:<StarredRepository/>
        },
        {
            path:"/repo/:id",
            element:<RepoDashboard/>
        },{
            path:"/repo/:id/:filename",
            element:<FileViewer/>
        }
    ]);
    return route;
}
export default ProjectRouter;