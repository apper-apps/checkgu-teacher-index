import React, { createContext, useContext, useState, useEffect } from 'react';
import { settingsService } from '@/services/api/settingsService';
import { toast } from 'react-toastify';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState({
    name: "Ms. Johnson",
    email: "sarah.johnson@greenwood.edu",
    phone: "+1 (555) 123-4567",
    role: "Teacher",
    department: "Elementary"
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user profile on provider mount
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const profile = await settingsService.getUserProfile();
      setUserProfile(profile);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      const updatedProfile = await settingsService.updateUserProfile(profileData);
      setUserProfile(updatedProfile);
      toast.success("Profile updated successfully!");
      return updatedProfile;
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
      throw err;
    }
  };

  const refreshProfile = () => {
    loadUserProfile();
  };

  const value = {
    userProfile,
    loading,
    error,
    updateUserProfile,
    refreshProfile,
    // Helper getters for common display needs
    displayName: userProfile.name,
    firstName: userProfile.name.split(' ')[0],
    initials: userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase(),
    roleDisplay: `${userProfile.role} - ${userProfile.department}`
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;