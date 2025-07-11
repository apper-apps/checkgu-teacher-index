import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { scheduleService } from "@/services/api/scheduleService";
import { classService } from "@/services/api/classService";
import { toast } from "react-toastify";

const Schedule = () => {
  const [classes, setClasses] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddClass, setShowAddClass] = useState(false);
  const [newClass, setNewClass] = useState({
    name: "",
    gradeLevel: "",
    subjects: []
  });

  const subjects = [
    "Mathematics", "English", "Science", "History", "Geography", 
    "Art", "Physical Education", "Music"
  ];

  const timeSlots = [
    "08:00 - 08:45", "09:00 - 09:45", "10:00 - 10:45", "11:00 - 11:45",
    "12:00 - 12:45", "13:00 - 13:45", "14:00 - 14:45", "15:00 - 15:45"
  ];

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [classesData, schedulesData] = await Promise.all([
        classService.getAll(),
        scheduleService.getAll()
      ]);
      setClasses(classesData);
      setSchedules(schedulesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      await classService.create(newClass);
      toast.success("Class created successfully!");
      setNewClass({ name: "", gradeLevel: "", subjects: [] });
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
          <p className="text-gray-600">Manage your classes and weekly schedule</p>
        </div>
        <Button onClick={() => setShowAddClass(true)}>
          <ApperIcon name="Plus" size={18} className="mr-2" />
          Add Class
        </Button>
      </div>

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
          )}
        </CardContent>
      </Card>

      {/* Schedule Grid */}
      {classes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="Calendar" size={24} className="text-primary-600" />
              Weekly Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {classes.map(cls => (
                <div key={cls.Id} className="space-y-4">
                  <h3 className="font-semibold text-lg">{cls.name}</h3>
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
                        {timeSlots.map(timeSlot => (
                          <tr key={timeSlot} className="border-t">
                            <td className="p-3 font-medium text-sm">{timeSlot}</td>
                            {days.map((day, dayIndex) => {
                              const schedule = getScheduleForSlot(cls.Id, dayIndex, timeSlot);
                              return (
                                <td key={day} className="p-3">
                                  <Select
                                    value={schedule?.subject || ""}
                                    onChange={(e) => handleScheduleChange(
                                      cls.Id, 
                                      dayIndex, 
                                      timeSlot, 
                                      e.target.value
                                    )}
                                    className="w-full text-sm"
                                  >
                                    <option value="">-</option>
                                    {cls.subjects.map(subject => (
                                      <option key={subject} value={subject}>
                                        {subject}
                                      </option>
                                    ))}
                                  </Select>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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
                    {[1,2,3,4,5,6,7,8,9,10,11,12].map(grade => (
                      <option key={grade} value={grade}>Grade {grade}</option>
                    ))}
                  </Select>
                </FormField>
                <FormField label="Subjects">
                  <div className="grid grid-cols-2 gap-2">
                    {subjects.map(subject => (
                      <label key={subject} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={newClass.subjects.includes(subject)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewClass({
                                ...newClass,
                                subjects: [...newClass.subjects, subject]
                              });
                            } else {
                              setNewClass({
                                ...newClass,
                                subjects: newClass.subjects.filter(s => s !== subject)
                              });
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{subject}</span>
                      </label>
                    ))}
                  </div>
                </FormField>
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1">
                    Create Class
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowAddClass(false)}
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