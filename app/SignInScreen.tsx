/* eslint-disable react/no-unknown-property */
import { router } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import {auth} from "../firebaseConfig.js"; // Adjust the import path as necessary

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Animation states
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    // Trigger entrance animations
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleClick = () =>{
    router.push("/SignUpScreen"); // Navigate to SignUpScreen
  }


  const handleSignIn = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      if (!email || !password) {
        throw new Error("Email and password are required.");
      }
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long.");
      }
      const user = await signInWithEmailAndPassword(auth, email, password);

      console.log("Simulating sign-in for:", email);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      setSuccessMessage("👋 Welcome back! Signed in successfully!");
      console.log("User signed in:", user.user.email);
      // Clear messages after a delay
      setTimeout(() => setSuccessMessage(""), 4000);
      setEmail("");
      setPassword("");
      return router.push("/"); // Navigate to HomeScreen after successful sign-in
    } catch (error:unknown) {
      console.error("Sign-in error:", (error as Error).message);
      setErrorMessage("⚠️ " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    handleSignIn();
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans">
      {/* Gradient Background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #764ba2 50%, #667eea 100%)'
        }}
      />

      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="absolute bg-white/10 rounded-full animate-float"
            style={{
              width: `${100 + index * 50}px`,
              height: `${100 + index * 50}px`,
              top: `${10 + index * 20}%`,
              left: `${10 + index * 25}%`,
              animationDelay: `${index * 0.5}s`,
              animationDuration: `${3 + index * 0.5}s`,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-md mx-auto p-6 relative z-10">
        {/* Animated Header */}
        <div
          ref={titleRef}
          className={`text-center mb-8 transition-all duration-800 ${
            isVisible ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'
          }`}
        >
          {/* Logo Animation Placeholder */}
          <div className="relative mb-6">
            <div className="w-32 h-32 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
              <div className="text-6xl">🔑</div>
            </div>
            <div className="absolute inset-0 bg-white/10 rounded-full blur-xl scale-75" />
          </div>

          <h1 className="text-6xl font-black text-white tracking-tight mb-4">
            TeamPad
          </h1>
          <div className="inline-block bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full border border-white/30">
            <p className="text-white/90 text-lg font-medium">
              Sign in to your account
            </p>
          </div>
        </div>

        {/* Glassmorphism Sign In Card */}
        <div
          ref={cardRef}
          className={`backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl transition-all duration-1000 ${
            isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
          }`}
        >
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Messages */}
            {successMessage && (
              <div className="bg-green-500/20 border border-green-400/30 rounded-2xl p-4 animate-pulse">
                <p className="text-green-100 text-center font-medium">
                  {successMessage}
                </p>
              </div>
            )}

            {errorMessage && (
              <div className="bg-red-500/20 border border-red-400/30 rounded-2xl p-4 animate-pulse">
                <p className="text-red-100 text-center font-medium">
                  {errorMessage}
                </p>
              </div>
            )}

            {/* Email Input */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2 ml-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@example.com"
                  required={true}
                  className="w-full h-14 px-6 bg-white/10 border border-white/20 rounded-2xl text-white text-base placeholder-white/50 backdrop-blur-xl focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
                />
                <div className="absolute left-4 top-5 w-2 h-2 bg-blue-400 rounded-full" />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2 ml-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required={true}
                  className="w-full h-14 px-6 pr-14 bg-white/10 border border-white/20 rounded-2xl text-white text-base placeholder-white/50 backdrop-blur-xl focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
                />
                <div className="absolute left-4 top-5 w-2 h-2 bg-purple-400 rounded-full" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 w-6 h-6 flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <svg
                    className="w-5 h-5 text-white/70 hover:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {showPassword ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L12 12m-2.122-2.122l4.242 4.242M12 12l2.878 2.878m0 0L12 12m2.878 2.878L9.878 9.878m5.956-1.071a9.97 9.97 0 013.478 5.907 10.05 10.05 0 01-1.563 3.029M15.12 14.12L12 12"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl text-white text-lg font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(90deg, #f093fb 0%, #764ba2 100%)',
                boxShadow: '0 10px 25px rgba(240, 147, 251, 0.3)'
              }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-white/20" />
              <span className="text-white/60 mx-4 text-sm">or</span>
              <div className="flex-1 h-px bg-white/20" />
            </div>

            {/* Social Sign In Options */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="bg-white/10 border border-white/20 rounded-2xl py-3 text-white font-medium hover:bg-white/15 transition-all duration-300 transform hover:scale-105"
              >
                📧 Google
              </button>
              <button
                type="button"
                className="bg-white/10 border border-white/20 rounded-2xl py-3 text-white font-medium hover:bg-white/15 transition-all duration-300 transform hover:scale-105"
              >
                📱 Apple
              </button>
            </div>
          </form>
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-8">
          <button
            type="button"
            onClick={handleClick}
            className="bg-white/10 border border-white/20 rounded-full px-6 py-3 text-white/90 text-base hover:bg-white/15 transition-all duration-300"
          >
            Don&apos;t have an account?
            <span className="font-bold text-white ml-1">Sign Up</span>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white/60 text-xs">
            By signing in, you agree to our{' '}
            <button className="text-white/80 underline hover:text-white transition-colors">
              Terms of Service
            </button>{' '}
            and{' '}
            <button className="text-white/80 underline hover:text-white transition-colors">
              Privacy Policy
            </button>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
