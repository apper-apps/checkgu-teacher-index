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
        loadData();
      } catch (err) {
        toast.error("Failed to delete lesson plan");
      }
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
        <Button onClick={handleCreateLesson} className="w-full sm:w-auto">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Create Lesson Plan
        </Button>
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

      {/* Lesson Plans List */}
      {filteredLessonPlans.length === 0 ? (
        <Empty
          title="No lesson plans found"
          description="Create your first lesson plan to get started"
          actionLabel="Create Lesson Plan"
          icon="BookOpen"
          onAction={handleCreateLesson}
        />
      ) : (
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