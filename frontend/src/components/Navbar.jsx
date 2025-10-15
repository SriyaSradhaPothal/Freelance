import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut, Plus, MessageSquare, FileText, Briefcase } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Briefcase className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">FreelanceHub</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/projects" className="text-gray-600 hover:text-gray-900">
              Projects
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
                
                {user?.role === 'client' && (
                  <Link 
                    to="/create-project" 
                    className="btn btn-primary flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Post Project</span>
                  </Link>
                )}

                <Link to="/messages" className="text-gray-600 hover:text-gray-900">
                  <MessageSquare className="h-5 w-5" />
                </Link>

                <Link to="/contracts" className="text-gray-600 hover:text-gray-900">
                  <FileText className="h-5 w-5" />
                </Link>

                <div className="flex items-center space-x-4">
                  <Link to="/profile" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                    <User className="h-5 w-5" />
                    <span>{user?.username}</span>
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-gray-900">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;



