import { useState } from "react";
import SearchBar from "@/components/molecules/SearchBar";
import StudentCard from "@/components/molecules/StudentCard";
import Select from "@/components/atoms/Select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StudentList = ({ students = [], onStudentClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.includes(searchTerm);
    const matchesClass = selectedClass === "all" || student.className === selectedClass;
    return matchesSearch && matchesClass;
  });

  const uniqueClasses = [...new Set(students.map(s => s.className))];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="Filter" size={20} className="text-primary-600" />
            Filter Students
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map(student => (
          <StudentCard
            key={student.Id}
            student={student}
            onClick={() => onStudentClick?.(student)}
          />
        ))}
      </div>

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