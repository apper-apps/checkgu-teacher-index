import { useState, useEffect } from "react";
import { startOfWeek, addDays, format, isToday, addWeeks, subWeeks } from "date-fns";
import TimeSlot from "@/components/molecules/TimeSlot";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { settingsService } from "@/services/api/settingsService";
import { calculateAcademicWeek } from "@/utils/academicWeek";

const TimetableGrid = ({ schedules = [], onSlotClick, onWeekChange }) => {
  const [selectedDay, setSelectedDay] = useState(0);
const [currentWeek, setCurrentWeek] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [academicCalendar, setAcademicCalendar] = useState(null);
  
  useEffect(() => {
    loadAcademicCalendar();
  }, []);

  useEffect(() => {
    // Notify parent component when week changes to refresh schedule data
    if (onWeekChange) {
      onWeekChange(currentWeek);
    }
  }, [currentWeek, onWeekChange]);

const loadAcademicCalendar = async () => {
    try {
      const calendar = await settingsService.getAcademicCalendar();
      setAcademicCalendar(calendar);
    } catch (error) {
      console.error('Failed to load academic calendar:', error);
    }
  };

  const isBreakDay = (date) => {
    if (!academicCalendar?.breaks) return false;
    
    const dateString = format(date, 'yyyy-MM-dd');
    return academicCalendar.breaks.some(breakItem => {
      const breakStart = new Date(breakItem.startDate);
      const breakEnd = new Date(breakItem.endDate);
      const currentDate = new Date(dateString);
      return currentDate >= breakStart && currentDate <= breakEnd;
    });
  };

// Get days array based on week start preference
  const getDaysArray = () => {
    const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    if (academicCalendar?.weekStartsOnSunday) {
      return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
    }
    return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  };

  const days = getDaysArray();
  const timeSlots = [
    "08:00 - 08:45",
    "09:00 - 09:45",
    "10:00 - 10:45",
    "11:00 - 11:45",
    "12:00 - 12:45",
    "13:00 - 13:45",
    "14:00 - 14:45",
    "15:00 - 15:45",
  ];

const getWeekDates = () => {
    const weekStartsOn = academicCalendar?.weekStartsOnSunday ? 0 : 1;
    const startDate = startOfWeek(currentWeek, { weekStartsOn });
    return days.map((_, index) => addDays(startDate, index));
  };
const getAcademicWeekNumber = () => {
    if (!academicCalendar?.termStart) return null;
    return calculateAcademicWeek(currentWeek, academicCalendar.termStart, academicCalendar.weekStartsOnSunday);
  };

  const handleDatePickerChange = (e) => {
    const selectedDate = new Date(e.target.value);
    setCurrentWeek(selectedDate);
    setShowDatePicker(false);
  };
  const isCurrentDay = (dayIndex) => {
    const weekDates = getWeekDates();
    return isToday(weekDates[dayIndex]);
  };

  const getScheduleForSlot = (dayIndex, timeIndex) => {
    const schedule = schedules.find(
      (s) => s.dayOfWeek === dayIndex && s.timeSlot === timeSlots[timeIndex]
    );
    return schedule || null;
  };

  const handlePreviousWeek = () => {
    setCurrentWeek(prev => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(prev => addWeeks(prev, 1));
  };

  const weekDates = getWeekDates();

// Desktop view
  const DesktopGrid = () => (
    <div className="hidden md:block">
      <div className="grid grid-cols-6 gap-4">
        <div className="font-medium text-gray-600">Time</div>
{days.map((day, index) => {
          const dayDate = weekDates[index];
          const isBreak = isBreakDay(dayDate);
          
          return (
            <div key={day} className={`font-medium text-center p-2 rounded-lg transition-colors ${
              isCurrentDay(index) 
                ? 'bg-primary-100 text-primary-800 border-2 border-primary-300' 
                : isBreak
                ? 'bg-red-50 text-red-800 border border-red-200'
                : 'text-gray-900'
            }`}>
              <div className="text-sm font-semibold">{day}</div>
              <div className="text-xs text-gray-600 mt-1">
                {format(dayDate, 'MMM dd')}
              </div>
              {isBreak && (
                <div className="text-xs text-red-600 mt-1">
                  Break
                </div>
              )}
            </div>
          );
        })}
        
        {timeSlots.map((timeSlot, timeIndex) => (
          <div key={timeSlot} className="contents">
            <div className="py-3 text-sm text-gray-600 font-medium">
              {timeSlot}
            </div>
{days.map((day, dayIndex) => {
              const schedule = getScheduleForSlot(dayIndex, timeIndex);
              return (
                <TimeSlot
                  key={`${day}-${timeIndex}`}
                  time={timeSlot}
                  subject={schedule?.subject}
                  className={schedule?.className}
                  isEmpty={!schedule}
                  isToday={isCurrentDay(dayIndex)}
                  hideTime={!schedule}
                  onClick={() => onSlotClick?.(dayIndex, timeIndex, timeSlot)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );

  // Mobile view
  const MobileView = () => (
    <div className="md:hidden">
<div className="flex gap-2 mb-4 overflow-x-auto pb-2">
{days.map((day, index) => {
          const dayDate = weekDates[index];
          const isBreak = isBreakDay(dayDate);
          
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(index)}
              className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedDay === index
                  ? "bg-primary-500 text-white"
                  : isCurrentDay(index)
                  ? "bg-primary-100 text-primary-800 border-2 border-primary-300"
                  : isBreak
                  ? "bg-red-50 text-red-800 border border-red-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <div className="font-semibold">{day}</div>
              <div className="text-xs mt-1">
                {format(dayDate, 'MMM dd')}
              </div>
              {isBreak && (
                <div className="text-xs mt-1">
                  Break
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      <Card>
        <CardHeader>
<CardTitle className="flex items-center gap-2">
            <ApperIcon name="Calendar" size={20} className="text-primary-600" />
            <div>
              <div>{days[selectedDay]}</div>
              <div className="text-sm text-gray-600 font-normal">
                {format(weekDates[selectedDay], 'MMMM dd, yyyy')}
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
{timeSlots.map((timeSlot, timeIndex) => {
              const schedule = getScheduleForSlot(selectedDay, timeIndex);
              return (
                <TimeSlot
                  key={timeIndex}
                  time={timeSlot}
                  subject={schedule?.subject}
                  className={schedule?.className}
                  isEmpty={!schedule}
                  isToday={isCurrentDay(selectedDay)}
                  hideTime={!schedule}
                  onClick={() => onSlotClick?.(selectedDay, timeIndex, timeSlot)}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

return (
    <div>
      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePreviousWeek}
          className="flex items-center gap-2"
        >
          <ApperIcon name="ChevronLeft" size={16} />
          Previous Week
        </Button>
        
<div className="text-center relative">
          <div className="text-lg font-semibold text-gray-900">
            {getAcademicWeekNumber() ? `Week ${getAcademicWeekNumber()}` : 'Week'} of {format(weekDates[0], 'MMMM dd, yyyy')}
          </div>
          <div 
            className="text-sm text-gray-600 cursor-pointer hover:text-primary-600 transition-colors"
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            {format(weekDates[0], 'MMM dd')} - {format(weekDates[4], 'MMM dd, yyyy')}
            <ApperIcon name="CalendarDays" size={14} className="inline-block ml-1" />
          </div>
          {showDatePicker && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10">
              <Input
                type="date"
                value={format(currentWeek, 'yyyy-MM-dd')}
                onChange={handleDatePickerChange}
                className="w-auto text-sm"
              />
            </div>
          )}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextWeek}
          className="flex items-center gap-2"
        >
          Next Week
          <ApperIcon name="ChevronRight" size={16} />
        </Button>
      </div>

      <DesktopGrid />
      <MobileView />
    </div>
  );
};

export default TimetableGrid;