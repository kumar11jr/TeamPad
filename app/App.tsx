import React, { useState } from 'react';
import SignUpScreen from './SignUpScreen'; // Ensure this file exists in the same directory
import SignInScreen from './SignInScreen'; // Ensure this file exists in the same directory

// You would typically initialize Firebase here or in a separate config file
import { initializeApp, getApps, getApp } from 'firebase/app'; // Added getApps, getApp
import { getAuth } from 'firebase/auth';

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

export default function App() {
  // State to manage which screen is currently displayed
  const [currentPage, setCurrentPage] = useState('signup'); // 'signup' or 'signin'

  const handleNavigateToSignIn = () => {
    setCurrentPage('signin');
  };

  const handleNavigateToSignUp = () => {
    setCurrentPage('signup');
  };

  return (
    <div className="App">
      {/* Tailwind CSS CDN for styling */}
      <script src="https://cdn.tailwindcss.com"></script>
      {/* Google Fonts - Inter */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <style>
        {`
          body {
            font-family: 'Inter', sans-serif;
          }
        `}
      </style>

      {currentPage === 'signup' ? (
        <SignUpScreen onNavigateToSignIn={handleNavigateToSignIn} />
      ) : (
        <SignInScreen onNavigateToSignUp={handleNavigateToSignUp} />
      )}
    </div>
  );
}
