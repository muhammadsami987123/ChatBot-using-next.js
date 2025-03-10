/**
 * Utility functions for handling profile pictures
 */

// Function to handle profile picture upload
export const uploadProfilePicture = async (file: File): Promise<string | null> => {
  // In a real application, you would upload the file to your server or a cloud storage service
  // For this demo, we'll just create a data URL and store it in localStorage
  
  try {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          
          // Store in localStorage (in a real app, you'd store the URL from your server)
          localStorage.setItem('avatarUrl', dataUrl);
          
          resolve(dataUrl);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
      
      reader.readAsDataURL(file);
    });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    return null;
  }
};

// Function to get the current profile picture
export const getProfilePicture = (): string | null => {
  // In a real application, you would fetch this from your API
  // For this demo, we'll just get it from localStorage
  return localStorage.getItem('avatarUrl');
};

// Function to remove the profile picture
export const removeProfilePicture = (): void => {
  // In a real application, you would call your API to remove the picture
  // For this demo, we'll just remove it from localStorage
  localStorage.removeItem('avatarUrl');
};

// Function to check if the file is a valid image
export const isValidImageFile = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(file.type);
};

// Function to validate file size (max 5MB)
export const isValidFileSize = (file: File, maxSizeMB = 5): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}; 