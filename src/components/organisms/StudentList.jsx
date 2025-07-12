import { useState } from "react";
import SearchBar from "@/components/molecules/SearchBar";
import StudentCard from "@/components/molecules/StudentCard";
import Select from "@/components/atoms/Select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StudentList = ({ students = [], onStudentClick, onBulkDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [viewMode, setViewMode] = useState("card");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.includes(searchTerm);
    const matchesClass = selectedClass === "all" || student.className === selectedClass;
    return matchesSearch && matchesClass;
});

  const uniqueClasses = [...new Set(students.map(s => s.className))];

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s.Id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prev => {
      const isSelected = prev.includes(studentId);
      const newSelection = isSelected 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId];
      
      setSelectAll(newSelection.length === filteredStudents.length);
      return newSelection;
    });
  };

  const handleBulkDelete = () => {
    if (selectedStudents.length === 0) return;
    onBulkDelete?.(selectedStudents);
    setSelectedStudents([]);
    setSelectAll(false);
  };
return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ApperIcon name="Filter" size={20} className="text-primary-600" />
              Filter Students
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("card")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "card" 
                    ? "bg-primary-100 text-primary-600" 
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <ApperIcon name="Grid3x3" size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list" 
                    ? "bg-primary-100 text-primary-600" 
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <ApperIcon name="List" size={18} />
              </button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                placeholder="Search by name or student ID..."
                onSearch={setSearchTerm}
              />
            </div>
            <div className="w-full md:w-48">
              <Select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="all">All Classes</option>
                {uniqueClasses.map(className => (
                  <option key={className} value={className}>
                    {className}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions Toolbar */}
      {selectedStudents.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedStudents.length} student{selectedStudents.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedStudents([]);
                    setSelectAll(false);
                  }}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Clear Selection
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded-md transition-colors flex items-center gap-1"
                >
                  <ApperIcon name="Trash2" size={14} />
                  Delete Selected
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

{/* Student List/Grid */}
      {viewMode === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map(student => (
            <div key={student.Id} className="relative">
              <input
                type="checkbox"
                checked={selectedStudents.includes(student.Id)}
                onChange={() => handleSelectStudent(student.Id)}
                className="absolute top-3 left-3 z-10 w-4 h-4 text-primary-600 bg-white border-gray-300 rounded focus:ring-primary-500"
              />
              <StudentCard
                student={student}
                onClick={() => onStudentClick?.(student)}
                className="cursor-pointer hover:bg-gray-50"
              />
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-4 w-12">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-primary-600 bg-white border-gray-300 rounded focus:ring-primary-500"
                      />
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">Student</th>
                    <th className="text-left p-4 font-medium text-gray-900">ID</th>
                    <th className="text-left p-4 font-medium text-gray-900">Class</th>
                    <th className="text-left p-4 font-medium text-gray-900">Guardian</th>
                    <th className="text-left p-4 font-medium text-gray-900">Attendance</th>
                    <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map(student => (
                    <tr key={student.Id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.Id)}
                          onChange={() => handleSelectStudent(student.Id)}
                          className="w-4 h-4 text-primary-600 bg-white border-gray-300 rounded focus:ring-primary-500"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <ApperIcon name="User" size={14} className="text-primary-600" />
                          </div>
                          <span className="font-medium text-gray-900">{student.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{student.studentId}</td>
                      <td className="p-4 text-gray-600">{student.className}</td>
                      <td className="p-4 text-gray-600">{student.guardianName}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          student.attendanceRate >= 90 
                            ? 'bg-green-100 text-green-800'
                            : student.attendanceRate >= 80
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {student.attendanceRate}%
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => onStudentClick?.(student)}
                          className="text-primary-600 hover:text-primary-800 transition-colors"
                        >
                          <ApperIcon name="Eye" size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {filteredStudents.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <ApperIcon name="Users" size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Students Found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or class filter.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentList;