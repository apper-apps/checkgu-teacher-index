import { useState } from "react";
import { startOfWeek, addDays, format, isToday, addWeeks, subWeeks } from "date-fns";
import TimeSlot from "@/components/molecules/TimeSlot";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const TimetableGrid = ({ schedules = [], onSlotClick }) => {
  const [selectedDay, setSelectedDay] = useState(0);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
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
    const startDate = startOfWeek(currentWeek, { weekStartsOn: 1 });
    return days.map((_, index) => addDays(startDate, index));
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
        {days.map((day, index) => (
          <div key={day} className={`font-medium text-center p-2 rounded-lg transition-colors ${
            isCurrentDay(index) 
              ? 'bg-primary-100 text-primary-800 border-2 border-primary-300' 
              : 'text-gray-900'
          }`}>
            <div className="text-sm font-semibold">{day}</div>
            <div className="text-xs text-gray-600 mt-1">
              {format(weekDates[index], 'MMM dd')}
            </div>
          </div>
        ))}
        
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
        {days.map((day, index) => (
          <button
            key={day}
            onClick={() => setSelectedDay(index)}
            className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedDay === index
                ? "bg-primary-500 text-white"
                : isCurrentDay(index)
                ? "bg-primary-100 text-primary-800 border-2 border-primary-300"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <div className="font-semibold">{day}</div>
            <div className="text-xs mt-1">
              {format(weekDates[index], 'MMM dd')}
            </div>
          </button>
        ))}
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
        
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            Week of {format(weekDates[0], 'MMMM dd, yyyy')}
          </div>
          <div className="text-sm text-gray-600">
            {format(weekDates[0], 'MMM dd')} - {format(weekDates[4], 'MMM dd, yyyy')}
          </div>
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