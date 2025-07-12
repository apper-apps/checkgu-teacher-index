import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Apper SDK initialization with error handling
const initializeApperSDK = () => {
  let retryCount = 0;
  const maxRetries = 10;
  const baseDelay = 100;

  const checkSDKAvailability = () => {
    return typeof window !== 'undefined' && 
           window.ApperSDK && 
           typeof window.ApperSDK.init === 'function';
  };

  const checkViewport = () => {
    const viewport = document.documentElement;
    return viewport.clientWidth > 0 && viewport.clientHeight > 0;
  };

  const initSDK = () => {
    try {
      if (!checkSDKAvailability()) {
        if (retryCount < maxRetries) {
          retryCount++;
          const delay = baseDelay * Math.pow(2, retryCount - 1); // Exponential backoff
          console.log(`Apper SDK not ready, retrying in ${delay}ms (attempt ${retryCount}/${maxRetries})`);
          setTimeout(initSDK, delay);
          return;
        } else {
          console.warn('Apper SDK failed to load after maximum retries. App will continue without SDK.');
          return;
        }
      }

      if (!checkViewport()) {
        setTimeout(initSDK, 100);
        return;
      }

      // Verify environment variables are available
      const projectId = import.meta.env.VITE_APPER_PROJECT_ID;
      const publicKey = import.meta.env.VITE_APPER_PUBLIC_KEY;

      if (!projectId || !publicKey) {
        console.warn('Apper SDK environment variables not configured properly');
        return;
      }

      // Initialize SDK with proper error handling
      const initPromise = window.ApperSDK.init({
        projectId,
        publicKey,
        captureViewport: false,
        autoCapture: false,
      });

      // Handle both promise and non-promise returns
      if (initPromise && typeof initPromise.catch === 'function') {
        initPromise.catch(error => {
          console.warn('Apper SDK initialization failed:', error);
        });
      }

      console.log('Apper SDK initialized successfully');
    } catch (error) {
      console.warn('Apper SDK initialization error:', error);
    }
  };

  // Start initialization after a brief delay
  setTimeout(initSDK, 500);
};

// Enhanced error boundary for canvas operations
const handleCanvasErrors = () => {
  // Prevent canvas errors by adding global error handler
  window.addEventListener('error', (event) => {
    if (event.message && event.message.includes('canvas') && event.message.includes('width or height of 0')) {
      console.warn('Canvas dimension error prevented:', event.message);
      event.preventDefault();
      return false;
    }
  });
};

// Initialize error handling
handleCanvasErrors();

// React app initialization
ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
);

// Initialize Apper SDK after React app mounts
document.addEventListener('DOMContentLoaded', () => {
  // Additional delay to ensure React has fully rendered
  setTimeout(initializeApperSDK, 1000);
});

// Fallback initialization if DOMContentLoaded already fired
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(initializeApperSDK, 1000);
}