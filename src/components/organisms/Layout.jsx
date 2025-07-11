import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
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