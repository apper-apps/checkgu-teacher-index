import { useState, useEffect } from "react";
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
    website: "www.greenwood.edu"
  });

const [academicCalendar, setAcademicCalendar] = useState({
    termStart: "2025-02-17",
    termEnd: "2025-06-30",
    winterBreakStart: "2025-04-01",
    winterBreakEnd: "2025-04-15",
    springTermStart: "2025-04-16",
    springTermEnd: "2025-06-30"
  });

  const [teachingDuration, setTeachingDuration] = useState({
    classPeriodMinutes: 45,
    breakDuration: 15,
    lunchDuration: 30,
    numberOfLevels: 5,
    numberOfClasses: 2
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
    { id: "duration", label: "Teaching Duration", icon: "Clock" },
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
      toast.success("School profile updated successfully!");
    } catch (err) {
      toast.error("Failed to update school profile");
    }
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

  const handleSaveDuration = async (e) => {
    e.preventDefault();
    try {
      toast.success("Teaching duration settings updated successfully!");
    } catch (err) {
      toast.error("Failed to update teaching duration");
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
          <form onSubmit={handleSaveCalendar} className="space-y-4">
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
            <Button type="submit">
              <ApperIcon name="Save" size={16} className="mr-2" />
              Save Academic Calendar
            </Button>
          </form>
        );

      case "duration":
        return (
          <form onSubmit={handleSaveDuration} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Class Period Duration (minutes)">
                <Input
                  type="number"
                  value={teachingDuration.classPeriodMinutes}
                  onChange={(e) => setTeachingDuration({...teachingDuration, classPeriodMinutes: parseInt(e.target.value)})}
                  min="30"
                  max="90"
                />
              </FormField>
              <FormField label="Break Duration (minutes)">
                <Input
                  type="number"
                  value={teachingDuration.breakDuration}
                  onChange={(e) => setTeachingDuration({...teachingDuration, breakDuration: parseInt(e.target.value)})}
                  min="10"
                  max="30"
                />
              </FormField>
              <FormField label="Lunch Duration (minutes)">
                <Input
                  type="number"
                  value={teachingDuration.lunchDuration}
                  onChange={(e) => setTeachingDuration({...teachingDuration, lunchDuration: parseInt(e.target.value)})}
                  min="20"
                  max="60"
                />
              </FormField>
              <FormField label="Number of Grade Levels">
                <Input
                  type="number"
                  value={teachingDuration.numberOfLevels}
                  onChange={(e) => setTeachingDuration({...teachingDuration, numberOfLevels: parseInt(e.target.value)})}
                  min="1"
                  max="12"
                />
              </FormField>
              <FormField label="Classes per Grade Level">
                <Input
                  type="number"
                  value={teachingDuration.numberOfClasses}
                  onChange={(e) => setTeachingDuration({...teachingDuration, numberOfClasses: parseInt(e.target.value)})}
                  min="1"
                  max="10"
                />
              </FormField>
            </div>
            <Button type="submit">
              <ApperIcon name="Save" size={16} className="mr-2" />
              Save Duration Settings
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