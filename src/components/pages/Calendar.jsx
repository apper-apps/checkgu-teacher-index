import React, { useEffect, useState } from "react";
import { eachDayOfInterval, endOfMonth, format, getDay, isSameMonth, isToday, startOfMonth } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import { lessonPlanService } from "@/services/api/lessonPlanService";
import { scheduleService } from "@/services/api/scheduleService";
import { settingsService } from "@/services/api/settingsService";
const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedules, setSchedules] = useState([]);
  const [lessonPlans, setLessonPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("month");
  const [academicCalendar, setAcademicCalendar] = useState(null);

  useEffect(() => {
    loadAcademicCalendar();
  }, []);

  const loadAcademicCalendar = async () => {
    try {
      const calendar = await settingsService.getAcademicCalendar();
      setAcademicCalendar(calendar);
    } catch (error) {
      console.error('Failed to load academic calendar:', error);
    }
  };

  useEffect(() => {
    loadCalendarData();
  }, []);

  const loadCalendarData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [schedulesData, lessonPlansData] = await Promise.all([
        scheduleService.getAll(),
        lessonPlanService.getAll()
      ]);
      setSchedules(schedulesData);
      setLessonPlans(lessonPlansData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

const getScheduleForDay = (date) => {
    // Convert day to match schedule dayOfWeek (0=Monday, 6=Sunday)
    const dayOfWeek = academicCalendar?.weekStartsOnSunday 
      ? getDay(date) === 0 ? 6 : getDay(date) - 1  // Sunday=6, Monday=0
      : (getDay(date) + 6) % 7; // Convert Sunday=0 to Monday=0
    return schedules.filter(s => s.dayOfWeek === dayOfWeek);
  };

  const getLessonPlansForDay = (date) => {
    const dateString = format(date, "yyyy-MM-dd");
    return lessonPlans.filter(lp => lp.date === dateString);
  };

  const isHoliday = (date) => {
    // Mock holiday data - in real app, this would come from settings
    const holidays = [
      "2024-01-01", "2024-07-04", "2024-12-25"
    ];
    return holidays.includes(format(date, "yyyy-MM-dd"));
  };

const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {(academicCalendar?.weekStartsOnSunday 
          ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
          : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        ).map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {days.map(date => {
          const daySchedules = getScheduleForDay(date);
          const dayLessonPlans = getLessonPlansForDay(date);
          const isCurrentMonth = isSameMonth(date, currentDate);
          const isTodayDate = isToday(date);
          const isHolidayDate = isHoliday(date);

          return (
            <div
              key={date.toISOString()}
              className={`min-h-[100px] p-2 border border-gray-200 ${
                isCurrentMonth ? "bg-white" : "bg-gray-50"
              } ${isTodayDate ? "bg-primary-50 border-primary-200" : ""} ${
                isHolidayDate ? "bg-red-50 border-red-200" : ""
              } hover:bg-gray-50 cursor-pointer transition-colors`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-sm ${
                  isTodayDate ? "font-bold text-primary-600" : 
                  isCurrentMonth ? "text-gray-900" : "text-gray-400"
                }`}>
                  {format(date, "d")}
                </span>
                {isHolidayDate && (
                  <Badge variant="error" className="text-xs">
                    Holiday
                  </Badge>
                )}
              </div>
              
              <div className="space-y-1">
                {daySchedules.slice(0, 2).map((schedule, index) => (
                  <div
                    key={index}
                    className="text-xs bg-primary-100 text-primary-800 px-1 py-0.5 rounded truncate"
                  >
                    {schedule.subject}
                  </div>
                ))}
                {dayLessonPlans.slice(0, 1).map((plan, index) => (
                  <div
                    key={index}
                    className="text-xs bg-secondary-100 text-secondary-800 px-1 py-0.5 rounded truncate"
                  >
                    {plan.subject} Plan
                  </div>
                ))}
                {(daySchedules.length + dayLessonPlans.length) > 3 && (
                  <div className="text-xs text-gray-500">
                    +{(daySchedules.length + dayLessonPlans.length) - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCalendarData} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600">View your teaching schedule and lesson plans</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "month" ? "primary" : "outline"}
            size="sm"
            onClick={() => setViewMode("month")}
          >
            Month
          </Button>
          <Button
            variant={viewMode === "week" ? "primary" : "outline"}
            size="sm"
            onClick={() => setViewMode("week")}
          >
            Week
          </Button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="Calendar" size={24} className="text-primary-600" />
              {format(currentDate, "MMMM yyyy")}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth(-1)}
              >
                <ApperIcon name="ChevronLeft" size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth(1)}
              >
                <ApperIcon name="ChevronRight" size={16} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderMonthView()}
        </CardContent>
      </Card>

      {/* Calendar Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary-100 rounded"></div>
              <span className="text-sm">Scheduled Classes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-secondary-100 rounded"></div>
              <span className="text-sm">Lesson Plans</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 rounded"></div>
              <span className="text-sm">Holidays</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary-50 border border-primary-200 rounded"></div>
              <span className="text-sm">Today</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Calendar;