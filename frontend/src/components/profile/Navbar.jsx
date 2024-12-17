import { MapPin, LinkIcon, Twitter, Users, Home, Star, Menu } from 'lucide-react';

const Navbar = () => {
    return (
      <nav className="bg-[#161b22] border-b border-[#30363d] p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <a href="/" className="text-white font-semibold text-lg">RepoSphere</a>
          </div>
          <div className="hidden md:flex space-x-6">
              
            <a href="/" className="text-white hover:text-gray-300 flex items-center">
              <Home size={18} className="mr-1" />
              Home
            </a>
            <a href="#" className="text-white hover:text-gray-300 flex items-center">
              <Star size={18} className="mr-1" />
              Starred
            </a>
          </div>
        </div>
      </nav>
    );
  };

  export default Navbar