import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const Header = ({ onMenuToggle, className }) => {
  const [currentTerm] = useState("Fall 2024");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className={cn("bg-white border-b border-gray-200 px-4 py-3", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" size={20} />
          </Button>
          <div className="flex items-center gap-2">
            <ApperIcon name="Calendar" size={20} className="text-primary-600" />
            <span className="font-medium text-gray-900">{currentTerm}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 hidden md:block">
            Greenwood Elementary School
          </span>
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <ApperIcon name="User" size={16} className="text-primary-600" />
              </div>
              <span className="hidden md:block">Ms. Johnson</span>
              <ApperIcon name="ChevronDown" size={16} />
            </Button>
            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                  Profile
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                  Settings
                </button>
                <hr className="my-1" />
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
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