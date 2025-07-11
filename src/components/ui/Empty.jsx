import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data available", 
  description = "Get started by adding your first item",
  actionLabel = "Add Item",
  onAction,
  icon = "Inbox",
  className 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}
    >
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name={icon} size={32} className="text-primary-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-gray-600 mb-6">{description}</p>
        {onAction && (
          <Button onClick={onAction} className="inline-flex items-center">
            <ApperIcon name="Plus" size={16} className="mr-2" />
            {actionLabel}
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default Empty;