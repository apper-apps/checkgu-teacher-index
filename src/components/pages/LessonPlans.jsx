import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import Select from "@/components/atoms/Select";
import LessonPlanModal from "@/components/organisms/LessonPlanModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { lessonPlanService } from "@/services/api/lessonPlanService";
import { classService } from "@/services/api/classService";
import { toast } from "react-toastify";
import { format } from "date-fns";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType } from "docx";

const LessonPlans = () => {
  const [lessonPlans, setLessonPlans] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem("lessonPlanViewMode") || "card";
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const subjects = [
    "Mathematics", "English", "Science", "History", "Geography", 
    "Art", "Physical Education", "Music"
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [lessonPlansData, classesData] = await Promise.all([
        lessonPlanService.getAll(),
        classService.getAll()
      ]);
      setLessonPlans(lessonPlansData);
      setClasses(classesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

const handleCreateLesson = () => {
    setSelectedLesson(null);
    setShowLessonModal(true);
  };

  const handleEditLesson = (lesson) => {
    setSelectedLesson(lesson);
    setShowLessonModal(true);
  };

  const handleSaveLessonPlan = async (lessonData) => {
    try {
      if (selectedLesson) {
        await lessonPlanService.update(selectedLesson.Id, lessonData);
        toast.success("Lesson plan updated successfully!");
      } else {
        await lessonPlanService.create(lessonData);
        toast.success("Lesson plan created successfully!");
      }
      setShowLessonModal(false);
      setSelectedLesson(null);
      loadData();
    } catch (err) {
      toast.error("Failed to save lesson plan");
      throw err;
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (window.confirm("Are you sure you want to delete this lesson plan?")) {
      try {
        await lessonPlanService.delete(lessonId);
        toast.success("Lesson plan deleted successfully!");
        setSelectedItems(prev => prev.filter(id => id !== lessonId));
        loadData();
      } catch (err) {
        toast.error("Failed to delete lesson plan");
      }
    }
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem("lessonPlanViewMode", mode);
    setSelectedItems([]); // Clear selections when changing view
  };

  const handleSelectItem = (lessonId) => {
    setSelectedItems(prev => {
      if (prev.includes(lessonId)) {
        return prev.filter(id => id !== lessonId);
      } else {
        return [...prev, lessonId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredLessonPlans.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredLessonPlans.map(lesson => lesson.Id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedItems.length} lesson plan(s)?`)) {
      try {
        await lessonPlanService.deleteMultiple(selectedItems);
        toast.success(`${selectedItems.length} lesson plan(s) deleted successfully!`);
        setSelectedItems([]);
        loadData();
      } catch (err) {
        toast.error("Failed to delete lesson plans");
      }
    }
  };

  const handleExportPDF = async () => {
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text("Lesson Plans", 20, 20);
      
      // Add export date
      doc.setFontSize(12);
      doc.text(`Exported on: ${format(new Date(), "MMMM d, yyyy")}`, 20, 35);
      
      // Prepare data for table
      const tableData = filteredLessonPlans.map(lesson => [
        lesson.subject,
        lesson.className,
        lesson.date ? format(new Date(lesson.date), "MMM d, yyyy") : "No date",
        lesson.time || "No time",
        lesson.content.substring(0, 100) + (lesson.content.length > 100 ? "..." : "")
      ]);
      
      // Add table
      doc.autoTable({
        head: [['Subject', 'Class', 'Date', 'Time', 'Content']],
        body: tableData,
        startY: 45,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [74, 144, 226] },
        columnStyles: {
          4: { cellWidth: 60 } // Content column wider
        }
      });
      
      doc.save('lesson-plans.pdf');
      toast.success("PDF exported successfully!");
    } catch (err) {
      toast.error("Failed to export PDF");
      console.error(err);
    }
  };

  const handleExportDOCX = async () => {
    try {
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Lesson Plans",
                  bold: true,
                  size: 32
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Exported on: ${format(new Date(), "MMMM d, yyyy")}`,
                  size: 20
                })
              ]
            }),
            new Paragraph({ text: "" }), // Empty line
            
            // Create table
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                // Header row
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ text: "Subject" })] }),
                    new TableCell({ children: [new Paragraph({ text: "Class" })] }),
                    new TableCell({ children: [new Paragraph({ text: "Date" })] }),
                    new TableCell({ children: [new Paragraph({ text: "Time" })] }),
                    new TableCell({ children: [new Paragraph({ text: "Content" })] })
                  ]
                }),
                // Data rows
                ...filteredLessonPlans.map(lesson => new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ text: lesson.subject })] }),
                    new TableCell({ children: [new Paragraph({ text: lesson.className })] }),
                    new TableCell({ children: [new Paragraph({ text: lesson.date ? format(new Date(lesson.date), "MMM d, yyyy") : "No date" })] }),
                    new TableCell({ children: [new Paragraph({ text: lesson.time || "No time" })] }),
                    new TableCell({ children: [new Paragraph({ text: lesson.content.substring(0, 200) + (lesson.content.length > 200 ? "..." : "") })] })
                  ]
                }))
              ]
            })
          ]
        }]
      });
      
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'lesson-plans.docx';
      link.click();
      URL.revokeObjectURL(url);
      
      toast.success("DOCX exported successfully!");
    } catch (err) {
      toast.error("Failed to export DOCX");
      console.error(err);
    }
  };

  const filteredLessonPlans = lessonPlans.filter(lesson => {
    const matchesSearch = lesson.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === "all" || lesson.subject === selectedSubject;
    const matchesClass = selectedClass === "all" || lesson.className === selectedClass;
    return matchesSearch && matchesSubject && matchesClass;
  });

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;
return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Lesson Plans</h1>
          <p className="text-sm sm:text-base text-gray-600">Create and manage your lesson plans</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={handleExportPDF} variant="outline" className="w-full sm:w-auto">
            <ApperIcon name="FileText" size={16} className="mr-2" />
            Export PDF
          </Button>
          <Button onClick={handleExportDOCX} variant="outline" className="w-full sm:w-auto">
            <ApperIcon name="FileText" size={16} className="mr-2" />
            Export DOCX
          </Button>
          <Button onClick={handleCreateLesson} className="w-full sm:w-auto">
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Create Lesson Plan
          </Button>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Lessons</p>
                <p className="text-2xl font-bold text-primary-600">{lessonPlans.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <ApperIcon name="BookOpen" size={24} className="text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-secondary-600">
                  {lessonPlans.filter(l => {
                    const lessonDate = new Date(l.date);
                    const now = new Date();
                    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
                    return lessonDate >= weekStart;
                  }).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
                <ApperIcon name="Calendar" size={24} className="text-secondary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Subjects</p>
                <p className="text-2xl font-bold text-accent-600">
                  {[...new Set(lessonPlans.map(l => l.subject))].length}
                </p>
              </div>
              <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center">
                <ApperIcon name="Layers" size={24} className="text-accent-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="Filter" size={20} className="text-primary-600" />
            Filter Lesson Plans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <SearchBar
              placeholder="Search lesson plans..."
              onSearch={setSearchTerm}
              className="sm:col-span-2 lg:col-span-1"
            />
            <Select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="all">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </Select>
            <Select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="all">All Classes</option>
              {classes.map(cls => (
                <option key={cls.Id} value={cls.name}>
                  {cls.name}
                </option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* View Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">View:</span>
              <div className="flex items-center gap-1 bg-gray-100 rounded-md p-1">
                <button
                  onClick={() => handleViewModeChange("card")}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    viewMode === "card" 
                      ? "bg-white text-gray-900 shadow-sm" 
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <ApperIcon name="Grid3X3" size={14} className="mr-1" />
                  Card
                </button>
                <button
                  onClick={() => handleViewModeChange("list")}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    viewMode === "list" 
                      ? "bg-white text-gray-900 shadow-sm" 
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <ApperIcon name="List" size={14} className="mr-1" />
                  List
                </button>
              </div>
            </div>
            
            {viewMode === "list" && (
              <div className="text-sm text-gray-600">
                {filteredLessonPlans.length} lesson plan(s) found
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions Toolbar - Only show in list view when items are selected */}
      {viewMode === "list" && selectedItems.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {selectedItems.length} selected
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleBulkDelete}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                >
                  <ApperIcon name="Trash2" size={14} className="mr-2" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lesson Plans Display */}
      {filteredLessonPlans.length === 0 ? (
        <Empty
          title="No lesson plans found"
          description="Create your first lesson plan to get started"
          actionLabel="Create Lesson Plan"
          icon="BookOpen"
          onAction={handleCreateLesson}
        />
      ) : (
        <>
          {viewMode === "card" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLessonPlans.map(lesson => (
                <Card key={lesson.Id} className="hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">{lesson.subject}</h3>
                        <p className="text-sm text-gray-600">{lesson.className}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditLesson(lesson)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <ApperIcon name="Edit" size={14} className="text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteLesson(lesson.Id)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <ApperIcon name="Trash2" size={14} className="text-red-600" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <ApperIcon name="Calendar" size={14} />
                        {lesson.date ? format(new Date(lesson.date), "MMM d, yyyy") : "No date"}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <ApperIcon name="Clock" size={14} />
                        {lesson.time || "No time"}
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                      {lesson.content.substring(0, 100)}...
                    </p>

                    <div className="flex justify-between items-center">
                      <Badge variant="primary">
                        {lesson.subject}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditLesson(lesson)}
                      >
                        <ApperIcon name="Eye" size={14} className="mr-1" />
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectedItems.length === filteredLessonPlans.length && filteredLessonPlans.length > 0}
                              onChange={handleSelectAll}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Select All
                            </span>
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subject
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Class
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Content
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredLessonPlans.map(lesson => (
                        <tr key={lesson.Id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(lesson.Id)}
                              onChange={() => handleSelectItem(lesson.Id)}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900">
                                {lesson.subject}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{lesson.className}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {lesson.date ? format(new Date(lesson.date), "MMM d, yyyy") : "No date"}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{lesson.time || "No time"}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-900 max-w-xs truncate">
                              {lesson.content.substring(0, 100)}...
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditLesson(lesson)}
                              >
                                <ApperIcon name="Edit" size={14} className="mr-1" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteLesson(lesson.Id)}
                                className="text-red-600 hover:bg-red-50"
                              >
                                <ApperIcon name="Trash2" size={14} className="mr-1" />
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Lesson Plan Modal */}
      <LessonPlanModal
        isOpen={showLessonModal}
        onClose={() => {
          setShowLessonModal(false);
          setSelectedLesson(null);
        }}
        lesson={selectedLesson}
        onSave={handleSaveLessonPlan}
      />
    </div>
  );
};

export default LessonPlans;