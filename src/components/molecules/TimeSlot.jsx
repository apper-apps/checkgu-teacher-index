import { cn } from "@/utils/cn";
import Badge from "@/components/atoms/Badge";

const TimeSlot = ({ time, subject, className, onClick, isEmpty = false }) => {
  const subjectColors = {
    "Mathematics": "bg-blue-100 text-blue-800 border-blue-200",
    "English": "bg-green-100 text-green-800 border-green-200",
    "Science": "bg-purple-100 text-purple-800 border-purple-200",
    "History": "bg-orange-100 text-orange-800 border-orange-200",
    "Geography": "bg-teal-100 text-teal-800 border-teal-200",
    "Art": "bg-pink-100 text-pink-800 border-pink-200",
    "Physical Education": "bg-red-100 text-red-800 border-red-200",
    "Music": "bg-indigo-100 text-indigo-800 border-indigo-200",
  };

  return (
    <div
      className={cn(
        "p-3 rounded-lg border-2 border-dashed border-gray-200 cursor-pointer transition-all duration-200 hover:border-primary-300 hover:bg-primary-50",
        !isEmpty && "border-solid bg-white shadow-sm hover:shadow-md",
        className
      )}
      onClick={onClick}
    >
      <div className="text-xs text-gray-500 mb-1">{time}</div>
      {!isEmpty && subject ? (
        <Badge className={subjectColors[subject] || "bg-gray-100 text-gray-800"}>
          {subject}
        </Badge>
      ) : (
        <div className="text-xs text-gray-400">Click to add lesson</div>
      )}
    </div>
  );
};

export default TimeSlot;