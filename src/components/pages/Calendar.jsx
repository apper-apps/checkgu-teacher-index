import React, { useEffect, useState } from "react";
import { eachDayOfInterval, endOfMonth, format, getDay, isSameMonth, isToday, startOfMonth } from "date-fns";
import { toast } from "react-toastify";
import Papa from "papaparse";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
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
  const [holidays, setHolidays] = useState([]);
  const [holidayViewMode, setHolidayViewMode] = useState("card");
  const [selectedHolidays, setSelectedHolidays] = useState([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState(null);
  const [csvData, setCsvData] = useState("");
  const [importLoading, setImportLoading] = useState(false);

useEffect(() => {
    loadAcademicCalendar();
    loadHolidays();
  }, []);

  const loadAcademicCalendar = async () => {
    try {
      const calendar = await settingsService.getAcademicCalendar();
      setAcademicCalendar(calendar);
    } catch (error) {
      console.error('Failed to load academic calendar:', error);
    }
  };

  const loadHolidays = async () => {
    try {
      const holidaysData = await settingsService.getHolidays();
      setHolidays(holidaysData);
    } catch (error) {
      console.error('Failed to load holidays:', error);
      toast.error('Failed to load holidays');
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

  const handleAddHoliday = async (holidayData) => {
    try {
      const newHoliday = await settingsService.addHoliday(holidayData);
      setHolidays(prev => [...prev, newHoliday]);
      toast.success('Holiday added successfully');
    } catch (error) {
      toast.error('Failed to add holiday');
    }
  };

  const handleUpdateHoliday = async (id, holidayData) => {
    try {
      const updatedHoliday = await settingsService.updateHoliday(id, holidayData);
      setHolidays(prev => prev.map(h => h.Id === id ? updatedHoliday : h));
      toast.success('Holiday updated successfully');
    } catch (error) {
      toast.error('Failed to update holiday');
    }
  };

  const handleDeleteHoliday = async (id) => {
    if (!confirm('Are you sure you want to delete this holiday?')) return;
    
    try {
      await settingsService.deleteHoliday(id);
      setHolidays(prev => prev.filter(h => h.Id !== id));
      toast.success('Holiday deleted successfully');
    } catch (error) {
      toast.error('Failed to delete holiday');
    }
  };

  const handleImportCSV = async () => {
    if (!csvData.trim()) {
      toast.error('Please enter CSV data');
      return;
    }

    setImportLoading(true);
    try {
      const result = await settingsService.processCSV(csvData);
      if (result.success) {
        setHolidays(prev => [...prev, ...result.holidays]);
        toast.success(`${result.holidays.length} holidays imported successfully`);
        setCsvData("");
        setShowImportModal(false);
      } else {
        toast.error(result.error || 'Failed to import CSV');
      }
    } catch (error) {
      toast.error('Failed to import CSV');
    } finally {
      setImportLoading(false);
    }
  };

  const handleToggleSchoolHoliday = async (id) => {
    try {
      const updatedHoliday = await settingsService.toggleSchoolHoliday(id);
      setHolidays(prev => prev.map(h => h.Id === id ? updatedHoliday : h));
      toast.success('Holiday updated successfully');
    } catch (error) {
      toast.error('Failed to update holiday');
    }
  };

  const handleBulkToggleSchool = async () => {
    if (selectedHolidays.length === 0) {
      toast.error('Please select holidays to update');
      return;
    }

    try {
      const updatedHolidays = await settingsService.toggleSchoolHolidays(selectedHolidays);
      setHolidays(prev => prev.map(h => {
        const updated = updatedHolidays.find(uh => uh.Id === h.Id);
        return updated || h;
      }));
      setSelectedHolidays([]);
      toast.success(`${selectedHolidays.length} holidays updated successfully`);
    } catch (error) {
      toast.error('Failed to update holidays');
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
    const dateString = format(date, "yyyy-MM-dd");
    
    // Check holidays
    const holiday = holidays.find(h => h.date === dateString);
    if (holiday) {
      return { isHoliday: true, name: holiday.name, holiday };
    }
    
    // Check custom school breaks
    if (academicCalendar?.breaks) {
      for (const breakItem of academicCalendar.breaks) {
        const breakStart = new Date(breakItem.startDate);
        const breakEnd = new Date(breakItem.endDate);
        const currentDate = new Date(dateString);
        
        if (currentDate >= breakStart && currentDate <= breakEnd) {
          return { isHoliday: true, name: breakItem.name };
        }
      }
    }
    
    return { isHoliday: false, name: null };
  };

  const handleHolidayClick = (holiday) => {
    setEditingHoliday(holiday);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (formData) => {
    try {
      if (editingHoliday) {
        await handleUpdateHoliday(editingHoliday.Id, formData);
      } else {
        await handleAddHoliday(formData);
      }
      setShowEditModal(false);
      setEditingHoliday(null);
    } catch (error) {
      // Error handling in individual functions
    }
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
          const holidayInfo = isHoliday(date);

          return (
            <div
              key={date.toISOString()}
              className={`min-h-[100px] p-2 border border-gray-200 ${
                isCurrentMonth ? "bg-white" : "bg-gray-50"
              } ${isTodayDate ? "bg-primary-50 border-primary-200" : ""} ${
                holidayInfo.isHoliday ? "bg-red-50 border-red-200" : ""
              } hover:bg-gray-50 cursor-pointer transition-colors`}
              onClick={() => holidayInfo.holiday && handleHolidayClick(holidayInfo.holiday)}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-sm ${
                  isTodayDate ? "font-bold text-primary-600" : 
                  isCurrentMonth ? "text-gray-900" : "text-gray-400"
                }`}>
                  {format(date, "d")}
                </span>
                {holidayInfo.isHoliday && (
                  <Badge 
                    variant={holidayInfo.holiday?.isSchoolHoliday ? "secondary" : "error"} 
                    className="text-xs"
                  >
                    {holidayInfo.name}
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

  const renderHolidayCard = (holiday) => (
    <div
      key={holiday.Id}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => handleHolidayClick(holiday)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-900">{holiday.name}</h3>
        <div className="flex items-center gap-2">
          {holiday.isSchoolHoliday && (
            <Badge variant="secondary" className="text-xs">School Holiday</Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteHoliday(holiday.Id);
            }}
          >
            <ApperIcon name="Trash2" size={16} />
          </Button>
        </div>
      </div>
      <p className="text-sm text-gray-600">{format(new Date(holiday.date), "PPP")}</p>
      {holiday.description && (
        <p className="text-sm text-gray-500 mt-1">{holiday.description}</p>
      )}
    </div>
  );

  const renderHolidayList = () => (
    <div className="space-y-2">
      {holidays.map(holiday => (
        <div
          key={holiday.Id}
          className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedHolidays.includes(holiday.Id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedHolidays(prev => [...prev, holiday.Id]);
                } else {
                  setSelectedHolidays(prev => prev.filter(id => id !== holiday.Id));
                }
              }}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <div>
              <h3 className="font-medium text-gray-900">{holiday.name}</h3>
              <p className="text-sm text-gray-600">{format(new Date(holiday.date), "PPP")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={holiday.isSchoolHoliday ? "secondary" : "outline"}
              size="sm"
              onClick={() => handleToggleSchoolHoliday(holiday.Id)}
            >
              {holiday.isSchoolHoliday ? "School Holiday" : "Mark as School"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleHolidayClick(holiday)}
            >
              <ApperIcon name="Edit" size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteHoliday(holiday.Id)}
            >
              <ApperIcon name="Trash2" size={16} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCalendarData} />;

return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="text-sm sm:text-base text-gray-600">View your teaching schedule and lesson plans</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant={viewMode === "month" ? "primary" : "outline"}
            size="sm"
            onClick={() => setViewMode("month")}
            className="flex-1 sm:flex-none"
          >
            Month
          </Button>
          <Button
            variant={viewMode === "week" ? "primary" : "outline"}
            size="sm"
            onClick={() => setViewMode("week")}
            className="flex-1 sm:flex-none"
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

{/* Holiday Management */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="Calendar" size={20} sm:size={24} className="text-primary-600" />
              Holiday Management
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowImportModal(true)}
              >
                <ApperIcon name="Upload" size={16} />
                Import CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingHoliday(null);
                  setShowEditModal(true);
                }}
              >
                <ApperIcon name="Plus" size={16} />
                Add Holiday
              </Button>
              <Button
                variant={holidayViewMode === "card" ? "primary" : "outline"}
                size="sm"
                onClick={() => setHolidayViewMode("card")}
              >
                <ApperIcon name="Grid" size={16} />
              </Button>
              <Button
                variant={holidayViewMode === "list" ? "primary" : "outline"}
                size="sm"
                onClick={() => setHolidayViewMode("list")}
              >
                <ApperIcon name="List" size={16} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {holidayViewMode === "list" && selectedHolidays.length > 0 && (
            <div className="mb-4 p-3 bg-primary-50 border border-primary-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary-800">
                  {selectedHolidays.length} holidays selected
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleBulkToggleSchool}
                  >
                    Toggle School Holiday
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedHolidays([])}
                  >
                    Clear Selection
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {holidays.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ApperIcon name="Calendar" size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No holidays found. Add holidays or import from CSV.</p>
            </div>
          ) : (
<div className={holidayViewMode === "card" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : ""}>
              {holidayViewMode === "card" 
                ? holidays.map(renderHolidayCard)
                : renderHolidayList()
              }
            </div>
          )}
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
              <div className="w-4 h-4 bg-secondary-100 rounded"></div>
              <span className="text-sm">School Holidays</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary-50 border border-primary-200 rounded"></div>
              <span className="text-sm">Today</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Import Holidays from CSV</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowImportModal(false)}
              >
                <ApperIcon name="X" size={16} />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CSV Format: name,date,description,isSchoolHoliday
                </label>
                <Textarea
                  placeholder="New Year,2024-01-01,New Year's Day,true&#10;Christmas,2024-12-25,Christmas Day,true"
                  value={csvData}
                  onChange={(e) => setCsvData(e.target.value)}
                  rows={8}
                  className="w-full"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowImportModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleImportCSV}
                  disabled={importLoading}
                >
                  {importLoading ? "Importing..." : "Import"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingHoliday ? "Edit Holiday" : "Add Holiday"}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEditModal(false)}
              >
                <ApperIcon name="X" size={16} />
              </Button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleSaveEdit({
                name: formData.get('name'),
                date: formData.get('date'),
                description: formData.get('description'),
                isSchoolHoliday: formData.get('isSchoolHoliday') === 'on'
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Holiday Name
                  </label>
                  <Input
                    name="name"
                    defaultValue={editingHoliday?.name || ''}
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <Input
                    name="date"
                    type="date"
                    defaultValue={editingHoliday?.date || ''}
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <Textarea
                    name="description"
                    defaultValue={editingHoliday?.description || ''}
                    rows={3}
                    className="w-full"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isSchoolHoliday"
                    id="isSchoolHoliday"
                    defaultChecked={editingHoliday?.isSchoolHoliday || false}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="isSchoolHoliday" className="text-sm font-medium text-gray-700">
                    School Holiday
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  {editingHoliday ? "Update" : "Add"} Holiday
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;