import { useAuth0 } from '@auth0/auth0-react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, FiFolder, FiCheckSquare, FiUser, FiLogOut, FiMenu, FiX,
  FiPlus, FiUserPlus
} from 'react-icons/fi';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth0();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { to: '/projects', icon: FiFolder, label: 'Projects' },
    { to: '/tasks', icon: FiCheckSquare, label: 'Tasks' },
    { to: '/profile', icon: FiUser, label: 'Profile' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    sessionStorage.clear();
    logout({ returnTo: window.location.origin });
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link 
            to={isAuthenticated ? "/dashboard" : "/"} 
            className="flex items-center space-x-3 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <FiFolder className="text-white" size={20} />
              </div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ProjectFlow
            </span>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-xl font-medium
                    transition-all duration-200 group
                    ${isActive(link.to) 
                      ? 'bg-indigo-50 text-indigo-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <link.icon 
                    size={18} 
                    className={`transition-transform duration-200 group-hover:scale-110 ${
                      isActive(link.to) ? 'text-indigo-600' : ''
                    }`}
                  />
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          )}

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/joinproject"
                  className="flex items-center space-x-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-200 font-medium"
                >
                  <FiUserPlus size={18} />
                  <span>Join Project</span>
                </Link>
                
                {/* User Menu */}
                <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
                  <div className="flex items-center space-x-3">
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="w-9 h-9 rounded-full border-2 border-indigo-200 shadow-sm"
                    />
                    <div className="hidden lg:block">
                      <p className="text-sm font-semibold text-gray-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium"
                  >
                    <FiLogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/"
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
              >
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          {isAuthenticated && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isAuthenticated && mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-xl font-medium
                  transition-all duration-200
                  ${isActive(link.to) 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                <link.icon size={20} />
                <span>{link.label}</span>
              </Link>
            ))}
            
            <Link
              to="/joinproject"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-3 px-4 py-3 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-200 font-medium"
            >
              <FiUserPlus size={20} />
              <span>Join Project</span>
            </Link>

            <div className="pt-3 mt-3 border-t border-gray-200">
              <div className="flex items-center space-x-3 px-4 py-2 mb-2">
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border-2 border-indigo-200"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium"
              >
                <FiLogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
