import React, { useState } from 'react';
import {
  signInWithPopup
} from 'firebase/auth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaGoogle, FaFacebook, FaEnvelope, FaLock, FaUserShield } from 'react-icons/fa';

import { auth, googleProvider, facebookProvider } from './firebase';

const LoginPage = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [debugMessages, setDebugMessages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const debugLog = (message) => {
    const timestamp = new Date().toISOString();
    const newMessage = `${timestamp}: ${message}`;
    setDebugMessages(prev => [...prev, newMessage]);
    console.log(newMessage);
  };

  const toggleAuthMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
    debugLog(`Switched to ${isLoginMode ? 'signup' : 'login'} mode`);
  };

  const handleLocalAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    debugLog(`Handling ${isLoginMode ? 'login' : 'signup'} mode`);
    try {
      isLoginMode ? await loginLocal() : await signupLocal();
    } finally {
      setLoading(false);
    }
  };

  const signupLocal = async () => {
    debugLog("Attempting signup...");
    try {
      const response = await axios.post('http://localhost:8081/auth/signup', {
        username,
        password,
        name: username
      });
      debugLog("Signup success: " + response.data);
      alert(response.data);
      setIsLoginMode(true);
    } catch (error) {
      const errorMsg = error.response?.data || error.message;
      setError("Signup error: " + errorMsg);
      debugLog("Signup error: " + errorMsg);
    }
  };

  const loginLocal = async () => {
    debugLog("Attempting login...");
    try {
      const response = await axios.post('http://localhost:8081/auth/login', {
        username,
        password
      });
      debugLog("Login success: " + response.data);
      localStorage.setItem('token', response.data.token);
      navigate('/contracts');
    } catch (error) {
      const errorMsg = error.response?.data || error.message;
      setError("Login error: " + errorMsg);
      debugLog("Login error: " + errorMsg);
    }
  };

  const signInWithGoogle = async () => {
    setError('');
    setLoading(true);
    debugLog("Attempting Google sign-in...");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const response = await axios.post('http://localhost:8081/auth/google', { idToken });
      debugLog("Google auth success: " + response.data);
      localStorage.setItem('token', response.data.token);
      navigate('/contracts');
    } catch (error) {
      const errorMsg = error.message;
      setError("Google sign-in failed: " + errorMsg);
      debugLog("Google sign-in error: " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const signInWithFacebook = async () => {
    setError('');
    setLoading(true);
    debugLog("Attempting Facebook sign-in...");
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const idToken = await result.user.getIdToken();
      const response = await axios.post('http://localhost:8081/auth/facebook', { idToken });
      debugLog("Facebook auth success: " + response.data);
      localStorage.setItem('token', response.data.token);
      navigate('/contracts');
    } catch (error) {
      const errorMsg = error.message;
      setError("Facebook sign-in failed: " + errorMsg);
      debugLog("Facebook sign-in error: " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-3/4 relative">
        <img src="/login-art.jpg" alt="Login Visual" className="w-full h-full object-cover" />
      </div>

      <div className="absolute right-0 top-0 h-full w-full md:w-1/3 bg-white/90 p-10 flex flex-col justify-center items-center shadow-2xl z-10">
        <div className="text-center mb-8">
          <FaUserShield className="text-5xl text-[#3ab6de] mx-auto mb-2" />
          <h2 className="text-3xl font-bold text-gray-800">Welcome to ClientAuth</h2>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 w-full max-w-sm text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLocalAuth} className="w-full max-w-sm space-y-4">
          <div className="flex items-center border border-gray-300 rounded-lg p-3">
            <FaEnvelope className="mr-3 text-gray-500" />
            <input
              type="email"
              placeholder="Enter your email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full outline-none"
              required
            />
          </div>

          <div className="flex items-center border border-gray-300 rounded-lg p-3">
            <FaLock className="mr-3 text-gray-500" />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3ab6de] text-white p-3 rounded-lg hover:bg-[#33a5cb] transition disabled:opacity-50"
          >
            {loading ? 'Please wait...' : isLoginMode ? "Login" : "Sign Up"}
          </button>
          <button
            type="button"
            onClick={toggleAuthMode}
            className="w-full bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition"
          >
            {isLoginMode ? "Switch to Signup" : "Switch to Login"}
          </button>
        </form>

        <div className="relative my-6 text-center w-full max-w-sm">
          <hr className="border-gray-300" />
          <span className="absolute left-1/2 -translate-x-1/2 bg-white px-2 text-sm text-gray-500">OR</span>
        </div>

        <div className="w-full max-w-sm">
          <button
            onClick={signInWithGoogle}
            disabled={loading}
            className="flex items-center justify-center w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition mb-2 disabled:opacity-50"
          >
            <FaGoogle className="mr-2" /> Sign in with Google
          </button>
          <button
            onClick={signInWithFacebook}
            disabled={loading}
            className="flex items-center justify-center w-full bg-blue-800 text-white p-3 rounded-lg hover:bg-blue-900 transition disabled:opacity-50"
          >
            <FaFacebook className="mr-2" /> Sign in with Facebook
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
