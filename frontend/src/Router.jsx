import {useRoutes,useNavigate} from 'react-router-dom'
import { useAuth } from './authContext';
import Signin from './components/auth/Signin';
import Dashboard from './components/dashboard/dashboard';
import Signup from './components/auth/Signup';
import { useEffect } from 'react';
import CreateRepository from './components/Repository/createRepository';
import Profile from './components/profile/Profile';
import Edit_Form from './components/profile/edit_form';
import StarredRepository from './components/Repository/StarredRepository';

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
        }
    ]);
    return route;
}
export default ProjectRouter;