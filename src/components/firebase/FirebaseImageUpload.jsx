import React, { useRef, useState } from 'react';
import { imageDb } from './Config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import proxyService from '../../utils/proxyService';
import { RxCross1 } from "react-icons/rx";

const FirebaseImageUpload = ({isFileUploadOpen, setFileUploadOpen}) => {
  const [file, setFile] = useState(null); // State to store the selected file
  const fileInputRef = useRef(null); // Ref for the file input element
  const currentUser = JSON.parse(localStorage.getItem('currentUser')); // Ensure the user object is retrieved correctly
  const userId = currentUser?.user?.id; // Safely access the user ID

  if (!userId) {
    console.error('User ID is undefined. Please ensure the user is logged in.');
    return null; // Prevent rendering if userId is undefined
  }

  const storageRef = ref(imageDb, `users/${userId}/images/${uuidv4()}`);

  const closeModal = ()=>{
    setFileUploadOpen(false);
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Programmatically trigger the file input click
    }
  };

  const uploadImage = async () => {
    try {
      if (!file) {
        console.error('No file selected for upload.');
        return;
      }

      // Upload the file to Firebase Storage
      await uploadBytes(storageRef, file);

      // Get the download URL for the uploaded file
      const downloadURL = await getDownloadURL(storageRef);

      // Send the download URL to the backend
      await proxyService.post(
        '/upload',
        { imageUrl: downloadURL },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`, // Use the token from localStorage
          },
        }
      );

      console.log('Image uploaded successfully:', downloadURL);

      // Clear the file after successful upload
      setFile(null);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div onClick={closeModal} className='absolute top-0 left-0 z-[31] h-screen w-screen flex items-center justify-center'>
    <div onClick={e=>e.stopPropagation()} className="md:h-[300px] md:w-[600px] h-[300px] w-[calc(full-20px)] z-[32] absolute flex flex-col justify-center gap-10 items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <button onClick={closeModal} className='absolute top-0 right-0 m-5 px-5 py-2 bg-gray-700/50 hover:bg-gray-600'>
        <RxCross1 />
      </button>
      {/* Hidden File Input */}
      <div className='flex flex-col md:flex-row items-center justify-center gap-10'>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }} // Hide the file input
      />

      {/* Select File Button */}
      <button
        onClick={handleFileSelect}
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
      >
        Select File
      </button>

      {/* Upload Button */}
      <button
        onClick={uploadImage}
        disabled={!file}
        className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition ${
          !file ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        Upload
      </button>
      </div>
      <div>
        {/* Display Selected File Name */}
        {file && <p className="text-sm text-gray-600">Selected File: {file.name}</p>}

      </div>
    </div>
    </div>
  );
};

export default FirebaseImageUpload;