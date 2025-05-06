/**
 * Simulates end-to-end encryption for messages
 * In a real application, this would use actual encryption libraries
 * @param {string} message The message to encrypt
 * @returns {string} The encrypted message
 */
export const encryptMessage = (message) => {
  // This is a placeholder for actual encryption
  // In a real app, use a proper end-to-end encryption library
  return `encrypted_${message}`;
};

/**
 * Simulates decryption of messages
 * @param {string} encryptedMessage The encrypted message
 * @returns {string} The decrypted message
 */
export const decryptMessage = (encryptedMessage) => {
  // This is a placeholder for actual decryption
  if (encryptedMessage.startsWith('encrypted_')) {
    return encryptedMessage.substring(10);
  }
  return encryptedMessage;
};

/**
 * Checks if a client has blocked an astrologer
 * @param {string} clientId The client ID
 * @param {string} astrologerId The astrologer ID
 * @param {Array<string>} blockedAstrologers List of blocked astrologer IDs
 * @returns {boolean} True if blocked, false otherwise
 */
export const isAstrologerBlocked = (clientId, astrologerId, blockedAstrologers) => {
  return blockedAstrologers.includes(astrologerId);
};

/**
 * Adds an astrologer to a client's blocklist
 * @param {Array<string>} blockedAstrologers Current list of blocked astrologers
 * @param {string} astrologerId The astrologer ID to block
 * @returns {Array<string>} Updated list of blocked astrologers
 */
export const blockAstrologer = (blockedAstrologers, astrologerId) => {
  if (!blockedAstrologers.includes(astrologerId)) {
    return [...blockedAstrologers, astrologerId];
  }
  return blockedAstrologers;
};