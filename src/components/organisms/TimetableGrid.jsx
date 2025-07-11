import { useState } from "react";
import TimeSlot from "@/components/molecules/TimeSlot";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const TimetableGrid = ({ schedules = [], onSlotClick }) => {
  const [selectedDay, setSelectedDay] = useState(0);
  
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

  const getSubjectForSlot = (dayIndex, timeIndex) => {
    const schedule = schedules.find(
      (s) => s.dayOfWeek === dayIndex && s.timeSlot === timeSlots[timeIndex]
    );
    return schedule?.subject || null;
  };

  // Desktop view
  const DesktopGrid = () => (
    <div className="hidden md:block">
      <div className="grid grid-cols-6 gap-4">
        <div className="font-medium text-gray-600">Time</div>
        {days.map((day) => (
          <div key={day} className="font-medium text-gray-900 text-center">
            {day}
          </div>
        ))}
        
        {timeSlots.map((timeSlot, timeIndex) => (
          <div key={timeSlot} className="contents">
            <div className="py-3 text-sm text-gray-600 font-medium">
              {timeSlot}
            </div>
            {days.map((day, dayIndex) => (
              <TimeSlot
                key={`${day}-${timeIndex}`}
                time={timeSlot}
                subject={getSubjectForSlot(dayIndex, timeIndex)}
                isEmpty={!getSubjectForSlot(dayIndex, timeIndex)}
                onClick={() => onSlotClick?.(dayIndex, timeIndex, timeSlot)}
              />
            ))}
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
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              selectedDay === index
                ? "bg-primary-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {day}
          </button>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="Calendar" size={20} className="text-primary-600" />
            {days[selectedDay]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {timeSlots.map((timeSlot, timeIndex) => (
              <TimeSlot
                key={timeIndex}
                time={timeSlot}
                subject={getSubjectForSlot(selectedDay, timeIndex)}
                isEmpty={!getSubjectForSlot(selectedDay, timeIndex)}
                onClick={() => onSlotClick?.(selectedDay, timeIndex, timeSlot)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div>
      <DesktopGrid />
      <MobileView />
    </div>
  );
};

export default TimetableGrid;