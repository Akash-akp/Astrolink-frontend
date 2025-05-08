import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import ClientDashboard from './components/client/ClientDashboard';
import AstrologerDashboard from './components/astrologer/AstrologerDashboard';
import ClientChatView from './components/chat/ClientChatView';
import AstrologerChatView from './components/chat/AstrologerChatView';
import ChatLayout from './components/chat/ChatLayout';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { RequestProvider } from './contexts/RequestContext';
import { ChatProvider } from './contexts/ChatContext';
import { PaymentProvider } from './contexts/PaymentContext';
import { shouldShowFooter } from './utils/routeUtils';
import { ToastContainer } from 'react-toast';

// Protected route wrapper
const ProtectedRoute = ({ children, allowedRole }) => {
    const { currentUser, isClient, isAstrologer } = useAuth();

    // Check if the user is logged in
    if (!currentUser) {
      console.log("User not logged in or user object is missing.");
        return <Navigate to="/login" replace />;
    }

    // Check if the user's role matches the allowed role
    if (allowedRole === 'client' && !isClient()) {
        console.log("User is not a client.");
        return <Navigate to="/astrologer/dashboard" replace />;
    }
    if (allowedRole === 'astrologer' && !isAstrologer()) {
        console.log("User is not an astrologer.");
        return <Navigate to="/client/dashboard" replace />;
    }
    if (allowedRole === 'both' && !isClient() && !isAstrologer()) {
        console.log("User is neither a client nor an astrologer.");
        return <Navigate to="/" replace />  
    }

    // If all checks pass, render the children
    return <>{children}</>;
};

const PublicRoute = ({ children }) => {
    const { currentUser, isClient, isAstrologer } = useAuth();
    // Redirect logged-in users to their respective dashboards
    if (currentUser) {
      if (isClient()) {
        return <Navigate to="/client/dashboard" replace />;
      }
      if (isAstrologer()) {
        return <Navigate to="/astrologer/dashboard" replace />;
      }
    }
  
    // If no user is logged in, render the children
    return <>{children}</>;
  };

// Main app content
const AppContent = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const location = useLocation();
  
    useEffect(() => {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
        setIsDarkMode(true);
      } else {
        document.documentElement.classList.remove('dark');
        setIsDarkMode(false);
      }
    }, []);
  
    return (
      <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Header />
        <ToastContainer position="top-right" className="absolute top-[100px] z-10" />
        <main className="flex-grow">
        <Routes>
  {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={
            <PublicRoute>
            <LoginPage />
            </PublicRoute>
        } />
        <Route path="/register" element={
            <PublicRoute>
                <RegistrationPage />
            </PublicRoute>
        } />
          <Route path="/register/:role" element={
            <PublicRoute>
                <RegistrationPage />
            </PublicRoute>
        } />

        {/* Client routes */}
        <Route path="/client/dashboard" element={
            <ProtectedRoute allowedRole="client">
            <ClientDashboard />
            <hr/>
           <Footer />
            </ProtectedRoute>
        } />

        {/* Astrologer routes */}
        <Route path="/astrologer/dashboard" element={
            <ProtectedRoute allowedRole="astrologer">
            <AstrologerDashboard />
            <hr/>
            <Footer />
            </ProtectedRoute>
        } />

        {/* Chat route (protected for logged-in users only) */}
        <Route path="/chat" element={
            <ProtectedRoute allowedRole={"both"}>
                <ChatLayout />
            </ProtectedRoute>
        } />


        {/* Chat route (protected for logged-in users only) */}
        <Route path="/chat/:consultationId" element={
            <ProtectedRoute allowedRole={"both"}>
                <ChatLayout />
            </ProtectedRoute>
        } />



        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        </main>
      </div>
    );
  };
  


function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <RequestProvider>
                    <ChatProvider>
                        <PaymentProvider>
                            <AppContent />
                        </PaymentProvider>
                    </ChatProvider>
                </RequestProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;