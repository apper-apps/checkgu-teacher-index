import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Textarea from "@/components/atoms/Textarea";
import Input from "@/components/atoms/Input";
import FormField from "@/components/molecules/FormField";
import { settingsService } from "@/services/api/settingsService";

const LessonPlanModal = ({ isOpen, onClose, lesson, onSave }) => {
  const [formData, setFormData] = useState({
    subject: "",
    className: "",
    date: "",
    time: "",
    content: "",
    objectives: "",
    materials: "",
    assessment: "",
  });

  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

useEffect(() => {
    loadSubjectsAndClasses();
  }, []);

  useEffect(() => {
    if (lesson) {
      setFormData({
        subject: lesson.subject || "",
        className: lesson.className || "",
        date: lesson.date || "",
        time: lesson.time || "",
        content: lesson.content || "",
        objectives: lesson.objectives || "",
        materials: lesson.materials || "",
        assessment: lesson.assessment || "",
      });
    }
  }, [lesson]);

  const loadSubjectsAndClasses = async () => {
    try {
      setLoading(true);
      setError(null);
      const [subjectsData, classesData] = await Promise.all([
        settingsService.getSubjects(),
        settingsService.getClasses()
      ]);
      setSubjects(subjectsData);
      setClasses(classesData);
    } catch (err) {
      setError("Failed to load subjects and classes");
      toast.error("Failed to load form data");
    } finally {
      setLoading(false);
}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await onSave(formData);
      toast.success("Lesson plan saved successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to save lesson plan");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ApperIcon name="BookOpen" size={24} className="text-primary-600" />
                {lesson ? "Edit Lesson Plan" : "Create Lesson Plan"}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <ApperIcon name="X" size={20} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
{error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Subject">
                  <Select
                    value={formData.subject}
                    onChange={(e) => handleChange("subject", e.target.value)}
                    required
disabled={loading}
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((subject) => (
                      <option key={subject.Id} value={subject.name}>
                        {subject.name}
                      </option>
                    ))}
                  </Select>
                </FormField>
<FormField label="Class">
                  <Select
                    value={formData.className}
                    onChange={(e) => handleChange("className", e.target.value)}
                    required
                    disabled={loading}
                  >
                    <option value="">Select Class</option>
                    {classes.map((classItem) => (
                      <option key={classItem.Id} value={classItem.name}>
                        {classItem.name}
                      </option>
                    ))}
                  </Select>
                </FormField>
                <FormField label="Date">
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange("date", e.target.value)}
                    required
                  />
                </FormField>
                <FormField label="Time">
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleChange("time", e.target.value)}
                    required
                  />
                </FormField>
              </div>

              <FormField label="Learning Objectives">
                <Textarea
                  value={formData.objectives}
                  onChange={(e) => handleChange("objectives", e.target.value)}
                  placeholder="What will students learn in this lesson?"
                  rows={3}
                />
              </FormField>

              <FormField label="Lesson Content">
                <Textarea
                  value={formData.content}
                  onChange={(e) => handleChange("content", e.target.value)}
                  placeholder="Detailed lesson content and activities..."
                  rows={6}
                  required
                />
              </FormField>

              <FormField label="Materials Needed">
                <Textarea
                  value={formData.materials}
                  onChange={(e) => handleChange("materials", e.target.value)}
                  placeholder="List of materials, resources, and equipment needed..."
                  rows={3}
                />
              </FormField>

              <FormField label="Assessment Method">
                <Textarea
                  value={formData.assessment}
                  onChange={(e) => handleChange("assessment", e.target.value)}
                  placeholder="How will you assess student understanding?"
                  rows={3}
                />
              </FormField>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  <ApperIcon name="Save" size={18} className="mr-2" />
                  Save Lesson Plan
                </Button>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LessonPlanModal;