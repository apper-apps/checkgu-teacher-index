import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import { useUser } from "@/contexts/UserContext";

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { userProfile, schoolProfile } = useUser();

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
<Sidebar 
          isOpen={isSidebarOpen} 
          onClose={handleSidebarClose} 
        />
        <div className="flex-1 lg:ml-0">
          <Header 
            onMenuToggle={handleMenuToggle} 
            userProfile={userProfile}
            schoolProfile={schoolProfile}
          />
          <main className="p-4 sm:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;