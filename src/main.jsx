import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Apper SDK initialization with error handling
const initializeApperSDK = () => {
  try {
    // Check if Apper SDK is available
    if (typeof window !== 'undefined' && window.ApperSDK) {
      // Ensure viewport has proper dimensions before SDK operations
      const checkViewport = () => {
        const viewport = document.documentElement;
        return viewport.clientWidth > 0 && viewport.clientHeight > 0;
      };

      // Wait for proper viewport dimensions
      const initSDK = () => {
        if (checkViewport()) {
          window.ApperSDK.init({
            projectId: import.meta.env.VITE_APPER_PROJECT_ID,
            publicKey: import.meta.env.VITE_APPER_PUBLIC_KEY,
            // Prevent canvas operations on zero-dimension elements
            captureViewport: false,
            autoCapture: false,
          }).catch(error => {
            console.warn('Apper SDK initialization failed:', error);
          });
        } else {
          // Retry after DOM is fully ready
          setTimeout(initSDK, 100);
        }
      };

      // Initialize after a brief delay to ensure DOM is stable
      setTimeout(initSDK, 500);
    }
  } catch (error) {
    console.warn('Apper SDK setup error:', error);
  }
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