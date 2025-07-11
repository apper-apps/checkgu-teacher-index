import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSave(formData);
      toast.success("Lesson plan saved successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to save lesson plan");
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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Subject">
                  <Select
                    value={formData.subject}
                    onChange={(e) => handleChange("subject", e.target.value)}
                    required
                  >
                    <option value="">Select Subject</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="English">English</option>
                    <option value="Science">Science</option>
                    <option value="History">History</option>
                    <option value="Geography">Geography</option>
                    <option value="Art">Art</option>
                    <option value="Physical Education">Physical Education</option>
                    <option value="Music">Music</option>
                  </Select>
                </FormField>
                <FormField label="Class">
                  <Select
                    value={formData.className}
                    onChange={(e) => handleChange("className", e.target.value)}
                    required
                  >
                    <option value="">Select Class</option>
                    <option value="1A">1A</option>
                    <option value="1B">1B</option>
                    <option value="2A">2A</option>
                    <option value="2B">2B</option>
                    <option value="3A">3A</option>
                    <option value="3B">3B</option>
                    <option value="4A">4A</option>
                    <option value="4B">4B</option>
                    <option value="5A">5A</option>
                    <option value="5B">5B</option>
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