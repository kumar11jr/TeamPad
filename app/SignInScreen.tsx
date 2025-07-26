/* eslint-disable react/no-unknown-property */
import { router } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, githubProvider } from "../firebaseConfig.js";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cardRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleClick = () => {
    router.push("/SignUpScreen");
  };

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
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccessMessage("👋 Welcome back! Signed in successfully!");
      console.log("User signed in:", user.user.email);

      setTimeout(() => setSuccessMessage(""), 4000);
      setEmail("");
      setPassword("");
      return router.push("/");
    } catch (error: unknown) {
      console.error("Sign-in error:", (error as Error).message);
      setErrorMessage("⚠️ " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      console.log("Google Sign-in successful:", user.email);
      setSuccessMessage(`👋 Welcome ${user.displayName}!`);
      setTimeout(() => setSuccessMessage(""), 4000);

      return router.push("/");
    } catch (error: unknown) {
      console.error("Google Sign-in error:", (error as Error).message);
      setErrorMessage("⚠️ " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;

      console.log("GitHub Sign-in successful:", user.email);
      setSuccessMessage(`👋 Welcome ${user.displayName || user.email}!`);
      setTimeout(() => setSuccessMessage(""), 4000);

      return router.push("/");
    } catch (error: unknown) {
      console.error("GitHub Sign-in error:", (error as Error).message);
      let errorMsg = (error as Error).message;
      
      // Handle specific GitHub auth errors
      if (errorMsg.includes('popup-closed-by-user')) {
        errorMsg = "Sign-in was cancelled.";
      } else if (errorMsg.includes('account-exists-with-different-credential')) {
        errorMsg = "An account already exists with this email using a different sign-in method.";
      }
      
      setErrorMessage("⚠️ " + errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    handleSignIn();
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #f093fb 0%, #764ba2 50%, #667eea 100%)",
        }}
      />
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
        <div
          ref={titleRef}
          className={`text-center mb-8 transition-all duration-800 ${
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"
          }`}
        >
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
            <p className="text-white/90 text-lg font-medium">Sign in to your account</p>
          </div>
        </div>

        <div
          ref={cardRef}
          className={`backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl transition-all duration-1000 ${
            isVisible ? "scale-100 opacity-100" : "scale-90 opacity-0"
          }`}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {successMessage && (
              <div className="bg-green-500/20 border border-green-400/30 rounded-2xl p-4 animate-pulse">
                <p className="text-green-100 text-center font-medium">{successMessage}</p>
              </div>
            )}
            {errorMessage && (
              <div className="bg-red-500/20 border border-red-400/30 rounded-2xl p-4 animate-pulse">
                <p className="text-red-100 text-center font-medium">{errorMessage}</p>
              </div>
            )}

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2 ml-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@example.com"
                  required
                  className="w-full h-14 px-6 bg-white/10 border border-white/20 rounded-2xl text-white text-base placeholder-white/50 backdrop-blur-xl focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
                />
                <div className="absolute left-4 top-5 w-2 h-2 bg-blue-400 rounded-full" />
              </div>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2 ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full h-14 px-6 pr-14 bg-white/10 border border-white/20 rounded-2xl text-white text-base placeholder-white/50 backdrop-blur-xl focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
                />
                <div className="absolute left-4 top-5 w-2 h-2 bg-purple-400 rounded-full" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 w-6 h-6 flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <svg className="w-5 h-5 text-white/70 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L12 12m-2.122-2.122l4.242 4.242M12 12l2.878 2.878m0 0L12 12m2.878 2.878L9.878 9.878m5.956-1.071a9.97 9.97 0 013.478 5.907 10.05 10.05 0 01-1.563 3.029M15.12 14.12L12 12" />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl text-white text-lg font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(90deg, #f093fb 0%, #764ba2 100%)",
                boxShadow: "0 10px 25px rgba(240, 147, 251, 0.3)",
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

            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-white/20" />
              <span className="text-white/60 mx-4 text-sm">or</span>
              <div className="flex-1 h-px bg-white/20" />
            </div>

            {/* Google and GitHub Login */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="bg-white/10 border border-white/20 rounded-2xl py-3 text-white font-medium hover:bg-white/15 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={handleGithubLogin}
                disabled={isLoading}
                className="bg-white/10 border border-white/20 rounded-2xl py-3 text-white font-medium hover:bg-white/15 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span>GitHub</span>
              </button>
            </div>
          </form>
        </div>

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

        <div className="text-center mt-8">
          <p className="text-white/60 text-xs">
            By signing in, you agree to our{" "}
            <button className="text-white/80 underline hover:text-white transition-colors">Terms of Service</button>{" "}
            and{" "}
            <button className="text-white/80 underline hover:text-white transition-colors">Privacy Policy</button>
          </p>
        </div>
      </div>

      <style >{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}