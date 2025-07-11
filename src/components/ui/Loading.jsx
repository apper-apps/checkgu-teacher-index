import { motion } from "framer-motion";

const Loading = ({ className }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header skeleton */}
      <div className="animate-pulse">
        <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-1/3 mb-4"></div>
      </div>
      
      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-card p-6 animate-pulse"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="h-10 w-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"></div>
              <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-5/6"></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Loading;