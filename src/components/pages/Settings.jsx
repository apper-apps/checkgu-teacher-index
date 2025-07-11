import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Textarea from "@/components/atoms/Textarea";
import Input from "@/components/atoms/Input";
import Calendar from "@/components/pages/Calendar";
import Schedule from "@/components/pages/Schedule";
import FormField from "@/components/molecules/FormField";
import { settingsService } from "@/services/api/settingsService";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [userProfile, setUserProfile] = useState({
    name: "Ms. Johnson",
    email: "sarah.johnson@greenwood.edu",
    phone: "+1 (555) 123-4567",
    role: "Teacher",
    department: "Elementary"
  });

  const [notificationPreferences, setNotificationPreferences] = useState({
    classReminders: true,
    processingComplete: true,
    systemUpdates: false
  });

const [schoolProfile, setSchoolProfile] = useState({
    name: "Greenwood Elementary School",
    type: "Public Elementary",
    address: "123 Education Lane, Springfield, ST 12345",
    phone: "+1 (555) 987-6543",
    email: "info@greenwood.edu",
    website: "www.greenwood.edu",
    logo: null,
    logoPreview: null
  });

const [academicCalendar, setAcademicCalendar] = useState({
    termStart: "2025-02-17",
    termEnd: "2025-06-30",
    winterBreakStart: "2025-04-01",
    winterBreakEnd: "2025-04-15",
    springTermStart: "2025-04-16",
    springTermEnd: "2025-06-30",
    weekStartsOnSunday: false,
breaks: [
      { Id: 1, name: "Winter Break", startDate: "2025-04-01", endDate: "2025-04-15" },
      { Id: 2, name: "Spring Break", startDate: "2025-03-15", endDate: "2025-03-22" }
    ]
  });

  const [newBreak, setNewBreak] = useState({
    name: "",
    startDate: "",
    endDate: ""
  });

  const [editingBreak, setEditingBreak] = useState(null);

const [schedulePreferences, setSchedulePreferences] = useState({
    numberOfLevels: 5,
    numberOfClasses: 2,
    defaultLessonDuration: 30,
    defaultWorkingHours: {
      start: "08:00",
      end: "16:00"
    },
    gradeLevels: [
      { Id: 1, name: "Grade 1", numberOfClasses: 2 },
      { Id: 2, name: "Grade 2", numberOfClasses: 2 },
      { Id: 3, name: "Grade 3", numberOfClasses: 2 },
      { Id: 4, name: "Grade 4", numberOfClasses: 2 },
      { Id: 5, name: "Grade 5", numberOfClasses: 2 }
    ]
  });

  const [calendarSync, setCalendarSync] = useState({
    googleCalendarId: "",
    appleCalendarId: "",
    syncEnabled: false,
    lastSyncDate: null
  });

