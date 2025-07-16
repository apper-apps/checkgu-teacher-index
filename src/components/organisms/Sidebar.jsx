import React, { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import NavItem from "@/components/molecules/NavItem";
import { cn } from "@/utils/cn";
import { useUser } from "@/contexts/UserContext";
const Sidebar = ({ isOpen, onClose, className }) => {
  const { schoolProfile } = useUser();
const navigationItems = [
    { icon: "LayoutDashboard", label: "Dashboard", to: "/" },
    { icon: "Users", label: "Parent Dashboard", to: "/parent-dashboard" },
    { icon: "Calendar", label: "Calendar", to: "/calendar" },
    { icon: "Clock", label: "Schedule", to: "/schedule" },
    { icon: "Users", label: "Students", to: "/students" },
    { icon: "BookOpen", label: "Lesson Plans", to: "/lesson-plans" },
    { icon: "Settings", label: "Settings", to: "/settings" },
  ];

  // Desktop Sidebar
  const DesktopSidebar = () => (
<div className="hidden lg:block w-64 bg-white border-r border-gray-200 h-screen">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center overflow-hidden">
            {schoolProfile?.logoPreview ? (
              <img
                src={schoolProfile.logoPreview}
                alt="School Logo"
                className="w-full h-full object-contain"
              />
            ) : (
              <ApperIcon name="GraduationCap" size={24} className="text-white" />
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Checkgu</h1>
            <p className="text-xs text-gray-500">Teacher Platform</p>
          </div>
        </div>
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <NavItem
              key={item.to}
              icon={item.icon}
              label={item.label}
              to={item.to}
            />
          ))}
        </nav>
      </div>
    </div>
  );

  // Mobile Sidebar
const MobileSidebar = () => (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-0 w-72 sm:w-80 bg-white h-full z-50 lg:hidden shadow-2xl"
      >
        <div className="p-6">
<div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center overflow-hidden">
                {schoolProfile?.logoPreview ? (
                  <img
                    src={schoolProfile.logoPreview}
                    alt="School Logo"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <ApperIcon name="GraduationCap" size={24} className="text-white" />
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Checkgu</h1>
                <p className="text-xs text-gray-500">Teacher Platform</p>
              </div>
            </div>
<button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close sidebar"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>
          <nav className="space-y-2">
            {navigationItems.map((item) => (
              <NavItem
                key={item.to}
                icon={item.icon}
                label={item.label}
                to={item.to}
              />
            ))}
          </nav>
        </div>
      </motion.div>
    </>
  );

  return (
    <div className={cn(className)}>
      <DesktopSidebar />
      <MobileSidebar />
    </div>
  );
};

export default Sidebar;