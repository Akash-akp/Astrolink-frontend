/**
 * Generates a unique handle for users based on their role
 * @param {string} role The user role (client or astrologer)
 * @returns {string} A unique handle string
 */
export const generateUserHandle = (role) => {
  const prefix = role === 'client' ? 'Client' : 'Astrologer';
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}#${randomChars}`;
};

/**
 * Generates a request ID
 * @returns {string} A unique request ID
 */
export const generateRequestId = () => {
  return `Request#${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
};

/**
 * Maps a real user ID to a temporary handle
 * @param {string} userId The real user ID
 * @param {string} role The user role
 * @returns {string} A temporary handle
 */
export const mapUserIdToHandle = (userId, role) => {
  // In a real application, this would store the mapping in a database
  // For this demo, we'll just generate a new handle each time
  return generateUserHandle(role);
};