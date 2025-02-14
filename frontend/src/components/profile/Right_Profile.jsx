import axios from "axios";
import { useNavigate } from "react-router-dom";

const Right_Profile = ({ user }) => {
    const navigate = useNavigate();
    const handleEdit = () => {
        navigate('/edit');
    };

    const handleLogout=async()=>{
        try{
            const token=localStorage.getItem('token');
            await axios.post('http://localhost:8080/user/logout', {}, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true, 
            });
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            navigate('/auth');
        }catch(e){
            console.error("Logout failed",e);
        }
    }
    return (
        <div className="md:w-2/3 md:pl-6">
            <div className="mb-4">
                <h1 className="text-3xl font-bold">{user.username}</h1>
                <p className="text-xl text-gray-400">{user.email}</p>
            </div>

            <div className="mb-4">
                <button onClick={handleEdit} className="w-full md:w-auto px-4 py-2 bg-[#21262d] border border-[#30363d] rounded-md hover:bg-[#30363d] transition-colors duration-200">
                    Edit profile
                </button><br /><br />
                <button onClick={handleLogout} className="w-full md:w-auto px-4 py-2 bg-[#21262d] border border-[#30363d] rounded-md hover:bg-[#30363d] transition-colors duration-200">
                    Logout
                </button>
            </div>
        </div>
    )
};

export default Right_Profile;