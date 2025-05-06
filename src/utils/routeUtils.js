import { useLocation } from 'react-router-dom';

/**
 * Custom hook to check if current route is an auth page
 */
export const useIsAuthPage = () => {
  const { pathname } = useLocation();
  return ['/login', '/register/client', '/register/astrologer'].includes(pathname);
};

/**
 * Custom hook to check if current route is a chat page
 */
export const useIsChatPage = () => {
  const { pathname } = useLocation();
  return pathname.startsWith('/chat');
};

/**
 * Helper to determine if footer should be shown
 */
export const shouldShowFooter = (pathname) => {
  return !pathname.startsWith('/chat');
};