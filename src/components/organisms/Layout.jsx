import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";
import { settingsService } from "@/services/api/settingsService";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [schoolProfile, setSchoolProfile] = useState(null);

  useEffect(() => {
    const loadSchoolProfile = async () => {
      try {
        const profile = await settingsService.getSchoolProfile();
        setSchoolProfile(profile);
      } catch (error) {
        console.error('Failed to load school profile:', error);
      }
    };
    loadSchoolProfile();
  }, []);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} schoolProfile={schoolProfile} />
        <div className="flex-1 lg:ml-0">
          <Header onMenuToggle={handleMenuToggle} />
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;