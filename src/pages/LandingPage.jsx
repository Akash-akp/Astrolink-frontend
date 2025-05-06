import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Star, Moon, Sparkles, Users, BookOpen } from 'lucide-react';

const LandingPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(white, rgba(255, 255, 255, 0.1) 2px, transparent 30px)`,
            backgroundSize: '30px 30px',
            opacity: 0.1,
            animation: 'twinkle 6s ease-in-out infinite alternate'
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Moon className="w-16 h-16 text-purple-300" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Private Astrology Consultations with Complete Anonymity
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-purple-200">
              Connect with expert astrologers while maintaining your privacy. No personal information shared, ever.
            </p>
            
            {/* Role Selection Cards */}
            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {/* Client Card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/15 transition-all">
                <div className="flex justify-center mb-4">
                  <Users className="w-12 h-12 text-purple-300" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Join as Client</h3>
                <ul className="text-left space-y-3 mb-6 text-purple-100">
                  <li className="flex items-start">
                    <Shield className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                    <span>Get anonymous consultations with verified astrologers</span>
                  </li>
                  <li className="flex items-start">
                    <Lock className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                    <span>Your identity remains completely private</span>
                  </li>
                  <li className="flex items-start">
                    <Star className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                    <span>Rate astrologers and maintain quality standards</span>
                  </li>
                </ul>
                <p className="text-sm mb-6">One-time registration fee: ₹500</p>
                <Link
                  to="/register/client"
                  className="block w-full py-3 px-6 bg-purple-600 hover:bg-purple-700 rounded-lg text-center font-semibold transition-colors"
                >
                  Register as Client
                </Link>
              </div>

              {/* Astrologer Card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/15 transition-all">
                <div className="flex justify-center mb-4">
                  <BookOpen className="w-12 h-12 text-purple-300" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Join as Astrologer</h3>
                <ul className="text-left space-y-3 mb-6 text-purple-100">
                  <li className="flex items-start">
                    <Users className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                    <span>Connect with clients seeking astrological guidance</span>
                  </li>
                  <li className="flex items-start">
                    <Star className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                    <span>Build your reputation through client ratings</span>
                  </li>
                  <li className="flex items-start">
                    <Shield className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                    <span>Secure platform with end-to-end encrypted chats</span>
                  </li>
                </ul>
                <p className="text-sm mb-6">Free registration for astrologers</p>
                <Link
                  to="/register/astrologer"
                  className="block w-full py-3 px-6 bg-purple-600 hover:bg-purple-700 rounded-lg text-center font-semibold transition-colors"
                >
                  Register as Astrologer
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Complete Privacy, Quality Insights
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our platform is designed from the ground up to protect your identity while connecting you with talented astrologers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
              <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-full inline-block mb-4">
                <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">
                Complete Anonymity
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                All users are assigned unique, temporary handles. No personal information is ever exposed or stored.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full inline-block mb-4">
                <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">
                End-to-End Encryption
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                All communications are secured with robust encryption. When a consultation ends, all data is permanently deleted.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
              <div className="p-4 bg-amber-100 dark:bg-amber-900/30 rounded-full inline-block mb-4">
                <Star className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">
                Quality Assurance
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our reputation system ensures you connect with skilled astrologers. Rate your experience and help others find the best.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-700 to-indigo-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6">
            <Sparkles className="w-12 h-12 mx-auto text-purple-300" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to discover your cosmic insights?
          </h2>
          <p className="text-xl mb-8 text-purple-200 max-w-3xl mx-auto">
            Join thousands of users who trust AstroLink for private, secure astrology consultations.
          </p>
          <Link
            to="/register/client" 
            className="px-8 py-4 bg-white text-purple-700 hover:bg-purple-100 rounded-lg shadow-lg font-semibold text-lg inline-block transition-colors"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;