const tabs = [
    { id: "profile", label: "User Profile", icon: "User" },
    { id: "school", label: "School Profile", icon: "Building" },
    { id: "calendar", label: "Academic Calendar", icon: "Calendar" },
    { id: "schedule", label: "Schedule", icon: "Clock" },
    { id: "sync", label: "Calendar Sync", icon: "RefreshCw" },
    { id: "notifications", label: "Notifications", icon: "Bell" },
    { id: "export", label: "Export & Import", icon: "Download" }
  ];

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      // In a real app, this would save to a service
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };
const handleSaveSchool = async (e) => {
    e.preventDefault();
    try {
      await settingsService.updateSchoolProfile(schoolProfile);
      toast.success("School profile updated successfully!");
    } catch (err) {
      toast.error("Failed to update school profile");
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Logo file size must be less than 5MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const logoUrl = event.target.result;
        setSchoolProfile(prev => ({
          ...prev,
          logo: file,
          logoPreview: logoUrl
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setSchoolProfile(prev => ({
      ...prev,
      logo: null,
      logoPreview: null
    }));
  };

const handleSaveCalendar = async (e) => {
    e.preventDefault();
    try {
      await settingsService.updateAcademicCalendar(academicCalendar);
      toast.success("Academic calendar updated successfully!");
    } catch (err) {
      toast.error("Failed to update academic calendar");
    }
  };

const handleAddBreak = () => {
    if (!newBreak.name || !newBreak.startDate || !newBreak.endDate) {
      toast.error("Please fill in all break details");
      return;
    }
    
    if (new Date(newBreak.startDate) > new Date(newBreak.endDate)) {
      toast.error("Start date must be before end date");
      return;
    }

    // Check for overlapping breaks
    const startDate = new Date(newBreak.startDate);
    const endDate = new Date(newBreak.endDate);
    const hasOverlap = academicCalendar.breaks.some(existingBreak => {
      const existingStart = new Date(existingBreak.startDate);
      const existingEnd = new Date(existingBreak.endDate);
      return (startDate <= existingEnd && endDate >= existingStart);
    });

    if (hasOverlap) {
      toast.error("Break dates overlap with an existing break");
      return;
    }

const breakWithId = {
      ...newBreak,
      Id: Math.max(...academicCalendar.breaks.map(b => b.Id), 0) + 1
    };

    setAcademicCalendar(prev => ({
      ...prev,
      breaks: [...prev.breaks, breakWithId]
    }));

    setNewBreak({ name: "", startDate: "", endDate: "" });
    toast.success("Break added successfully!");
  };

  const handleEditBreak = (breakItem) => {
    setEditingBreak(breakItem);
    setNewBreak({
      name: breakItem.name,
      startDate: breakItem.startDate,
      endDate: breakItem.endDate
    });
  };

  const handleUpdateBreak = () => {
    if (!newBreak.name || !newBreak.startDate || !newBreak.endDate) {
      toast.error("Please fill in all break details");
      return;
    }
    
    if (new Date(newBreak.startDate) > new Date(newBreak.endDate)) {
      toast.error("Start date must be before end date");
      return;
    }

    // Check for overlapping breaks (excluding the one being edited)
    const startDate = new Date(newBreak.startDate);
    const endDate = new Date(newBreak.endDate);
const hasOverlap = academicCalendar.breaks.some(existingBreak => {
      if (existingBreak.Id === editingBreak.Id) return false; // Skip the break being edited
      const existingStart = new Date(existingBreak.startDate);
      const existingEnd = new Date(existingBreak.endDate);
      return (startDate <= existingEnd && endDate >= existingStart);
    });

    if (hasOverlap) {
      toast.error("Break dates overlap with an existing break");
      return;
    }

    setAcademicCalendar(prev => ({
      ...prev,
breaks: prev.breaks.map(b => 
        b.Id === editingBreak.Id
          ? { ...b, ...newBreak }
          : b
      )
    }));

    setEditingBreak(null);
    setNewBreak({ name: "", startDate: "", endDate: "" });
    toast.success("Break updated successfully!");
  };

const handleDeleteBreak = (breakId) => {
    if (confirm("Are you sure you want to delete this break?")) {
      setAcademicCalendar(prev => ({
        ...prev,
        breaks: prev.breaks.filter(b => b.Id !== breakId)
      }));
      toast.success("Break deleted successfully!");
    }
  };

  const handleCancelEdit = () => {
    setEditingBreak(null);
    setNewBreak({ name: "", startDate: "", endDate: "" });
  };

const handleSaveSchedule = async (e) => {
    e.preventDefault();
    
    // Validate that all grade levels have names
    const missingNames = schedulePreferences.gradeLevels.some(level => !level.name.trim());
    if (missingNames) {
      toast.error("Please provide names for all grade levels");
      return;
    }
    
    try {
      await settingsService.updateSchedulePreferences(schedulePreferences);
      toast.success("Schedule preferences updated successfully!");
    } catch (err) {
      toast.error("Failed to update schedule preferences");
    }
  };

  const handleNumberOfLevelsChange = (newCount) => {
    const currentLevels = schedulePreferences.gradeLevels;
    let updatedLevels = [...currentLevels];
    
    if (newCount > currentLevels.length) {
      // Add new grade levels
      for (let i = currentLevels.length; i < newCount; i++) {
        updatedLevels.push({
          Id: i + 1,
          name: `Grade ${i + 1}`,
          numberOfClasses: schedulePreferences.numberOfClasses
        });
      }
    } else if (newCount < currentLevels.length) {
      // Remove excess grade levels
      updatedLevels = updatedLevels.slice(0, newCount);
    }
    
    setSchedulePreferences({
      ...schedulePreferences,
      numberOfLevels: newCount,
      gradeLevels: updatedLevels
    });
  };

  const handleGradeLevelChange = (levelId, field, value) => {
    setSchedulePreferences(prev => ({
      ...prev,
      gradeLevels: prev.gradeLevels.map(level => 
        level.Id === levelId 
          ? { ...level, [field]: field === 'numberOfClasses' ? parseInt(value) : value }
          : level
      )
    }));
  };

  const handleSaveSync = async (e) => {
    e.preventDefault();
    try {
      toast.success("Calendar sync settings updated successfully!");
    } catch (err) {
      toast.error("Failed to update calendar sync settings");
    }
  };

  const handleSyncNow = async () => {
    try {
      toast.info("Syncing calendars...");
      // Mock sync process
      setTimeout(() => {
        setCalendarSync(prev => ({
          ...prev,
          lastSyncDate: new Date().toISOString()
        }));
        toast.success("Calendars synced successfully!");
      }, 2000);
    } catch (err) {
      toast.error("Failed to sync calendars");
    }
};

  const handleSaveNotifications = async (e) => {
    e.preventDefault();
    try {
      await settingsService.updateNotificationPreferences(notificationPreferences);
      toast.success("Notification preferences updated successfully!");
    } catch (err) {
      toast.error("Failed to update notification preferences");
    }
  };

  const handleExportAllData = async () => {
    try {
      toast.info("Preparing data export...");
      // Mock export process
      setTimeout(() => {
        const dataBlob = new Blob([JSON.stringify({
          students: [],
          lessonPlans: [],
          schedules: [],
          settings: { userProfile, schoolProfile, academicCalendar, schedulePreferences }
        }, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'checkgu-all-data.json';
        link.click();
        URL.revokeObjectURL(url);
        toast.success("All data exported successfully!");
      }, 1000);
    } catch (err) {
      toast.error("Failed to export data");
    }
  };

  const handleExportTimetable = async () => {
    try {
      toast.info("Exporting timetable...");
      setTimeout(() => {
        const csvContent = "Subject,Class,Day,Time,Duration\nMath,Grade 1A,Monday,09:00,30\nEnglish,Grade 1A,Monday,10:00,45";
        const dataBlob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'timetable.csv';
        link.click();
        URL.revokeObjectURL(url);
        toast.success("Timetable exported successfully!");
      }, 800);
    } catch (err) {
      toast.error("Failed to export timetable");
    }
  };

  const handleImportData = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      toast.info("Importing data...");
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          // Mock import process
          setTimeout(() => {
            toast.success("Data imported successfully!");
          }, 1000);
        } catch (parseErr) {
          toast.error("Invalid file format");
        }
      };
      reader.readAsText(file);
    } catch (err) {
      toast.error("Failed to import data");
    }
  };

  const handleResetAllData = async () => {
    if (confirm("Are you sure you want to reset all data? This action cannot be undone.")) {
      try {
        toast.info("Resetting all data...");
        setTimeout(() => {
          // Reset to default values
          setUserProfile({
            name: "Ms. Johnson",
            email: "sarah.johnson@greenwood.edu",
            phone: "+1 (555) 123-4567",
            role: "Teacher",
            department: "Elementary"
          });
          setNotificationPreferences({
            classReminders: true,
            processingComplete: true,
            systemUpdates: false
          });
          toast.success("All data has been reset successfully!");
        }, 1500);
      } catch (err) {
        toast.error("Failed to reset data");
      }
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Full Name">
                <Input
                  value={userProfile.name}
                  onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                  required
                />
              </FormField>
              <FormField label="Email Address">
                <Input
                  type="email"
                  value={userProfile.email}
                  onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                  required
                />
              </FormField>
              <FormField label="Phone Number">
                <Input
                  value={userProfile.phone}
                  onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                />
              </FormField>
              <FormField label="Role">
                <Select
                  value={userProfile.role}
                  onChange={(e) => setUserProfile({...userProfile, role: e.target.value})}
                >
                  <option value="Teacher">Teacher</option>
                  <option value="Head Teacher">Head Teacher</option>
                  <option value="Assistant Teacher">Assistant Teacher</option>
                  <option value="Substitute Teacher">Substitute Teacher</option>
                </Select>
              </FormField>
              <FormField label="Department">
                <Select
                  value={userProfile.department}
                  onChange={(e) => setUserProfile({...userProfile, department: e.target.value})}
                >
                  <option value="Elementary">Elementary</option>
                  <option value="Middle School">Middle School</option>
                  <option value="High School">High School</option>
                  <option value="Special Education">Special Education</option>
                </Select>
              </FormField>
            </div>
            <Button type="submit">
              <ApperIcon name="Save" size={16} className="mr-2" />
              Save Profile
            </Button>
          </form>
        );

case "school":
        return (
          <form onSubmit={handleSaveSchool} className="space-y-4">
            <FormField label="School Logo">
              <div className="space-y-3">
                {schoolProfile.logoPreview && (
                  <div className="flex items-center gap-4">
                    <img
                      src={schoolProfile.logoPreview}
                      alt="School Logo Preview"
                      className="w-16 h-16 object-contain rounded-lg border border-gray-200"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveLogo}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <ApperIcon name="Trash2" size={16} className="mr-2" />
                      Remove Logo
                    </Button>
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <ApperIcon name="Upload" size={16} />
                    Choose Logo
                  </label>
                  <span className="text-sm text-gray-500">
                    PNG, JPG up to 5MB
                  </span>
                </div>
              </div>
            </FormField>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="School Name">
                <Input
                  value={schoolProfile.name}
                  onChange={(e) => setSchoolProfile({...schoolProfile, name: e.target.value})}
                  required
                />
              </FormField>
              <FormField label="School Type">
                <Select
                  value={schoolProfile.type}
                  onChange={(e) => setSchoolProfile({...schoolProfile, type: e.target.value})}
                >
                  <option value="Public Elementary">Public Elementary</option>
                  <option value="Private Elementary">Private Elementary</option>
                  <option value="Public Middle School">Public Middle School</option>
                  <option value="Private Middle School">Private Middle School</option>
                  <option value="Public High School">Public High School</option>
                  <option value="Private High School">Private High School</option>
                </Select>
              </FormField>
              <FormField label="Phone Number">
                <Input
                  value={schoolProfile.phone}
                  onChange={(e) => setSchoolProfile({...schoolProfile, phone: e.target.value})}
                />
              </FormField>
              <FormField label="Email Address">
                <Input
                  type="email"
                  value={schoolProfile.email}
                  onChange={(e) => setSchoolProfile({...schoolProfile, email: e.target.value})}
                />
              </FormField>
              <FormField label="Website">
                <Input
                  value={schoolProfile.website}
                  onChange={(e) => setSchoolProfile({...schoolProfile, website: e.target.value})}
                />
              </FormField>
            </div>
            <FormField label="Address">
              <Textarea
                value={schoolProfile.address}
                onChange={(e) => setSchoolProfile({...schoolProfile, address: e.target.value})}
                rows={3}
              />
            </FormField>
            <Button type="submit">
              <ApperIcon name="Save" size={16} className="mr-2" />
              Save School Profile
            </Button>
          </form>
        );

case "calendar":
        return (
          <form onSubmit={handleSaveCalendar} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Academic Terms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Term Start Date">
                  <Input
                    type="date"
                    value={academicCalendar.termStart}
                    onChange={(e) => setAcademicCalendar({...academicCalendar, termStart: e.target.value})}
                  />
                </FormField>
                <FormField label="Term End Date">
                  <Input
                    type="date"
                    value={academicCalendar.termEnd}
                    onChange={(e) => setAcademicCalendar({...academicCalendar, termEnd: e.target.value})}
                  />
                </FormField>
                <FormField label="Winter Break Start">
                  <Input
                    type="date"
                    value={academicCalendar.winterBreakStart}
                    onChange={(e) => setAcademicCalendar({...academicCalendar, winterBreakStart: e.target.value})}
                  />
                </FormField>
                <FormField label="Winter Break End">
                  <Input
                    type="date"
                    value={academicCalendar.winterBreakEnd}
                    onChange={(e) => setAcademicCalendar({...academicCalendar, winterBreakEnd: e.target.value})}
                  />
                </FormField>
                <FormField label="Spring Term Start">
                  <Input
                    type="date"
                    value={academicCalendar.springTermStart}
                    onChange={(e) => setAcademicCalendar({...academicCalendar, springTermStart: e.target.value})}
                  />
                </FormField>
                <FormField label="Spring Term End">
                  <Input
                    type="date"
                    value={academicCalendar.springTermEnd}
                    onChange={(e) => setAcademicCalendar({...academicCalendar, springTermEnd: e.target.value})}
                  />
                </FormField>
              </div>
            </div>

<div className="border-t pt-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">School Breaks</h3>
              
              {/* Add/Edit Break Form */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <div className="flex items-center gap-2">
                  <ApperIcon name="Plus" size={16} className="text-primary-600" />
                  <h4 className="font-medium text-gray-900">
                    {editingBreak ? 'Edit Break' : 'Add New Break'}
                  </h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField label="Break Name">
                    <Input
                      value={newBreak.name}
                      onChange={(e) => setNewBreak({...newBreak, name: e.target.value})}
                      placeholder="e.g., Easter Break"
                    />
                  </FormField>
                  <FormField label="Start Date">
                    <Input
                      type="date"
                      value={newBreak.startDate}
                      onChange={(e) => setNewBreak({...newBreak, startDate: e.target.value})}
                    />
                  </FormField>
                  <FormField label="End Date">
                    <Input
                      type="date"
                      value={newBreak.endDate}
                      onChange={(e) => setNewBreak({...newBreak, endDate: e.target.value})}
                    />
                  </FormField>
                </div>
                
                <div className="flex gap-2">
                  {editingBreak ? (
                    <>
                      <Button
                        type="button"
                        onClick={handleUpdateBreak}
                        size="sm"
                      >
                        <ApperIcon name="Save" size={14} className="mr-2" />
                        Update Break
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancelEdit}
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleAddBreak}
                      size="sm"
                    >
                      <ApperIcon name="Plus" size={14} className="mr-2" />
                      Add Break
                    </Button>
                  )}
                </div>
              </div>

              {/* Existing Breaks List */}
              {academicCalendar.breaks && academicCalendar.breaks.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Current Breaks</h4>
{academicCalendar.breaks.map((breakItem) => (
                    <div key={breakItem.Id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{breakItem.name}</div>
                        <div className="text-sm text-gray-600">
                          {format(new Date(breakItem.startDate), 'MMM dd, yyyy')} - {format(new Date(breakItem.endDate), 'MMM dd, yyyy')}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditBreak(breakItem)}
                        >
                          <ApperIcon name="Edit" size={14} />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
onClick={() => handleDeleteBreak(breakItem.Id)}
                          className="text-red-600 hover:bg-red-50"
                          className="text-red-600 hover:bg-red-50"
                        >
                          <ApperIcon name="Trash2" size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="border-t pt-6">
              <FormField label="Week Start Day">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${!academicCalendar.weekStartsOnSunday ? 'text-primary-600' : 'text-gray-600'}`}>
                      Monday
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={academicCalendar.weekStartsOnSunday}
                        onChange={(e) => setAcademicCalendar({...academicCalendar, weekStartsOnSunday: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                    <span className={`text-sm font-medium ${academicCalendar.weekStartsOnSunday ? 'text-primary-600' : 'text-gray-600'}`}>
                      Sunday
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    This setting will be reflected in your Timetable and Calendar
                  </div>
                </div>
              </FormField>
            </div>
            
            <Button type="submit">
              <ApperIcon name="Save" size={16} className="mr-2" />
              Save Academic Calendar
            </Button>
          </form>
        );

case "schedule":
        return (
          <form onSubmit={handleSaveSchedule} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Class Schedule</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Number of Grade Levels">
                  <Input
                    type="number"
                    value={schedulePreferences.numberOfLevels}
                    onChange={(e) => handleNumberOfLevelsChange(parseInt(e.target.value))}
                    min="1"
                    max="12"
                  />
                </FormField>
              </div>
            </div>

            {/* Grade Level Configuration */}
            <div className="border-t pt-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Grade Level Configuration</h3>
              <div className="text-sm text-gray-600 mb-4">
                Configure the name and number of classes for each grade level
              </div>
              
              <div className="space-y-4">
                {schedulePreferences.gradeLevels.map((level, index) => (
                  <div key={level.Id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <ApperIcon name="GraduationCap" size={16} className="text-primary-600" />
                      <h4 className="font-medium text-gray-900">Level {index + 1}</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="Grade Level Name">
                        <Input
                          value={level.name}
                          onChange={(e) => handleGradeLevelChange(level.Id, 'name', e.target.value)}
                          placeholder="e.g., Grade 1, Kindergarten"
                          required
                        />
                      </FormField>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t pt-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Schedule Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Default Lesson Duration (minutes)">
                  <Input
                    type="number"
                    value={schedulePreferences.defaultLessonDuration}
                    onChange={(e) => setSchedulePreferences({...schedulePreferences, defaultLessonDuration: parseInt(e.target.value)})}
                    min="15"
                    max="120"
                    placeholder="e.g., 30"
                  />
                  <div className="text-sm text-gray-500 mt-1">
                    This will be used as the default when creating new lessons
                  </div>
                </FormField>
              </div>
            </div>
            
            <div className="border-t pt-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Default Working Hours</h3>
              <div className="text-sm text-gray-600 mb-4">
                Configure the default working hours for your schedule
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Start Time">
                  <Input
                    type="time"
                    value={schedulePreferences.defaultWorkingHours.start}
                    onChange={(e) => setSchedulePreferences({
                      ...schedulePreferences,
                      defaultWorkingHours: {
                        ...schedulePreferences.defaultWorkingHours,
                        start: e.target.value
                      }
                    })}
                  />
                </FormField>
                <FormField label="End Time">
                  <Input
                    type="time"
                    value={schedulePreferences.defaultWorkingHours.end}
                    onChange={(e) => setSchedulePreferences({
                      ...schedulePreferences,
                      defaultWorkingHours: {
                        ...schedulePreferences.defaultWorkingHours,
                        end: e.target.value
                      }
                    })}
                  />
                </FormField>
              </div>
            </div>
            
            <Button type="submit">
              <ApperIcon name="Save" size={16} className="mr-2" />
              Save Schedule Preferences
            </Button>
          </form>
        );

      case "sync":
        return (
          <form onSubmit={handleSaveSync} className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="syncEnabled"
                  checked={calendarSync.syncEnabled}
                  onChange={(e) => setCalendarSync({...calendarSync, syncEnabled: e.target.checked})}
                  className="rounded"
                />
                <label htmlFor="syncEnabled" className="text-sm font-medium">
                  Enable Calendar Sync
                </label>
              </div>
              
              <FormField label="Google Calendar ID">
                <Input
                  value={calendarSync.googleCalendarId}
                  onChange={(e) => setCalendarSync({...calendarSync, googleCalendarId: e.target.value})}
                  placeholder="Enter your Google Calendar ID"
                  disabled={!calendarSync.syncEnabled}
                />
              </FormField>
              
              <FormField label="Apple Calendar ID">
                <Input
                  value={calendarSync.appleCalendarId}
                  onChange={(e) => setCalendarSync({...calendarSync, appleCalendarId: e.target.value})}
                  placeholder="Enter your Apple Calendar ID"
                  disabled={!calendarSync.syncEnabled}
                />
              </FormField>

              {calendarSync.lastSyncDate && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Last sync: {new Date(calendarSync.lastSyncDate).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
              <Button type="submit">
                <ApperIcon name="Save" size={16} className="mr-2" />
                Save Sync Settings
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleSyncNow}
                disabled={!calendarSync.syncEnabled}
              >
                <ApperIcon name="RefreshCw" size={16} className="mr-2" />
                Sync Now
              </Button>
            </div>
          </form>
);

      case "notifications":
        return (
          <form onSubmit={handleSaveNotifications} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
              <p className="text-sm text-gray-600">Configure when you want to receive notifications</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <ApperIcon name="Clock" size={18} className="text-primary-600" />
                      <h4 className="font-medium text-gray-900">Class Reminders</h4>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Get notified 5 minutes before class starts</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationPreferences.classReminders}
                      onChange={(e) => setNotificationPreferences({...notificationPreferences, classReminders: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <ApperIcon name="CheckCircle" size={18} className="text-primary-600" />
                      <h4 className="font-medium text-gray-900">Processing Complete</h4>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Notify when lesson plan processing is done</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationPreferences.processingComplete}
                      onChange={(e) => setNotificationPreferences({...notificationPreferences, processingComplete: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <ApperIcon name="Info" size={18} className="text-primary-600" />
                      <h4 className="font-medium text-gray-900">System Updates</h4>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Receive notifications about new features</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationPreferences.systemUpdates}
                      onChange={(e) => setNotificationPreferences({...notificationPreferences, systemUpdates: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>
            
            <Button type="submit">
              <ApperIcon name="Save" size={16} className="mr-2" />
              Save Notification Preferences
            </Button>
          </form>
        );

      case "export":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Export Data</h3>
              <p className="text-sm text-gray-600">Export your data for backup or transfer purposes</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ApperIcon name="Database" size={18} className="text-primary-600" />
                    <h4 className="font-medium text-gray-900">Export All Data</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Export all students, lesson plans, schedules, and settings</p>
                  <Button onClick={handleExportAllData} size="sm" className="w-full">
                    <ApperIcon name="Download" size={14} className="mr-2" />
                    Export All Data
                  </Button>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ApperIcon name="Calendar" size={18} className="text-primary-600" />
                    <h4 className="font-medium text-gray-900">Export Timetable</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Export your timetable as a CSV file</p>
                  <Button onClick={handleExportTimetable} size="sm" className="w-full">
                    <ApperIcon name="Download" size={14} className="mr-2" />
                    Export Timetable
                  </Button>
                </div>
              </div>
            </div>

            <div className="border-t pt-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Import Data</h3>
              <p className="text-sm text-gray-600">Import data from a previously exported file</p>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <ApperIcon name="Upload" size={18} className="text-primary-600" />
                  <h4 className="font-medium text-gray-900">Import Data</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">Select a JSON file to import your data</p>
                <Input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="w-full"
                />
              </div>
            </div>

            <div className="border-t pt-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Reset Data</h3>
              <p className="text-sm text-gray-600">Reset all data to default values</p>
              
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <ApperIcon name="AlertTriangle" size={18} className="text-red-600" />
                  <h4 className="font-medium text-red-900">Reset All Data</h4>
                </div>
                <p className="text-sm text-red-700 mb-3">This will permanently delete all your data and cannot be undone</p>
                <Button 
                  onClick={handleResetAllData}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <ApperIcon name="RotateCcw" size={14} className="mr-2" />
                  Reset All Data
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account and application preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Navigation */}
        <div className="lg:w-64">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary-100 text-primary-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <ApperIcon name={tab.icon} size={18} />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ApperIcon 
                  name={tabs.find(t => t.id === activeTab)?.icon || "Settings"} 
                  size={24} 
                  className="text-primary-600" 
                />
                {tabs.find(t => t.id === activeTab)?.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderTabContent()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;