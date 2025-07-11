import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";
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
      { id: 1, name: "Winter Break", startDate: "2025-04-01", endDate: "2025-04-15" },
      { id: 2, name: "Spring Break", startDate: "2025-03-15", endDate: "2025-03-22" }
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
    }
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
    { id: "sync", label: "Calendar Sync", icon: "RefreshCw" }
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

    const breakWithId = {
      ...newBreak,
      id: Date.now()
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

    setAcademicCalendar(prev => ({
      ...prev,
      breaks: prev.breaks.map(b => 
        b.id === editingBreak.id 
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
        breaks: prev.breaks.filter(b => b.id !== breakId)
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
    try {
      await settingsService.updateSchedulePreferences(schedulePreferences);
      toast.success("Schedule preferences updated successfully!");
    } catch (err) {
      toast.error("Failed to update schedule preferences");
    }
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
              <div className="text-sm text-gray-600 mb-4">
                Manage custom school breaks that will appear in your calendar and timetable
              </div>
              
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
                    <div key={breakItem.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
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
                          size="sm"
                          onClick={() => handleDeleteBreak(breakItem.id)}
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
                    onChange={(e) => setSchedulePreferences({...schedulePreferences, numberOfLevels: parseInt(e.target.value)})}
                    min="1"
                    max="12"
                  />
                </FormField>
                <FormField label="Classes per Grade Level">
                  <Input
                    type="number"
                    value={schedulePreferences.numberOfClasses}
                    onChange={(e) => setSchedulePreferences({...schedulePreferences, numberOfClasses: parseInt(e.target.value)})}
                    min="1"
                    max="10"
                  />
                </FormField>
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
              <h3 className="text-lg font-semibold text-gray-900">Schedule Default Working Hours</h3>
              <div className="text-sm text-gray-600 mb-4">
                These are used as defaults when daily schedules are disabled
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