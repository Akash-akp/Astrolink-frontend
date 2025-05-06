import React from 'react';
import { Link } from 'react-router-dom';
import { Moon, Shield, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="text-xl font-bold text-white flex items-center mb-4">
              <Moon className="w-5 h-5 mr-2" />
              <span>AstroLink</span>
            </Link>
            <p className="text-sm">
              A secure, privacy-focused platform connecting clients with astrologers while maintaining complete anonymity.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-purple-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-purple-400 transition-colors">Register</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-purple-400 transition-colors">Login</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Privacy</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy-policy" className="hover:text-purple-400 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-purple-400 transition-colors">Terms of Service</Link>
              </li>
              <li>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-1" />
                  <span>End-to-End Encrypted</span>
                </div>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/faq" className="hover:text-purple-400 transition-colors">FAQ</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-purple-400 transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} AstroLink. All rights reserved.
          </p>
          <div className="flex items-center mt-4 md:mt-0">
            <Heart className="w-4 h-4 mr-1 text-red-400" />
            <span className="text-sm">Made with privacy in mind</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;