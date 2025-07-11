import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import StudentList from "@/components/organisms/StudentList";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";
import { classService } from "@/services/api/classService";
import { toast } from "react-toastify";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentDetails, setShowStudentDetails] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    studentId: "",
    classId: "",
    guardianName: "",
    guardianPhone: "",
    guardianEmail: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [studentsData, classesData] = await Promise.all([
        studentService.getAll(),
        classService.getAll()
      ]);
      setStudents(studentsData);
      setClasses(classesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    try {
      await studentService.create(newStudent);
      toast.success("Student added successfully!");
      setNewStudent({
        name: "",
        studentId: "",
        classId: "",
        guardianName: "",
        guardianPhone: "",
        guardianEmail: ""
      });
      setShowAddStudent(false);
      loadData();
    } catch (err) {
      toast.error("Failed to add student");
    }
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setShowStudentDetails(true);
  };

  const handleAttendanceUpdate = async (studentId, date, isPresent) => {
    try {
      // In a real app, this would update attendance records
      toast.success("Attendance updated successfully!");
    } catch (err) {
      toast.error("Failed to update attendance");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
          <p className="text-gray-600">Manage your students and track their progress</p>
        </div>
        <Button onClick={() => setShowAddStudent(true)}>
          <ApperIcon name="UserPlus" size={18} className="mr-2" />
          Add Student
        </Button>
      </div>

      {/* Students Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-primary-600">{students.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <ApperIcon name="Users" size={24} className="text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Classes</p>
                <p className="text-2xl font-bold text-secondary-600">{classes.length}</p>
              </div>
              <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
                <ApperIcon name="BookOpen" size={24} className="text-secondary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Attendance</p>
                <p className="text-2xl font-bold text-accent-600">87%</p>
              </div>
              <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center">
                <ApperIcon name="TrendingUp" size={24} className="text-accent-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student List */}
      <StudentList
        students={students}
        onStudentClick={handleStudentClick}
      />

      {/* Add Student Modal */}
      {showAddStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Add New Student</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateStudent} className="space-y-4">
                <FormField label="Student Name">
                  <Input
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                    placeholder="Enter student name"
                    required
                  />
                </FormField>
                <FormField label="Student ID">
                  <Input
                    value={newStudent.studentId}
                    onChange={(e) => setNewStudent({...newStudent, studentId: e.target.value})}
                    placeholder="Enter student ID"
                    required
                  />
                </FormField>
                <FormField label="Class">
                  <Select
                    value={newStudent.classId}
                    onChange={(e) => setNewStudent({...newStudent, classId: e.target.value})}
                    required
                  >
                    <option value="">Select Class</option>
                    {classes.map(cls => (
                      <option key={cls.Id} value={cls.Id}>
                        {cls.name} - Grade {cls.gradeLevel}
                      </option>
                    ))}
                  </Select>
                </FormField>
                <FormField label="Guardian Name">
                  <Input
                    value={newStudent.guardianName}
                    onChange={(e) => setNewStudent({...newStudent, guardianName: e.target.value})}
                    placeholder="Enter guardian name"
                    required
                  />
                </FormField>
                <FormField label="Guardian Phone">
                  <Input
                    value={newStudent.guardianPhone}
                    onChange={(e) => setNewStudent({...newStudent, guardianPhone: e.target.value})}
                    placeholder="Enter phone number"
                    required
                  />
                </FormField>
                <FormField label="Guardian Email">
                  <Input
                    type="email"
                    value={newStudent.guardianEmail}
                    onChange={(e) => setNewStudent({...newStudent, guardianEmail: e.target.value})}
                    placeholder="Enter email address"
                  />
                </FormField>
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1">
                    Add Student
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowAddStudent(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Student Details Modal */}
      {showStudentDetails && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Student Details</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowStudentDetails(false)}>
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <ApperIcon name="User" size={24} className="text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedStudent.name}</h3>
                    <p className="text-gray-600">ID: {selectedStudent.studentId}</p>
                    <p className="text-gray-600">Class: {selectedStudent.className}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Guardian Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Name:</strong> {selectedStudent.guardianName}</p>
                      <p><strong>Phone:</strong> {selectedStudent.guardianPhone}</p>
                      <p><strong>Email:</strong> {selectedStudent.guardianEmail}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Academic Performance</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Attendance:</strong> {selectedStudent.attendanceRate}%</p>
                      <p><strong>Overall Grade:</strong> {selectedStudent.overallGrade || "B+"}</p>
                      <p><strong>Notes:</strong> {selectedStudent.notes || "No notes available"}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1">
                    <ApperIcon name="Edit" size={16} className="mr-2" />
                    Edit Student
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <ApperIcon name="FileText" size={16} className="mr-2" />
                    View Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Students;