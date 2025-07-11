import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const NavItem = ({ icon, label, to, className }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors duration-200 group",
          isActive && "bg-primary-100 text-primary-700 font-medium",
          className
        )
      }
    >
      <ApperIcon 
        name={icon} 
        size={20} 
        className="group-hover:scale-110 transition-transform duration-200" 
      />
      <span>{label}</span>
    </NavLink>
  );
};

export default NavItem;