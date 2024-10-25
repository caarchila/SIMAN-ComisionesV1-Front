import { toast } from 'react-toastify';
import React from 'react';

// Custom hook to show toasts
const useToast = () => {

  const showToast = (title, message, color = 'info') => {
    // Define toast content with a title and message
    const content = (
      <div>
        <strong className='text-bold'>{title}</strong>
        <p>{message}</p>
      </div>
    );

    // Set up options for the toast, including background color and right border style
    const options = {
      position: 'top-right',
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      style: { 
        backgroundColor: 'white', // Always white background
        color: 'black', // Text color (set to black for better contrast)
        borderTop: `10px solid ${getColor(color)}` // Thick right border with dynamic color
      },
      progressStyle: {
        backgroundColor: 'black' // Set progress bar color to black
        }
    };

    // Display the toast
    toast(content, options);
  };

  // Helper function to determine the color of the right border based on the type of toast
  const getColor = (color) => {
    switch (color) {
      case 'success':
        return '#28a745'; // Green
      case 'error':
        return '#dc3545'; // Red
      case 'warning':
        return '#ffc107'; // Yellow
      case 'info':
      default:
        return '#007bff'; // Blue
    }
  };

  return { showToast };
};

export default useToast;
