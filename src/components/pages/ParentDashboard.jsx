import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";
import { scheduleService } from "@/services/api/scheduleService";
import { toast } from "react-toastify";

const ParentDashboard = () => {
  const { token } = useParams();
  const [childData, setChildData] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authError, setAuthError] = useState(null);

  // Mock child ID - in real app this would come from authentication/context
  const childId = 1;

useEffect(() => {
    if (token) {
      validateTokenAndLoadData();
    } else {
      loadChildData();
      loadSchedules();
    }
  }, [token]);

  const validateTokenAndLoadData = async () => {
    try {
      setLoading(true);
      setAuthError(null);
      
      const result = await studentService.validateParentToken(token);
      if (result.valid) {
        const child = await studentService.getById(result.studentId);
        setChildData(child);
        loadSchedules();
      } else {
        setAuthError("Invalid or expired access link. Please contact the school for a new link.");
      }
    } catch (err) {
      setAuthError("Access denied. The link may have expired or is invalid.");
      toast.error("Failed to authenticate parent access");
    } finally {
      setLoading(false);
    }
  };

  const loadChildData = async () => {
    try {
      const child = await studentService.getById(childId);
      setChildData(child);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load child information");
    }
  };

  const loadSchedules = async () => {
    try {
      setLoading(true);
      const data = await scheduleService.getAll();
      setSchedules(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load schedule information");
    } finally {
      setLoading(false);
    }
  };

  const getAttendanceBadge = (rate) => {
    if (rate >= 95) return { variant: "success", text: "Excellent" };
    if (rate >= 90) return { variant: "primary", text: "Good" };
    if (rate >= 85) return { variant: "warning", text: "Average" };
    return { variant: "destructive", text: "Needs Attention" };
  };

  const getGradeBadge = (grade) => {
    if (grade.includes("A")) return { variant: "success", text: grade };
    if (grade.includes("B")) return { variant: "primary", text: grade };
    if (grade.includes("C")) return { variant: "warning", text: grade };
    return { variant: "destructive", text: grade };
  };

  const getWeeklySchedule = () => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const weeklySchedule = days.map((day, index) => {
      const daySchedules = schedules.filter(s => s.dayOfWeek === index);
      return {
        day,
        classes: daySchedules.length,
        subjects: daySchedules.map(s => s.subject).join(", ") || "No classes"
      };
    });
    return weeklySchedule;
  };

  const getAttendanceStats = () => {
    if (!childData) return { present: 0, total: 0, rate: 0 };
    
    const totalDays = 30; // Mock total school days
    const presentDays = Math.floor((childData.attendanceRate / 100) * totalDays);
    return {
      present: presentDays,
      total: totalDays,
      rate: childData.attendanceRate
    };
  };

if (loading) return <Loading />;
  if (authError) return <Error message={authError} />;
  if (error) return <Error message={error} onRetry={() => { token ? validateTokenAndLoadData() : loadChildData(); loadSchedules(); }} />;
  if (!childData) return <Error message="Child information not found" />;

  const attendanceStats = getAttendanceStats();
  const attendanceBadge = getAttendanceBadge(childData.attendanceRate);
  const gradeBadge = getGradeBadge(childData.overallGrade);
  const weeklySchedule = getWeeklySchedule();

return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {token ? "Secure Parent Access" : "Parent Dashboard"}
          </h1>
          <p className="text-gray-600">
            {token 
              ? `Viewing ${childData.name}'s academic progress and attendance`
              : "Monitor your child's academic progress and attendance"
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ApperIcon name="Calendar" size={20} className="text-primary-600" />
          <span className="text-sm text-gray-600">
            {new Date().toLocaleDateString("en-US", { 
              weekday: "long", 
              year: "numeric", 
              month: "long", 
              day: "numeric" 
            })}
          </span>
        </div>
      </div>

      {/* Child Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="User" size={24} className="text-primary-600" />
            Student Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="text-lg font-semibold text-gray-900">{childData.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Student ID</p>
              <p className="text-lg font-semibold text-gray-900">{childData.studentId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Class</p>
              <p className="text-lg font-semibold text-gray-900">{childData.className}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Overall Grade</p>
              <div className="flex items-center gap-2">
                <Badge variant={gradeBadge.variant}>{gradeBadge.text}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="UserCheck" size={24} className="text-secondary-600" />
              Attendance Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Attendance Rate</span>
                <Badge variant={attendanceBadge.variant}>{attendanceBadge.text}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Present Days</span>
                <span className="font-semibold">{attendanceStats.present}/{attendanceStats.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-secondary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${attendanceStats.rate}%` }}
                />
              </div>
              <div className="text-center">
                <span className="text-2xl font-bold text-secondary-600">{attendanceStats.rate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grade Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="Award" size={24} className="text-accent-600" />
              Academic Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Overall Grade</span>
                <Badge variant={gradeBadge.variant} className="text-lg px-3 py-1">
                  {childData.overallGrade}
                </Badge>
              </div>
              <div className="text-center py-4">
                <div className="w-20 h-20 bg-gradient-to-br from-accent-100 to-accent-200 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl font-bold text-accent-600">{childData.overallGrade}</span>
                </div>
                <p className="text-sm text-gray-600">Current Grade</p>
              </div>
              {childData.notes && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700">{childData.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Schedule Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="Calendar" size={24} className="text-primary-600" />
            Weekly Schedule Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {weeklySchedule.map((dayInfo, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 mb-2">{dayInfo.day}</h3>
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-lg font-bold text-primary-600">{dayInfo.classes}</span>
                  </div>
                  <p className="text-xs text-gray-600">{dayInfo.classes} classes</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{dayInfo.subjects}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Guardian Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="Phone" size={24} className="text-gray-600" />
            Guardian Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Guardian Name</p>
              <p className="text-lg font-semibold text-gray-900">{childData.guardianName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone Number</p>
              <p className="text-lg font-semibold text-gray-900">{childData.guardianPhone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email Address</p>
              <p className="text-lg font-semibold text-gray-900">{childData.guardianEmail}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParentDashboard;