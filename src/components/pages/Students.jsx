import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import StudentList from "@/components/organisms/StudentList";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import SubjectChart from "@/components/molecules/SubjectChart";
import FormField from "@/components/molecules/FormField";
import PerformanceChart from "@/components/molecules/PerformanceChart";
import AttendanceChart from "@/components/molecules/AttendanceChart";
import { classService } from "@/services/api/classService";
import { studentService } from "@/services/api/studentService";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddStudent, setShowAddStudent] = useState(false);
const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentDetails, setShowStudentDetails] = useState(false);
  const [showEditStudent, setShowEditStudent] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
const [showParentLinkModal, setShowParentLinkModal] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [bulkDeleteStudents, setBulkDeleteStudents] = useState([]);
  const [parentLink, setParentLink] = useState("");
  const [importFile, setImportFile] = useState(null);
  const [importProgress, setImportProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
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

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      await studentService.update(editingStudent.Id, editingStudent);
      toast.success("Student updated successfully!");
      setShowEditStudent(false);
      setEditingStudent(null);
      loadData();
    } catch (err) {
      toast.error("Failed to update student");
    }
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setShowStudentDetails(true);
  };
const handleEditStudent = (student) => {
    setEditingStudent({ ...student });
    setShowEditStudent(true);
    setShowStudentDetails(false);
  };

  const handleDeleteStudent = (studentId) => {
    setStudentToDelete(studentId);
    setShowDeleteModal(true);
  };

  const confirmDeleteStudent = async () => {
    try {
      await studentService.delete(studentToDelete);
      toast.success("Student deleted successfully!");
      setShowDeleteModal(false);
      setStudentToDelete(null);
      loadData();
    } catch (err) {
      toast.error("Failed to delete student");
    }
  };

  const handleBulkDelete = (studentIds) => {
    setBulkDeleteStudents(studentIds);
    setShowBulkDeleteModal(true);
  };

  const confirmBulkDelete = async () => {
    try {
      await studentService.bulkDelete(bulkDeleteStudents);
      toast.success(`Successfully deleted ${bulkDeleteStudents.length} student(s)`);
      setShowBulkDeleteModal(false);
      setBulkDeleteStudents([]);
      loadData();
    } catch (err) {
      toast.error("Failed to delete students");
    }
  };

  const handleGenerateParentLink = async (student) => {
    try {
      const link = await studentService.generateParentLink(student.Id);
      setParentLink(link);
      setSelectedStudent(student);
      setShowParentLinkModal(true);
      setShowStudentDetails(false);
      toast.success("Parent link generated successfully!");
    } catch (err) {
      toast.error("Failed to generate parent link");
    }
  };

  const copyParentLink = async () => {
    try {
      await navigator.clipboard.writeText(parentLink);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

const handleAttendanceUpdate = async (studentId, date, isPresent) => {
    try {
      // In a real app, this would update attendance records
      toast.success("Attendance updated successfully!");
    } catch (err) {
      toast.error("Failed to update attendance");
    }
  };

  const handleImportCSV = async () => {
    if (!importFile) {
      toast.error("Please select a CSV file to import");
      return;
    }

    try {
      setIsImporting(true);
      setImportProgress(0);
      
      const result = await studentService.importStudents(importFile, (progress) => {
        setImportProgress(progress);
      });
      
      toast.success(`Successfully imported ${result.imported} students`);
      if (result.skipped > 0) {
        toast.info(`Skipped ${result.skipped} duplicate entries`);
      }
      
      setShowImportModal(false);
      setImportFile(null);
      setImportProgress(0);
      loadData();
    } catch (err) {
      toast.error(`Import failed: ${err.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      await studentService.exportStudentsCSV(students);
      toast.success("CSV export completed successfully!");
      setShowExportModal(false);
    } catch (err) {
      toast.error("Failed to export CSV");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      await studentService.exportStudentsPDF(students);
      toast.success("PDF export completed successfully!");
      setShowExportModal(false);
    } catch (err) {
      toast.error("Failed to export PDF");
    } finally {
      setIsExporting(false);
    }
  };
  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

return (
    <div className="space-y-4 sm:space-y-6">
    <div
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Student Management</h1>
            <p className="text-sm sm:text-base text-gray-600">Manage your students and track their progress</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row w-full sm:w-auto">
            <Button
                variant="outline"
                onClick={() => setShowImportModal(true)}
                className="flex-1 sm:flex-none">
                <ApperIcon name="Upload" size={16} className="mr-2" />
                <span className="sm:hidden">Import</span>
                <span className="hidden sm:inline">Import CSV</span>
            </Button>
            <Button
                variant="outline"
                onClick={() => setShowExportModal(true)}
                className="flex-1 sm:flex-none">
                <ApperIcon name="Download" size={16} className="mr-2" />
                <span className="sm:hidden">Export</span>
                <span className="hidden sm:inline">Export Data</span>
            </Button>
            <Button onClick={() => setShowAddStudent(true)} className="flex-1 sm:flex-none">
                <ApperIcon name="UserPlus" size={16} className="mr-2" />
                <span className="sm:hidden">Add</span>
                <span className="hidden sm:inline">Add Student</span>
            </Button>
        </div>
    </div>
    {/* Students Overview */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs sm:text-sm text-gray-600">Total Students</p>
                        <p className="text-xl sm:text-2xl font-bold text-primary-600">{students.length}</p>
                    </div>
                    <div
                        className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <ApperIcon name="Users" size={20} className="text-primary-600 sm:w-6 sm:h-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs sm:text-sm text-gray-600">Active Classes</p>
                        <p className="text-xl sm:text-2xl font-bold text-secondary-600">{classes.length}</p>
                    </div>
                    <div
                        className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary-100 rounded-full flex items-center justify-center">
                        <ApperIcon name="BookOpen" size={20} className="text-secondary-600 sm:w-6 sm:h-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
        <Card className="sm:col-span-2 lg:col-span-1">
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs sm:text-sm text-gray-600">Avg. Attendance</p>
                        <p className="text-xl sm:text-2xl font-bold text-accent-600">87%</p>
                    </div>
                    <div
                        className="w-10 h-10 sm:w-12 sm:h-12 bg-accent-100 rounded-full flex items-center justify-center">
                        <ApperIcon name="TrendingUp" size={20} className="text-accent-600 sm:w-6 sm:h-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
    {/* Student List */}
    <StudentList
        students={students}
        onStudentClick={handleStudentClick}
        onBulkDelete={handleBulkDelete}
        onDeleteStudent={handleDeleteStudent}
        onEditStudent={handleEditStudent} />
    {/* Add Student Modal */}
    {/* Add Student Modal */}
    {showAddStudent && <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto mx-4">
            <CardTitle>Add New Student</CardTitle>
            <CardContent>
                <form onSubmit={handleCreateStudent} className="space-y-4">
                    <FormField label="Student Name">
                        <Input
                            value={newStudent.name}
                            onChange={e => setNewStudent({
                                ...newStudent,
                                name: e.target.value
                            })}
                            placeholder="Enter student name"
                            required />
                    </FormField>
                    <FormField label="Student ID">
                        <Input
                            value={newStudent.studentId}
                            onChange={e => setNewStudent({
                                ...newStudent,
                                studentId: e.target.value
                            })}
                            placeholder="Enter student ID"
                            required />
                    </FormField>
                    <FormField label="Class">
                        <Select
                            value={newStudent.classId}
                            onChange={e => setNewStudent({
                                ...newStudent,
                                classId: e.target.value
                            })}
                            required>
                            <option value="">Select Class</option>
                            {classes.map(cls => <option key={cls.Id} value={cls.Id}>
                                {cls.name}- Grade {cls.gradeLevel}
                            </option>)}
                        </Select>
                    </FormField>
                    <FormField label="Guardian Name">
                        <Input
                            value={newStudent.guardianName}
                            onChange={e => setNewStudent({
                                ...newStudent,
                                guardianName: e.target.value
                            })}
                            placeholder="Enter guardian name"
                            required />
                    </FormField>
                    <FormField label="Guardian Phone">
                        <Input
                            value={newStudent.guardianPhone}
                            onChange={e => setNewStudent({
                                ...newStudent,
                                guardianPhone: e.target.value
                            })}
                            placeholder="Enter phone number"
                            required />
                    </FormField>
                    <FormField label="Guardian Email">
                        <Input
                            type="email"
                            value={newStudent.guardianEmail}
                            onChange={e => setNewStudent({
                                ...newStudent,
                                guardianEmail: e.target.value
                            })}
                            placeholder="Enter email address" />
                    </FormField>
                    <div className="flex gap-3 pt-4">
                        <Button type="submit" className="flex-1">Add Student
                                              </Button>
                        <Button type="button" variant="outline" onClick={() => setShowAddStudent(false)}>Cancel
                                              </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    </div>}
    {/* Student Details Modal */}
    {showStudentDetails && selectedStudent && <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Student Analytics</CardTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setShowStudentDetails(false);
                            setActiveTab("details");
                        }}>
                        <ApperIcon name="X" size={20} />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* Student Header */}
                    <div className="flex items-center gap-4 pb-4 border-b">
                        <div
                            className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                            <ApperIcon name="User" size={24} className="text-primary-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold">{selectedStudent.name}</h3>
                            <p className="text-gray-600">ID: {selectedStudent.studentId}</p>
                            <p className="text-gray-600">Class: {selectedStudent.className}</p>
                        </div>
                    </div>
                    {/* Tab Navigation */}
                    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab("details")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${activeTab === "details" ? "bg-white text-primary-600 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}>
                            <ApperIcon name="User" size={16} />Details
                                              </button>
                        <button
                            onClick={() => setActiveTab("charts")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${activeTab === "charts" ? "bg-white text-primary-600 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}>
                            <ApperIcon name="BarChart3" size={16} />Progress Charts
                                              </button>
                    </div>
                    {/* Tab Content */}
                    {activeTab === "details" && <div className="space-y-6">
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
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => handleEditStudent(selectedStudent)}>
                                <ApperIcon name="Edit" size={16} className="mr-2" />Edit Student
                                                      </Button>
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => handleGenerateParentLink(selectedStudent)}>
                                <ApperIcon name="Link" size={16} className="mr-2" />Parent Link
                                                      </Button>
                        </div>
                    </div>}
                    {activeTab === "charts" && <div className="space-y-6">
                        {/* Attendance Trend Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <ApperIcon name="Calendar" size={18} />Attendance Trend
                                                            </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64">
                                    <AttendanceChart
                                        studentId={selectedStudent.Id}
                                        attendanceRate={selectedStudent.attendanceRate} />
                                </div>
                            </CardContent>
                        </Card>
                        {/* Performance Overview */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <ApperIcon name="TrendingUp" size={18} />Performance Overview
                                                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-64">
                                        <PerformanceChart
                                            studentId={selectedStudent.Id}
                                            overallGrade={selectedStudent.overallGrade}
                                            attendanceRate={selectedStudent.attendanceRate} />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <ApperIcon name="Target" size={18} />Subject Performance
                                                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-64">
                                        <SubjectChart studentId={selectedStudent.Id} className={selectedStudent.className} />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">Current Attendance</p>
                                            <p className="text-2xl font-bold text-primary-600">{selectedStudent.attendanceRate}%</p>
                                        </div>
                                        <div
                                            className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                            <ApperIcon name="UserCheck" size={20} className="text-primary-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">Overall Grade</p>
                                            <p className="text-2xl font-bold text-secondary-600">{selectedStudent.overallGrade || "B+"}</p>
                                        </div>
                                        <div
                                            className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center">
                                            <ApperIcon name="Award" size={20} className="text-secondary-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">Improvement</p>
                                            <p className="text-2xl font-bold text-accent-600">+5%</p>
                                        </div>
                                        <div
                                            className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
                                            <ApperIcon name="TrendingUp" size={20} className="text-accent-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>}
                </div>
            </CardContent>
        </Card>
    </div>}
    {/* Import CSV Modal */}
    {showImportModal && <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Import Students from CSV</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select CSV File
                                              </label>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={e => setImportFile(e.target.files[0])}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" />
                        <p className="text-xs text-gray-500 mt-1">CSV should contain: name, studentId, classId, guardianName, guardianPhone, guardianEmail
                                              </p>
                    </div>
                    {isImporting && <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Importing...</span>
                            <span>{importProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                                style={{
                                    width: `${importProgress}%`
                                }} />
                        </div>
                    </div>}
                    <div className="flex gap-3 pt-4">
                        <Button
                            onClick={handleImportCSV}
                            disabled={!importFile || isImporting}
                            className="flex-1">
                            {isImporting ? "Importing..." : "Import"}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowImportModal(false);
                                setImportFile(null);
                                setImportProgress(0);
                            }}
                            disabled={isImporting}>Cancel
                                              </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>}
    {/* Export Modal */}
    {showExportModal && <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Export Student Data</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">Choose export format for student data including attendance and performance information.
                                        </p>
                    <div className="flex flex-col gap-3">
                        <Button
                            onClick={handleExportCSV}
                            disabled={isExporting}
                            className="flex items-center justify-center gap-2">
                            <ApperIcon name="FileText" size={16} />
                            {isExporting ? "Exporting..." : "Export as CSV"}
                        </Button>
                        <Button
                            onClick={handleExportPDF}
                            disabled={isExporting}
                            variant="outline"
                            className="flex items-center justify-center gap-2">
                            <ApperIcon name="FileText" size={16} />
                            {isExporting ? "Exporting..." : "Export as PDF"}
                        </Button>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setShowExportModal(false)}
                            disabled={isExporting}
                            className="flex-1">Cancel
                                              </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>}
    {/* Edit Student Modal */}
    {showEditStudent && editingStudent && <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader>
                <CardTitle>Edit Student</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleUpdateStudent} className="space-y-4">
                    <FormField label="Student Name">
                        <Input
                            value={editingStudent.name}
                            onChange={e => setEditingStudent({
                                ...editingStudent,
                                name: e.target.value
                            })}
                            placeholder="Enter student name"
                            required />
                    </FormField>
                    <FormField label="Student ID">
                        <Input
                            value={editingStudent.studentId}
                            onChange={e => setEditingStudent({
                                ...editingStudent,
                                studentId: e.target.value
                            })}
                            placeholder="Enter student ID"
                            required />
                    </FormField>
                    <FormField label="Class">
                        <Select
                            value={editingStudent.classId}
                            onChange={e => setEditingStudent({
                                ...editingStudent,
                                classId: parseInt(e.target.value)
                            })}
                            required>
                            <option value="">Select Class</option>
                            {classes.map(cls => <option key={cls.Id} value={cls.Id}>
                                {cls.name}- Grade {cls.gradeLevel}
                            </option>)}
                        </Select>
                    </FormField>
                    <FormField label="Guardian Name">
                        <Input
                            value={editingStudent.guardianName}
                            onChange={e => setEditingStudent({
                                ...editingStudent,
                                guardianName: e.target.value
                            })}
                            placeholder="Enter guardian name"
                            required />
                    </FormField>
                    <FormField label="Guardian Phone">
                        <Input
                            value={editingStudent.guardianPhone}
                            onChange={e => setEditingStudent({
                                ...editingStudent,
                                guardianPhone: e.target.value
                            })}
                            placeholder="Enter phone number"
                            required />
                    </FormField>
                    <FormField label="Guardian Email">
                        <Input
                            type="email"
                            value={editingStudent.guardianEmail}
                            onChange={e => setEditingStudent({
                                ...editingStudent,
                                guardianEmail: e.target.value
                            })}
                            placeholder="Enter email address" />
                    </FormField>
                    <div className="flex gap-3 pt-4">
                        <Button type="submit" className="flex-1">Update Student
                                              </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setShowEditStudent(false);
                                setEditingStudent(null);
                            }}>Cancel
                                              </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    </div>}
    {/* Bulk Delete Confirmation Modal */}
    {showBulkDeleteModal && <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                    <ApperIcon name="AlertTriangle" size={24} />Confirm Bulk Delete
                                  </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <p className="text-gray-700">Are you sure you want to delete {bulkDeleteStudents.length}student{bulkDeleteStudents.length > 1 ? "s" : ""}? 
                                          This action cannot be undone.
                                        </p>
                    <div className="flex gap-3">
                        <Button
                            onClick={confirmBulkDelete}
                            className="flex-1 bg-red-600 hover:bg-red-700">Delete Students
                                              </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowBulkDeleteModal(false);
                                setBulkDeleteStudents([]);
                            }}
                            className="flex-1">Cancel
                                              </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>}
    {/* Delete Student Confirmation Modal */}
    {showDeleteModal && <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                    <ApperIcon name="AlertTriangle" size={24} />Confirm Delete Student
                                  </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <p className="text-gray-700">Are you sure you want to delete this student? This action cannot be undone.
                                        </p>
                    <div className="flex gap-3">
                        <Button
                            onClick={confirmDeleteStudent}
                            className="flex-1 bg-red-600 hover:bg-red-700">Delete Student
                                              </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowDeleteModal(false);
                                setStudentToDelete(null);
                            }}
                            className="flex-1">Cancel
                                              </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>}
    {/* Parent Link Modal */}
    {showParentLinkModal && selectedStudent && <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ApperIcon name="Link" size={24} className="text-primary-600" />Parent Access Link
                                  </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-gray-600 mb-2">Share this secure link with {selectedStudent.guardianName}to access {selectedStudent.name}'s records:
                                              </p>
                        <div className="p-3 bg-gray-50 rounded-md border">
                            <p className="text-sm font-mono break-all text-gray-800">{parentLink}</p>
                        </div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                        <div className="flex items-start gap-2">
                            <ApperIcon name="AlertTriangle" size={16} className="text-yellow-600 mt-0.5" />
                            <div className="text-sm text-yellow-800">
                                <p className="font-medium">Security Notice:</p>
                                <p>This link expires in 30 days and can only be used by the registered guardian.</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button onClick={copyParentLink} className="flex-1">
                            <ApperIcon name="Copy" size={16} className="mr-2" />Copy Link
                                              </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowParentLinkModal(false);
                                setParentLink("");
                            }}>Close
                                              </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>}
</div>
  );
};

export default Students;