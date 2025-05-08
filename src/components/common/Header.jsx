import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, LogOut, MessageSquare } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useIsAuthPage } from '../../utils/routeUtils';

const Header = ({ toggleTheme, isDarkMode }) => {
  const { currentUser, logout, isClient, isAstrologer } = useAuth();
  const location = useLocation();

  // If we're on an auth page, render minimal header


  return (
    <header className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white shadow-md sticky top-0">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link to="/" className="text-2xl font-bold flex items-center">
            <div className="mr-2">
              <Moon className="w-6 h-6 inline-block" />
            </div>
            <span>AstroLink</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {currentUser ? (
              <>
                {isClient() && (
                  <>
                    <Link 
                      to="/client/dashboard" 
                      className={`hover:text-purple-200 transition-colors ${
                        location.pathname === '/client/dashboard' ? 'font-semibold' : ''
                      }`}
                    >
                      Dashboard
                    </Link>
                  </>
                )}
                
                {isAstrologer() && (
                  <>
                    <Link 
                      to="/astrologer/dashboard" 
                      className={`hover:text-purple-200 transition-colors ${
                        location.pathname === '/astrologer/dashboard' ? 'font-semibold' : ''
                      }`}
                    >
                      Dashboard
                    </Link>
                  </>
                )}

                <Link 
                  to="/chat" 
                  className={`flex items-center hover:text-purple-200 transition-colors ${
                    location.pathname === '/chat' ? 'font-semibold' : ''
                  }`}
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  <span>Chat</span>
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`hover:text-purple-200 transition-colors ${
                    location.pathname === '/login' ? 'font-semibold' : ''
                  }`}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className={`hover:text-purple-200 transition-colors ${
                    location.pathname === '/register' ? 'font-semibold' : ''
                  }`}
                >
                  Register
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center space-x-4">

            {currentUser  && (
              <button
                onClick={logout}
                className="flex items-center text-sm hover:text-purple-200 transition-colors"
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5 mr-1" />
                <span className="hidden md:inline">Logout</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-purple-600 transition-colors"
              onClick={() => document.querySelector('.mobile-menu').classList.toggle('hidden')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          <div className="mobile-menu hidden w-full md:hidden mt-4 bg-purple-800 rounded-lg">
            {currentUser ? (
              <div className="py-2 space-y-1">
                {isClient() && (
                  <>
                    <Link 
                      to="/client/dashboard" 
                      className="block px-4 py-2 hover:bg-purple-700"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/client/requests" 
                      className="block px-4 py-2 hover:bg-purple-700"
                    >
                      My Requests
                    </Link>
                  </>
                )}
                
                {isAstrologer() && (
                  <>
                    <Link 
                      to="/astrologer/dashboard" 
                      className="block px-4 py-2 hover:bg-purple-700"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/astrologer/consultations" 
                      className="block px-4 py-2 hover:bg-purple-700"
                    >
                      Consultations
                    </Link>
                  </>
                )}

                <Link 
                  to="/chat" 
                  className="flex items-center px-4 py-2 hover:bg-purple-700"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  <span>Chat</span>
                </Link>
              </div>
            ) : (
              <div className="py-2 space-y-1">
                <Link 
                  to="/login" 
                  className="block px-4 py-2 hover:bg-purple-700"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block px-4 py-2 hover:bg-purple-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;