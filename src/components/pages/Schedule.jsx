import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import FormField from "@/components/molecules/FormField";
import { scheduleService } from "@/services/api/scheduleService";
import { settingsService } from "@/services/api/settingsService";
import { classService } from "@/services/api/classService";

// Subject Schedule Manager Component
const SubjectScheduleManager = ({ subjectSchedules, onChange, availableSubjects, days, timeSlots }) => {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);

  const handleAddSchedule = () => {
    if (!selectedSubject || selectedDays.length === 0 || selectedTimeSlots.length === 0) {
      return;
    }

    const newSchedule = {
      id: Date.now(),
      subject: selectedSubject,
      days: selectedDays,
      timeSlots: selectedTimeSlots
    };

    onChange([...subjectSchedules, newSchedule]);
    setSelectedSubject("");
    setSelectedDays([]);
    setSelectedTimeSlots([]);
  };

  const handleRemoveSchedule = (scheduleId) => {
    onChange(subjectSchedules.filter(s => s.id !== scheduleId));
  };

  const toggleDay = (dayIndex) => {
    setSelectedDays(prev => 
      prev.includes(dayIndex) 
        ? prev.filter(d => d !== dayIndex)
        : [...prev, dayIndex]
    );
  };

  const toggleTimeSlot = (timeSlot) => {
    setSelectedTimeSlots(prev => 
      prev.includes(timeSlot) 
        ? prev.filter(t => t !== timeSlot)
        : [...prev, timeSlot]
    );
  };

  return (
    <div className="space-y-4">
      {/* Add New Subject Schedule */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <h4 className="font-medium mb-3">Add Subject Teaching Schedule</h4>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <Select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full"
            >
              <option value="">Select a subject</option>
              {availableSubjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Teaching Days</label>
            <div className="flex flex-wrap gap-2">
              {days.map((day, index) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(index)}
                  className={`px-3 py-1 text-sm rounded border ${
                    selectedDays.includes(index)
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Time Slots</label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {timeSlots.map(timeSlot => (
                <button
                  key={timeSlot}
                  type="button"
                  onClick={() => toggleTimeSlot(timeSlot)}
                  className={`px-2 py-1 text-xs rounded border text-left ${
                    selectedTimeSlots.includes(timeSlot)
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {timeSlot}
                </button>
              ))}
            </div>
          </div>

          <Button
            type="button"
            onClick={handleAddSchedule}
            disabled={!selectedSubject || selectedDays.length === 0 || selectedTimeSlots.length === 0}
            className="w-full"
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Subject Schedule
          </Button>
        </div>
      </div>

      {/* Current Subject Schedules */}
      {subjectSchedules.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Registered Subject Schedules</h4>
          {subjectSchedules.map(schedule => (
            <div key={schedule.id} className="border border-gray-200 rounded-lg p-3 bg-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-primary-700">{schedule.subject}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    <div>Days: {schedule.days.map(d => days[d]).join(', ')}</div>
                    <div>Times: {schedule.timeSlots.length} slots ({schedule.timeSlots.length * schedule.days.length} total periods)</div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveSchedule(schedule.id)}
                >
                  <ApperIcon name="Trash" size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
const Schedule = () => {
  const [classes, setClasses] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [schedulePreferences, setSchedulePreferences] = useState(null);
const [dailySchedule, setDailySchedule] = useState({});
  const [classLevels, setClassLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("schedule");
  const [showAddClass, setShowAddClass] = useState(false);
  const [showAddClassLevel, setShowAddClassLevel] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingClassLevel, setEditingClassLevel] = useState(null);
const [newClass, setNewClass] = useState({
    name: "",
    gradeLevel: "",
    subjectSchedules: []
  });
  const [newClassLevel, setNewClassLevel] = useState({
    name: "",
    description: ""
  });

  const subjects = [
    "Mathematics", "English", "Science", "History", "Geography", 
    "Art", "Physical Education", "Music"
  ];

const [academicCalendar, setAcademicCalendar] = useState(null);

  // Get days array based on week start preference
  const getDaysArray = () => {
    if (!academicCalendar) return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    
    const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    if (academicCalendar.weekStartsOnSunday) {
      return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
    }
    return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  };

  const days = getDaysArray();

  useEffect(() => {
    loadData();
  }, []);

const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [classesData, schedulesData, preferencesData, dailyScheduleData, classLevelsData, academicCalendarData] = await Promise.all([
        classService.getAll(),
        scheduleService.getAll(),
        settingsService.getSchedulePreferences(),
        settingsService.getDailySchedule(),
        settingsService.getClassLevels(),
        settingsService.getAcademicCalendar()
      ]);
      setClasses(classesData);
      setSchedules(schedulesData);
      setSchedulePreferences(preferencesData);
      setDailySchedule(dailyScheduleData);
      setClassLevels(classLevelsData);
      setAcademicCalendar(academicCalendarData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSlots = (startTime, endTime, duration = 45) => {
    const slots = [];
    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);
    
    while (start < end) {
      const slotStart = start.toTimeString().slice(0, 5);
      start.setMinutes(start.getMinutes() + duration);
      const slotEnd = start.toTimeString().slice(0, 5);
      
      if (start <= end) {
        slots.push(`${slotStart} - ${slotEnd}`);
      }
    }
    return slots;
  };

const getTimeSlotsForDay = (dayIndex) => {
    const dayName = days[dayIndex];
    const daySchedule = dailySchedule[dayName];
    
    // If day is explicitly disabled, return empty slots
    if (daySchedule && !daySchedule.enabled) {
      return [];
    }
    
    // Use day-specific schedule if available, otherwise use individual day defaults
    const startTime = daySchedule?.startTime || schedulePreferences?.defaultWorkingHours?.start || "08:00";
    const endTime = daySchedule?.endTime || schedulePreferences?.defaultWorkingHours?.end || "16:00";
    
    return generateTimeSlots(startTime, endTime, schedulePreferences?.classPeriodMinutes || 45);
  };

const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      // Create class with subject list extracted from schedules
      const subjects = [...new Set(newClass.subjectSchedules.map(s => s.subject))];
      const classData = {
        name: newClass.name,
        gradeLevel: newClass.gradeLevel,
        subjects: subjects
      };
      
      const createdClass = await classService.create(classData);
      
      // Create individual schedule entries for each subject schedule
      for (const subjectSchedule of newClass.subjectSchedules) {
        for (const dayIndex of subjectSchedule.days) {
          for (const timeSlot of subjectSchedule.timeSlots) {
            await scheduleService.create({
              classId: createdClass.Id,
              className: createdClass.name,
              dayOfWeek: dayIndex,
              timeSlot: timeSlot,
              subject: subjectSchedule.subject
            });
          }
        }
      }
      
      toast.success("Class and subject schedules created successfully!");
      setNewClass({ name: "", gradeLevel: "", subjectSchedules: [] });
      setShowAddClass(false);
      loadData();
    } catch (err) {
      toast.error("Failed to create class");
    }
  };

  const handleScheduleChange = async (classId, dayIndex, timeSlot, subject) => {
    try {
      const existingSchedule = schedules.find(
        s => s.classId === classId && s.dayOfWeek === dayIndex && s.timeSlot === timeSlot
      );

      if (existingSchedule) {
        if (subject) {
          await scheduleService.update(existingSchedule.Id, { subject });
        } else {
          await scheduleService.delete(existingSchedule.Id);
        }
      } else if (subject) {
        await scheduleService.create({
          classId,
          dayOfWeek: dayIndex,
          timeSlot,
          subject
        });
      }
      
      loadData();
    } catch (err) {
      toast.error("Failed to update schedule");
    }
  };

const handleDailyScheduleChange = (day, field, value) => {
    const updatedSchedule = {
      ...dailySchedule,
      [day]: {
        ...dailySchedule[day],
        [field]: value
      }
    };
    
    setDailySchedule(updatedSchedule);
    setHasUnsavedChanges(true);
  };

const handleDefaultWorkingHoursChange = (field, value) => {
    const updatedPreferences = {
      ...schedulePreferences,
      defaultWorkingHours: {
        ...schedulePreferences.defaultWorkingHours,
        [field]: value
      }
    };
    
    // Handle classPeriodMinutes separately since it's not nested
    if (field === "classPeriodMinutes") {
      updatedPreferences.classPeriodMinutes = value;
      delete updatedPreferences.defaultWorkingHours.classPeriodMinutes;
    }
    
    setSchedulePreferences(updatedPreferences);
    
    // Auto-update daily schedules that are using default values
    if (field === "start" || field === "end") {
      const currentDefaultStart = schedulePreferences?.defaultWorkingHours?.start || "08:00";
      const currentDefaultEnd = schedulePreferences?.defaultWorkingHours?.end || "16:00";
      
      const updatedDailySchedule = { ...dailySchedule };
      
      days.forEach(day => {
        const daySchedule = dailySchedule[day] || { enabled: true, startTime: null, endTime: null };
        
        // Check if this day is currently using the default value for the field being changed
        const isUsingDefaultStart = !daySchedule.startTime || daySchedule.startTime === currentDefaultStart;
        const isUsingDefaultEnd = !daySchedule.endTime || daySchedule.endTime === currentDefaultEnd;
        
        let shouldUpdate = false;
        const updatedDaySchedule = { ...daySchedule };
        
        if (field === "start" && isUsingDefaultStart) {
          updatedDaySchedule.startTime = value;
          shouldUpdate = true;
        }
        
        if (field === "end" && isUsingDefaultEnd) {
          updatedDaySchedule.endTime = value;
          shouldUpdate = true;
        }
        
        if (shouldUpdate) {
          updatedDailySchedule[day] = updatedDaySchedule;
        }
      });
      
      setDailySchedule(updatedDailySchedule);
    }
    
    setHasUnsavedChanges(true);
  };
  
  const handleSaveAllChanges = async () => {
    if (!hasUnsavedChanges) return;
    
    setIsSaving(true);
    
    try {
      // Save schedule preferences
      await settingsService.updateSchedulePreferences(schedulePreferences);
      
      // Save daily schedule
      await settingsService.updateDailySchedule(dailySchedule);
      
      setHasUnsavedChanges(false);
      toast.success("All schedule changes saved successfully!");
      
      // Reload data to ensure consistency
      await loadData();
    } catch (err) {
      toast.error("Failed to save schedule changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateClassLevel = async (e) => {
    e.preventDefault();
    try {
      const updatedLevels = [...classLevels, { 
        Id: Math.max(...classLevels.map(c => c.Id), 0) + 1, 
        ...newClassLevel 
      }];
      await settingsService.updateClassLevels(updatedLevels);
      setClassLevels(updatedLevels);
      setNewClassLevel({ name: "", description: "" });
      setShowAddClassLevel(false);
      toast.success("Class level added successfully!");
    } catch (err) {
      toast.error("Failed to add class level");
    }
  };

  const handleEditClassLevel = async (e) => {
    e.preventDefault();
    try {
      const updatedLevels = classLevels.map(level => 
        level.Id === editingClassLevel.Id ? { ...level, ...newClassLevel } : level
      );
      await settingsService.updateClassLevels(updatedLevels);
      setClassLevels(updatedLevels);
      setEditingClassLevel(null);
      setNewClassLevel({ name: "", description: "" });
      toast.success("Class level updated successfully!");
    } catch (err) {
      toast.error("Failed to update class level");
    }
  };

  const handleDeleteClassLevel = async (levelId) => {
    if (confirm("Are you sure you want to delete this class level?")) {
      try {
        const updatedLevels = classLevels.filter(level => level.Id !== levelId);
        await settingsService.updateClassLevels(updatedLevels);
        setClassLevels(updatedLevels);
        toast.success("Class level deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete class level");
      }
    }
};

  const resetGradeLevelsToDefaults = async () => {
    if (confirm("Are you sure you want to reset all grade levels to default values? This will replace all current grade level names.")) {
      try {
        const defaultGradeLevels = [
          { Id: 1, name: "Grade 1", numberOfClasses: 2 },
          { Id: 2, name: "Grade 2", numberOfClasses: 2 },
          { Id: 3, name: "Grade 3", numberOfClasses: 2 },
          { Id: 4, name: "Grade 4", numberOfClasses: 2 },
          { Id: 5, name: "Grade 5", numberOfClasses: 2 }
        ];
        
        const updatedPreferences = {
          ...schedulePreferences,
          gradeLevels: defaultGradeLevels
        };
        
        setSchedulePreferences(updatedPreferences);
        setHasUnsavedChanges(true);
        toast.success("Grade levels reset to default values!");
      } catch (err) {
        toast.error("Failed to reset grade levels");
      }
    }
  };

  const getScheduleForSlot = (classId, dayIndex, timeSlot) => {
    return schedules.find(
      s => s.classId === classId && s.dayOfWeek === dayIndex && s.timeSlot === timeSlot
    );
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule Management</h1>
          <p className="text-gray-600">Configure daily schedules, class levels, and weekly timetables</p>
        </div>
        <Button onClick={() => setShowAddClass(true)}>
          <ApperIcon name="Plus" size={18} className="mr-2" />
          Add Class
        </Button>
      </div>

{/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("schedule")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "schedule"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <ApperIcon name="Calendar" size={20} className="inline mr-2" />
            Schedule Overview
          </button>
          <button
            onClick={() => setActiveTab("weekly")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "weekly"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <ApperIcon name="Calendar" size={20} className="inline mr-2" />
            Weekly Schedule
          </button>
          <button
            onClick={() => setActiveTab("daily")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "daily"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <ApperIcon name="Clock" size={20} className="inline mr-2" />
            Daily Schedule
          </button>
          <button
            onClick={() => setActiveTab("levels")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "levels"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <ApperIcon name="GraduationCap" size={20} className="inline mr-2" />
            Class Levels
          </button>
        </nav>
      </div>

      {/* Schedule Overview Tab */}
      {activeTab === "schedule" && (
        <div className="space-y-6">
          {/* Classes Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ApperIcon name="Users" size={24} className="text-primary-600" />
                Classes Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {classes.length === 0 ? (
                <Empty
                  title="No classes configured"
                  description="Create your first class to start building your schedule"
                  actionLabel="Add Class"
                  icon="Users"
                  onAction={() => setShowAddClass(true)}
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Class Name</th>
                        <th className="text-left py-2">Grade Level</th>
                        <th className="text-left py-2">Subjects</th>
                        <th className="text-left py-2">Weekly Periods</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classes.map(cls => {
                        const classSchedules = schedules.filter(s => s.classId === cls.Id);
                        return (
                          <tr key={cls.Id} className="border-b">
                            <td className="py-2 font-medium">{cls.name}</td>
                            <td className="py-2">{cls.gradeLevel}</td>
                            <td className="py-2">
                              <div className="flex flex-wrap gap-1">
                                {cls.subjects.map(subject => (
                                  <span
                                    key={subject}
                                    className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded"
                                  >
                                    {subject}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-2">{classSchedules.length}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
</div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Weekly Schedule Tab */}
      {activeTab === "weekly" && (
        <div className="space-y-6">
          {/* Weekly Schedule Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ApperIcon name="Calendar" size={24} className="text-primary-600" />
                Weekly Schedule Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ApperIcon name="Info" size={16} className="text-blue-600" />
                    <h4 className="font-medium text-blue-900">Direct Subject Scheduling</h4>
                  </div>
                  <p className="text-sm text-blue-700">
                    Add subjects and their teaching time slots directly to create your weekly schedule. Select the days and time periods when you want to teach each subject.
                  </p>
                </div>

                <SubjectScheduleManager
                  subjectSchedules={[]}
                  onChange={() => {}}
                  availableSubjects={subjects}
                  days={days}
                  timeSlots={getTimeSlotsForDay(0)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Schedule Grid */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ApperIcon name="Calendar" size={24} className="text-primary-600" />
                Weekly Schedule Grid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-3 text-left">Time</th>
                      {days.map(day => (
                        <th key={day} className="p-3 text-center">{day}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {getTimeSlotsForDay(0).map(timeSlot => (
                      <tr key={timeSlot} className="border-t">
                        <td className="p-3 font-medium text-sm">{timeSlot}</td>
                        {days.map((day, dayIndex) => {
                          const dayTimeSlots = getTimeSlotsForDay(dayIndex);
                          const isSlotAvailable = dayTimeSlots.includes(timeSlot);
                          
                          return (
                            <td key={day} className="p-3">
                              {isSlotAvailable ? (
                                <Select
                                  value=""
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      toast.success(`${e.target.value} scheduled for ${day} at ${timeSlot}`);
                                    }
                                  }}
                                  className="w-full text-sm"
                                >
                                  <option value="">-</option>
                                  {subjects.map(subject => (
                                    <option key={subject} value={subject}>
                                      {subject}
                                    </option>
                                  ))}
                                </Select>
                              ) : (
                                <div className="bg-gray-100 p-2 text-xs text-gray-500 rounded text-center">
                                  Not Available
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Daily Schedule Configuration Tab */}
      {activeTab === "daily" && (
        <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ApperIcon name="Clock" size={24} className="text-primary-600" />
                Daily Schedule Configuration
              </CardTitle>
              {hasUnsavedChanges && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-amber-600 flex items-center gap-1">
                    <ApperIcon name="AlertCircle" size={16} />
                    Unsaved changes
                  </span>
                  <Button
                    onClick={handleSaveAllChanges}
                    disabled={isSaving}
                    className="flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <ApperIcon name="Loader" size={16} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Save" size={16} />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Default Working Hours Configuration */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                  <ApperIcon name="Settings" size={20} />
                  Default Working Hours Configuration
                </h4>
                <div className="text-sm text-blue-700 mb-4">
                  <p>
                    Set the default working hours and class duration that will be used for all days unless individually overridden below.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField label="Default Start Time">
                    <Input
                      type="time"
                      value={schedulePreferences?.defaultWorkingHours?.start || "08:00"}
                      onChange={(e) => handleDefaultWorkingHoursChange("start", e.target.value)}
                      className="bg-white"
                    />
                  </FormField>
                  <FormField label="Default End Time">
                    <Input
                      type="time"
                      value={schedulePreferences?.defaultWorkingHours?.end || "16:00"}
                      onChange={(e) => handleDefaultWorkingHoursChange("end", e.target.value)}
                      className="bg-white"
                    />
                  </FormField>
                  <FormField label="Class Period Duration (minutes)">
                    <Select
                      value={schedulePreferences?.classPeriodMinutes || 45}
                      onChange={(e) => handleDefaultWorkingHoursChange("classPeriodMinutes", parseInt(e.target.value))}
                      className="bg-white"
                    >
                      <option value={30}>30 minutes</option>
                      <option value={45}>45 minutes</option>
                      <option value={60}>60 minutes</option>
                    </Select>
                  </FormField>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h4 className="font-semibold text-gray-900 mb-2">Daily Schedule Overrides</h4>
                <p className="text-gray-600 mb-4">
                  Configure specific working hours for individual days. Leave empty to use the default hours above.
                </p>
              </div>
              
{days.map(day => {
                const daySchedule = dailySchedule[day] || { enabled: true, startTime: null, endTime: null };
                const defaultStart = schedulePreferences?.defaultWorkingHours?.start || "08:00";
                const defaultEnd = schedulePreferences?.defaultWorkingHours?.end || "16:00";
                // Check if this day is using default values
                const isUsingDefaultStart = !daySchedule.startTime || daySchedule.startTime === defaultStart;
                const isUsingDefaultEnd = !daySchedule.endTime || daySchedule.endTime === defaultEnd;
                const effectiveStartTime = daySchedule.startTime || defaultStart;
                const effectiveEndTime = daySchedule.endTime || defaultEnd;
                
                return (
                  <div key={day} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{day}</h3>
                        {(isUsingDefaultStart && isUsingDefaultEnd) && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            Using Default Hours
                          </span>
                        )}
                        {(!isUsingDefaultStart || !isUsingDefaultEnd) && (
                          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">
                            Custom Schedule
                          </span>
                        )}
                      </div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={daySchedule.enabled}
                          onChange={(e) => handleDailyScheduleChange(day, "enabled", e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm">Active</span>
                      </label>
                    </div>
                    
                    {daySchedule.enabled && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label={
                          <div className="flex items-center gap-2">
                            <span>Start Time</span>
                            {isUsingDefaultStart && (
                              <span className="text-xs text-blue-600">(Default: {defaultStart})</span>
                            )}
                          </div>
}>
                          <Input
                            type="time"
                            value={effectiveStartTime}
                            onChange={(e) => handleDailyScheduleChange(day, "startTime", e.target.value)}
                            placeholder={defaultStart}
                          />
                        </FormField>
                        <FormField label={
                          <div className="flex items-center gap-2">
                            <span>End Time</span>
                            {isUsingDefaultEnd && (
                              <span className="text-xs text-blue-600">(Default: {defaultEnd})</span>
                            )}
                          </div>
}>
                          <Input
                            type="time"
                            value={effectiveEndTime}
                            onChange={(e) => handleDailyScheduleChange(day, "endTime", e.target.value)}
                            placeholder={defaultEnd}
                          />
                        </FormField>
                      </div>
                    )}
                    
                    {!daySchedule.enabled && (
                      <div className="text-gray-500 text-sm">
                        This day is disabled for classes
                      </div>
                    )}
                  </div>
                );
})}
              
              {hasUnsavedChanges && (
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ApperIcon name="AlertCircle" size={20} className="text-amber-600" />
                      <div>
                        <p className="font-medium text-amber-800">You have unsaved changes</p>
                        <p className="text-sm text-amber-600">
                          Click "Save Changes" to apply your schedule modifications
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={handleSaveAllChanges}
                      disabled={isSaving}
                      className="flex items-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <ApperIcon name="Loader" size={16} className="animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <ApperIcon name="Save" size={16} />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Class Levels Management Tab */}
{/* Class Levels Management Tab */}
      {activeTab === "levels" && (
        <div className="space-y-6">
{/* Grade Level Configuration */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ApperIcon name="Settings" size={24} className="text-primary-600" />
                  Grade Level Configuration
                </CardTitle>
                {schedulePreferences?.gradeLevels && schedulePreferences.gradeLevels.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={resetGradeLevelsToDefaults}
                    className="flex items-center gap-2"
                  >
                    <ApperIcon name="RotateCcw" size={16} />
                    Reset to Defaults
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <p className="text-gray-600 mb-4">
                    Configure the grade levels for your school. These will be used when creating classes and organizing your academic structure. You can customize the names to match your school's naming convention.
                  </p>
                  
                  {schedulePreferences?.gradeLevels && schedulePreferences.gradeLevels.length > 0 ? (
                    <div className="space-y-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <ApperIcon name="Info" size={16} className="text-blue-600" />
                          <h4 className="font-medium text-blue-900">Customizable Grade Level Names</h4>
                        </div>
                        <p className="text-sm text-blue-700">
                          You can customize these grade level names to match your school's convention (e.g., "Tahun 1", "Kindergarten", "Form 1", etc.). Changes will be reflected throughout the application.
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {schedulePreferences.gradeLevels.map((level, index) => (
                          <div key={level.Id} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="flex items-center justify-center w-8 h-8 bg-primary-100 rounded-full">
                                <span className="text-sm font-semibold text-primary-700">{index + 1}</span>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">Level {index + 1}</h4>
                                <p className="text-xs text-gray-500">{level.numberOfClasses} classes</p>
                              </div>
                            </div>
                            
                            <FormField label="Grade Level Name">
                              <Input
                                value={level.name}
                                onChange={(e) => {
                                  const updatedLevels = schedulePreferences.gradeLevels.map(l => 
                                    l.Id === level.Id ? { ...l, name: e.target.value } : l
                                  );
                                  setSchedulePreferences(prev => ({
                                    ...prev,
                                    gradeLevels: updatedLevels
                                  }));
                                  setHasUnsavedChanges(true);
                                }}
                                placeholder={`e.g., Tahun ${index + 1}, Grade ${index + 1}`}
                                required
                                className="font-medium"
                              />
                              <div className="text-xs text-gray-500 mt-1">
                                This name will appear in schedules and class creation
                              </div>
                            </FormField>
                          </div>
                        ))}
                      </div>
                      
                      {hasUnsavedChanges && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                          <div className="flex items-center gap-2">
                            <ApperIcon name="AlertCircle" size={16} className="text-amber-600" />
                            <p className="text-sm text-amber-800 font-medium">
                              You have unsaved changes to grade level names. Save your changes to apply them throughout the application.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Empty
                      title="No grade levels configured"
                      description="Grade levels will be automatically generated when you configure your schedule preferences"
                      icon="GraduationCap"
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Class Levels Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ApperIcon name="GraduationCap" size={24} className="text-primary-600" />
                  Class Level Management
                </CardTitle>
                <Button onClick={() => setShowAddClassLevel(true)}>
                  <ApperIcon name="Plus" size={18} className="mr-2" />
                  Add Class Level
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Manage the available class levels for your school. These levels will appear when creating classes and schedules.
                </p>
                
                {classLevels.length === 0 ? (
                  <Empty
                    title="No class levels configured"
                    description="Add class levels to organize your school structure"
                    actionLabel="Add Class Level"
                    icon="GraduationCap"
                    onAction={() => setShowAddClassLevel(true)}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {classLevels.map(level => (
                      <div key={level.Id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{level.name}</h3>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingClassLevel(level);
                                setNewClassLevel({ name: level.name, description: level.description });
                              }}
                            >
                              <ApperIcon name="Edit" size={16} />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteClassLevel(level.Id)}
                            >
                              <ApperIcon name="Trash" size={16} />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{level.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
</Card>
        </div>
      )}

      {/* Add Class Modal */}
      {showAddClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add New Class</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateClass} className="space-y-4">
                <FormField label="Class Name">
                  <Input
                    value={newClass.name}
                    onChange={(e) => setNewClass({...newClass, name: e.target.value})}
                    placeholder="e.g., 4A"
                    required
                  />
                </FormField>
<FormField label="Grade Level">
                  <Select
                    value={newClass.gradeLevel}
                    onChange={(e) => setNewClass({...newClass, gradeLevel: e.target.value})}
                    required
                  >
                    <option value="">Select Grade</option>
                    {classLevels.map(level => (
                      <option key={level.Id} value={level.name}>{level.name}</option>
                    ))}
                  </Select>
                </FormField>
                <FormField label="Subject Registration">
                  <SubjectScheduleManager
                    subjectSchedules={newClass.subjectSchedules}
                    onChange={(schedules) => setNewClass({...newClass, subjectSchedules: schedules})}
                    availableSubjects={subjects}
                    days={days}
                    timeSlots={getTimeSlotsForDay(0)}
                  />
                </FormField>
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1">
                    Create Class
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowAddClass(false);
                      setNewClass({ name: "", gradeLevel: "", subjectSchedules: [] });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add/Edit Class Level Modal */}
      {(showAddClassLevel || editingClassLevel) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{editingClassLevel ? "Edit Class Level" : "Add New Class Level"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={editingClassLevel ? handleEditClassLevel : handleCreateClassLevel} className="space-y-4">
                <FormField label="Level Name">
                  <Input
                    value={newClassLevel.name}
                    onChange={(e) => setNewClassLevel({...newClassLevel, name: e.target.value})}
                    placeholder="e.g., Grade 4, Form 1"
                    required
                  />
                </FormField>
                <FormField label="Description">
                  <Input
                    value={newClassLevel.description}
                    onChange={(e) => setNewClassLevel({...newClassLevel, description: e.target.value})}
                    placeholder="Brief description of this level"
                  />
                </FormField>
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingClassLevel ? "Update Level" : "Add Level"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowAddClassLevel(false);
                      setEditingClassLevel(null);
                      setNewClassLevel({ name: "", description: "" });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Schedule;