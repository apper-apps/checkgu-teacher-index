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

const TimetableGrid = ({ schedules = [], onSlotClick }) => {
  const [selectedDay, setSelectedDay] = useState(0);
const [currentWeek, setCurrentWeek] = useState(new Date());
const [showDatePicker, setShowDatePicker] = useState(false);
  const [academicCalendar, setAcademicCalendar] = useState(null);
  const [dailySchedule, setDailySchedule] = useState(null);
useEffect(() => {
    loadAcademicCalendar();
    loadDailySchedule();
  }, []);

  // Reload settings when they change to ensure persistence
  useEffect(() => {
    if (academicCalendar || dailySchedule) {
      // Force re-render when settings are updated
      setCurrentWeek(prev => new Date(prev));
    }
  }, [academicCalendar, dailySchedule]);
const loadAcademicCalendar = async () => {
    try {
      const calendar = await settingsService.getAcademicCalendar();
      setAcademicCalendar(calendar);
    } catch (error) {
      console.error('Failed to load academic calendar:', error);
    }
  };

  const loadDailySchedule = async () => {
    try {
      const schedule = await settingsService.getDailySchedule();
      setDailySchedule(schedule);
    } catch (error) {
      console.error('Failed to load daily schedule:', error);
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
    if (academicCalendar?.weekStartsOnSunday) {
      return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
    }
    return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  };

  const days = getDaysArray();
  
  // Generate time slots based on daily schedule working hours
  const generateTimeSlots = (startTime, endTime, duration = 45) => {
    const slots = [];
    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);
    
    let slotStart = new Date(start);
    
    while (slotStart < end) {
      const slotEnd = new Date(slotStart.getTime() + duration * 60000);
      
      // Don't add slot if it would extend beyond working hours
      if (slotEnd > end) break;
      
      const startStr = slotStart.toTimeString().substring(0, 5);
      const endStr = slotEnd.toTimeString().substring(0, 5);
      slots.push(`${startStr} - ${endStr}`);
      
      // Move to next slot (with 15-minute break)
      slotStart = new Date(slotEnd.getTime() + 15 * 60000);
    }
    
    return slots;
  };

  // Get time slots for a specific day based on its working hours
  const getTimeSlotsForDay = (dayIndex) => {
    if (!dailySchedule) {
      // Fallback to default schedule if daily schedule not loaded
      return generateTimeSlots("08:00", "16:00");
    }
    
    const dayName = days[dayIndex];
    const daySchedule = dailySchedule[dayName];
    
    if (!daySchedule || !daySchedule.enabled) {
      return []; // No slots for disabled days
    }
    
    return generateTimeSlots(daySchedule.startTime, daySchedule.endTime);
  };

// Get time slots that respect each day's individual working hours
  const getAllTimeSlots = () => {
    if (!dailySchedule) {
      return generateTimeSlots("08:00", "16:00");
    }
    
    // Find the earliest start time and latest end time among enabled days
    let earliestStart = "23:59";
    let latestEnd = "00:00";
    
    days.forEach((_, dayIndex) => {
      const dayName = days[dayIndex];
      const daySchedule = dailySchedule[dayName];
      
      // Skip disabled days
      if (!daySchedule || !daySchedule.enabled) {
        return;
      }
      
      const startTime = daySchedule.startTime || "08:00";
      const endTime = daySchedule.endTime || "16:00";
      
      if (startTime < earliestStart) {
        earliestStart = startTime;
      }
      if (endTime > latestEnd) {
        latestEnd = endTime;
      }
    });
    
    // If no enabled days found, return default
    if (earliestStart === "23:59" || latestEnd === "00:00") {
      return generateTimeSlots("08:00", "16:00");
    }
    
    return generateTimeSlots(earliestStart, latestEnd);
  };

  const timeSlots = getAllTimeSlots();

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
    const dayTimeSlots = getTimeSlotsForDay(dayIndex);
    const timeSlot = dayTimeSlots[timeIndex];
    
    if (!timeSlot) return null;
    
    const schedule = schedules.find(
      (s) => s.dayOfWeek === dayIndex && s.timeSlot === timeSlot
    );
    return schedule || null;
  };

  const isAfterWorkingHours = (dayIndex, timeSlot) => {
    if (!dailySchedule) return false;
    
    const dayName = days[dayIndex];
    const daySchedule = dailySchedule[dayName];
    
    if (!daySchedule || !daySchedule.enabled) return true;
    
    const endTime = daySchedule.endTime;
    const slotStartTime = timeSlot.split(' - ')[0];
    
    // Convert times to minutes for comparison
    const endMinutes = parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1]);
    const slotMinutes = parseInt(slotStartTime.split(':')[0]) * 60 + parseInt(slotStartTime.split(':')[1]);
    
    return slotMinutes >= endMinutes;
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
              const dayTimeSlots = getTimeSlotsForDay(dayIndex);
              const dayTimeIndex = dayTimeSlots.indexOf(timeSlot);
              const schedule = dayTimeIndex >= 0 ? getScheduleForSlot(dayIndex, dayTimeIndex) : null;
              const isSlotAvailable = dayTimeSlots.includes(timeSlot);
              
              return (
                <TimeSlot
                  key={`${day}-${timeIndex}`}
                  time={timeSlot}
                  subject={schedule?.subject}
                  className={schedule?.className}
                  isEmpty={!schedule || !isSlotAvailable}
                  isToday={isCurrentDay(dayIndex)}
                  hideTime={!schedule || !isSlotAvailable}
                  isAfterWorkingHours={!isSlotAvailable}
                  onClick={() => isSlotAvailable ? onSlotClick?.(dayIndex, dayTimeIndex, timeSlot) : null}
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
{getTimeSlotsForDay(selectedDay).map((timeSlot, timeIndex) => {
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
                  isAfterWorkingHours={isAfterWorkingHours(selectedDay, timeSlot)}
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
            {format(weekDates[0], 'MMM dd')} - {format(weekDates[weekDates.length - 1], 'MMM dd, yyyy')}
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