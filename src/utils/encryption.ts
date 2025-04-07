
/**
 * Encryption utilities for end-to-end encryption
 * This provides client-side encryption for sensitive data
 */

// Generate a random encryption key
export const generateEncryptionKey = async (): Promise<CryptoKey> => {
  return await window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );
};

// Export a key to string format for storage
export const exportKey = async (key: CryptoKey): Promise<string> => {
  const exported = await window.crypto.subtle.exportKey('raw', key);
  return arrayBufferToBase64(exported);
};

// Import a key from string format
export const importKey = async (keyStr: string): Promise<CryptoKey> => {
  const keyData = base64ToArrayBuffer(keyStr);
  return await window.crypto.subtle.importKey(
    'raw',
    keyData,
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );
};

// Encrypt data
export const encryptData = async (data: any, key: CryptoKey): Promise<string> => {
  try {
    // Generate a random IV (Initialization Vector)
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    // Convert data to string if it's not already
    const dataString = typeof data === 'string' ? data : JSON.stringify(data);
    
    // Convert string to ArrayBuffer
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(dataString);
    
    // Encrypt the data
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      dataBuffer
    );
    
    // Combine IV and encrypted data
    const resultBuffer = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    resultBuffer.set(iv, 0);
    resultBuffer.set(new Uint8Array(encryptedBuffer), iv.length);
    
    // Convert to Base64 string for storage or transmission
    return arrayBufferToBase64(resultBuffer);
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt data');
  }
};

// Decrypt data
export const decryptData = async <T = any>(encryptedData: string, key: CryptoKey): Promise<T> => {
  try {
    // Convert from Base64 string to ArrayBuffer
    const dataBuffer = base64ToArrayBuffer(encryptedData);
    
    // Extract IV (first 12 bytes)
    const iv = dataBuffer.slice(0, 12);
    
    // Extract encrypted data (everything after IV)
    const encryptedBuffer = dataBuffer.slice(12);
    
    // Decrypt the data
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      encryptedBuffer
    );
    
    // Convert ArrayBuffer to string
    const decoder = new TextDecoder();
    const decryptedString = decoder.decode(decryptedBuffer);
    
    // Parse JSON if the decrypted data is JSON
    try {
      return JSON.parse(decryptedString) as T;
    } catch {
      return decryptedString as unknown as T;
    }
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt data');
  }
};

// Helper: Convert ArrayBuffer to Base64 string
export const arrayBufferToBase64 = (buffer: ArrayBuffer | Uint8Array): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

// Helper: Convert Base64 string to ArrayBuffer
export const base64ToArrayBuffer = (base64: string): Uint8Array => {
  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

// Generate a hash of a string (for integrity verification)
export const generateHash = async (data: string): Promise<string> => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
  return arrayBufferToBase64(hashBuffer);
};

// Utility function to safely store encrypted data in localStorage
export const secureStore = {
  // Get encryption key from session or generate a new one
  getOrCreateKey: async (): Promise<CryptoKey> => {
    const storedKey = sessionStorage.getItem('encryption_key');
    if (storedKey) {
      return await importKey(storedKey);
    }
    
    const newKey = await generateEncryptionKey();
    const exportedKey = await exportKey(newKey);
    sessionStorage.setItem('encryption_key', exportedKey);
    return newKey;
  },
  
  // Store encrypted data
  setItem: async (key: string, value: any): Promise<void> => {
    try {
      const encryptionKey = await secureStore.getOrCreateKey();
      const encryptedValue = await encryptData(value, encryptionKey);
      localStorage.setItem(key, encryptedValue);
    } catch (error) {
      console.error('Error storing encrypted data:', error);
      // Fallback to regular storage
      localStorage.setItem(key, JSON.stringify(value));
    }
  },
  
  // Retrieve and decrypt data
  getItem: async <T = any>(key: string): Promise<T | null> => {
    try {
      const encryptedValue = localStorage.getItem(key);
      if (!encryptedValue) return null;
      
      const encryptionKey = await secureStore.getOrCreateKey();
      return await decryptData<T>(encryptedValue, encryptionKey);
    } catch (error) {
      console.error('Error retrieving encrypted data:', error);
      // Try to retrieve as regular JSON
      const value = localStorage.getItem(key);
      if (!value) return null;
      
      try {
        return JSON.parse(value) as T;
      } catch {
        return value as unknown as T;
      }
    }
  },
  
  // Remove item
  removeItem: (key: string): void => {
    localStorage.removeItem(key);
  },
  
  // Clear all secure items
  clear: (): void => {
    localStorage.clear();
  },
  
  // Add these functions directly to the secureStore object
  encryptData: async (data: any, key: CryptoKey): Promise<string> => {
    return encryptData(data, key);
  },
  
  decryptData: async <T = any>(data: string, key: CryptoKey): Promise<T> => {
    return decryptData<T>(data, key);
  }
};

export default secureStore;
