import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import TimetableGrid from "@/components/organisms/TimetableGrid";
import LessonPlanModal from "@/components/organisms/LessonPlanModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { scheduleService } from "@/services/api/scheduleService";
import { lessonPlanService } from "@/services/api/lessonPlanService";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showLessonModal, setShowLessonModal] = useState(false);

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await scheduleService.getAll();
      setSchedules(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSlotClick = (dayIndex, timeIndex, timeSlot) => {
    const existingSchedule = schedules.find(
      s => s.dayOfWeek === dayIndex && s.timeSlot === timeSlot
    );
    
    if (existingSchedule) {
      setSelectedLesson({
        subject: existingSchedule.subject,
        className: existingSchedule.className,
        date: "",
        time: timeSlot,
        dayOfWeek: dayIndex,
        timeSlot: timeSlot
      });
    } else {
      setSelectedLesson({
        subject: "",
        className: "",
        date: "",
        time: timeSlot,
        dayOfWeek: dayIndex,
        timeSlot: timeSlot
      });
    }
    setShowLessonModal(true);
  };

  const handleSaveLessonPlan = async (lessonData) => {
    try {
      await lessonPlanService.create(lessonData);
      toast.success("Lesson plan saved successfully!");
      setShowLessonModal(false);
      setSelectedLesson(null);
    } catch (err) {
      toast.error("Failed to save lesson plan");
      throw err;
    }
  };

  const getTodayStats = () => {
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    const todaySchedules = schedules.filter(s => s.dayOfWeek === (today - 1)); // Adjust for Monday = 0
    
    return {
      totalClasses: todaySchedules.length,
      completedClasses: Math.floor(todaySchedules.length * 0.6), // Mock completion
      upcomingClasses: todaySchedules.length - Math.floor(todaySchedules.length * 0.6)
    };
  };

  const stats = getTodayStats();

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadSchedules} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your teaching schedule.</p>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Classes</p>
                <p className="text-2xl font-bold text-primary-600">{stats.totalClasses}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <ApperIcon name="BookOpen" size={24} className="text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-secondary-600">{stats.completedClasses}</p>
              </div>
              <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
                <ApperIcon name="CheckCircle" size={24} className="text-secondary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-accent-600">{stats.upcomingClasses}</p>
              </div>
              <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center">
                <ApperIcon name="Clock" size={24} className="text-accent-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Timetable */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="Calendar" size={24} className="text-primary-600" />
            Weekly Timetable
          </CardTitle>
        </CardHeader>
        <CardContent>
          {schedules.length === 0 ? (
            <Empty
              title="No schedule available"
              description="Set up your weekly teaching schedule to get started"
              actionLabel="Create Schedule"
              icon="Calendar"
              onAction={() => window.location.href = "/schedule"}
            />
          ) : (
            <TimetableGrid
              schedules={schedules}
              onSlotClick={handleSlotClick}
            />
          )}
        </CardContent>
      </Card>

      {/* Lesson Plan Modal */}
      <LessonPlanModal
        isOpen={showLessonModal}
        onClose={() => {
          setShowLessonModal(false);
          setSelectedLesson(null);
        }}
        lesson={selectedLesson}
        onSave={handleSaveLessonPlan}
      />
    </div>
  );
};

export default Dashboard;