import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const Header = ({ onMenuToggle, userProfile, schoolProfile, className }) => {
  const [currentTerm] = useState("Fall 2024");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  return (
<header className={cn("bg-white border-b border-gray-200 px-3 sm:px-4 py-3", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <ApperIcon name="Menu" size={20} />
          </Button>
          <div className="flex items-center gap-2">
            <ApperIcon name="Calendar" size={18} className="text-primary-600" />
            <span className="font-medium text-gray-900 text-sm sm:text-base">{currentTerm}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-sm text-gray-600 hidden lg:block max-w-48 truncate">
            {schoolProfile?.name || "Greenwood Elementary School"}
          </span>
<div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
            >
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <ApperIcon name="User" size={16} className="text-primary-600" />
              </div>
              <span className="hidden md:block text-sm font-medium">
                {userProfile?.firstName || "Ms. Johnson"}
              </span>
              <ApperIcon name="ChevronDown" size={14} className="hidden md:block" />
            </Button>
            {userDropdownOpen && (
<div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {userProfile?.displayName || "Ms. Johnson"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {userProfile?.roleDisplay || "Teacher - Elementary"}
                  </p>
                </div>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                  <ApperIcon name="User" size={16} />
                  Profile
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                  <ApperIcon name="Settings" size={16} />
                  Settings
                </button>
                <hr className="my-1" />
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                  <ApperIcon name="LogOut" size={16} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;