import { Card, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StudentCard = ({ student, className }) => {
  const attendanceRate = student.attendanceRate || 0;
  const getAttendanceBadge = (rate) => {
    if (rate >= 95) return { variant: "success", label: "Excellent" };
    if (rate >= 85) return { variant: "primary", label: "Good" };
    if (rate >= 75) return { variant: "accent", label: "Average" };
    return { variant: "error", label: "Poor" };
  };

  const attendanceBadge = getAttendanceBadge(attendanceRate);

  return (
    <Card className={cn("hover:shadow-md transition-shadow duration-200", className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={16} className="text-primary-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{student.name}</h3>
              <p className="text-sm text-gray-500">ID: {student.studentId}</p>
            </div>
          </div>
          <Badge variant={attendanceBadge.variant}>
            {attendanceBadge.label}
          </Badge>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Class:</span>
            <span className="font-medium">{student.className}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Attendance:</span>
            <span className="font-medium">{attendanceRate}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Guardian:</span>
            <span className="font-medium">{student.guardianName}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentCard;