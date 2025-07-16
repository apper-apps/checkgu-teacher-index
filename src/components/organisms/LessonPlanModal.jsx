import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import FormField from "@/components/molecules/FormField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { lessonPlanService } from "@/services/api/lessonPlanService";

const LessonPlanModal = ({ isOpen, onClose, lesson, onSave, mode = "single" }) => {
  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    className: "",
    date: "",
    time: "",
    content: "",
    objectives: "",
    materials: "",
    assessment: "",
    iconUrl: "",
  });
  
  const [iconPreview, setIconPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedLessons, setSelectedLessons] = useState([]);
  const [lessonPlans, setLessonPlans] = useState([]);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (lesson) {
      setFormData({
        subject: lesson.subject || "",
        category: lesson.category || "",
        className: lesson.className || "",
        date: lesson.date || "",
        time: lesson.time || "",
        content: lesson.content || "",
        objectives: lesson.objectives || "",
        materials: lesson.materials || "",
        assessment: lesson.assessment || "",
        iconUrl: lesson.iconUrl || "",
      });
      setIconPreview(lesson.iconUrl || null);
    }
  }, [lesson]);

  useEffect(() => {
    if (isOpen && mode === "bulk") {
      loadData();
    }
  }, [isOpen, mode]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [categoriesData, lessonsData] = await Promise.all([
        lessonPlanService.getCategories(),
        lessonPlanService.getAll()
      ]);
      setCategories(categoriesData);
      setLessonPlans(lessonsData);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "bulk" && selectedLessons.length > 0) {
        await lessonPlanService.updateMultiple(selectedLessons, {
          category: formData.category
        });
        toast.success(`Updated ${selectedLessons.length} lesson plans successfully!`);
      } else {
        await onSave(formData);
        toast.success("Lesson plan saved successfully!");
      }
      onClose();
    } catch (error) {
      toast.error("Failed to save lesson plan");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedLessons.length === 0) {
      toast.warning("Please select lessons to delete");
      return;
    }

    if (confirm(`Are you sure you want to delete ${selectedLessons.length} lesson plan(s)?`)) {
      try {
        await lessonPlanService.deleteMultiple(selectedLessons);
        toast.success(`Deleted ${selectedLessons.length} lesson plans successfully!`);
        setSelectedLessons([]);
        await loadData();
      } catch (error) {
        toast.error("Failed to delete lesson plans");
      }
    }
  };

  const handleCategoryEdit = async (categoryData) => {
    try {
      await lessonPlanService.updateCategory(categoryToEdit.Id, categoryData);
      toast.success("Category updated successfully!");
      setIsEditingCategory(false);
      setCategoryToEdit(null);
      await loadData();
    } catch (error) {
      toast.error("Failed to update category");
    }
  };

  const handleCategoryDelete = async (categoryId) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await lessonPlanService.deleteCategory(categoryId);
        toast.success("Category deleted successfully!");
        await loadData();
      } catch (error) {
        toast.error("Failed to delete category");
      }
    }
  };

const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        setIconPreview(dataUrl);
        setFormData(prev => ({
          ...prev,
          iconUrl: dataUrl
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveIcon = () => {
    setIconPreview(null);
    setFormData(prev => ({
      ...prev,
      iconUrl: ""
    }));
  };

const toggleLessonSelection = (lessonId) => {
    setSelectedLessons(prev =>
      prev.includes(lessonId)
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  if (!isOpen) return null;

  if (mode === "bulk") {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ApperIcon name="Settings" size={24} className="text-primary-600" />
                  Manage Subjects and Categories
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <ApperIcon name="Loader2" size={24} className="animate-spin" />
                  <span className="ml-2">Loading...</span>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Category Management Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <ApperIcon name="Tag" size={20} />
                      Categories
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      {categories.map(category => (
                        <div key={category.Id} className="p-4 border rounded-lg bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{category.name}</h4>
                              <p className="text-sm text-gray-600">{category.description}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setCategoryToEdit(category);
                                  setIsEditingCategory(true);
                                }}
                              >
                                <ApperIcon name="Edit" size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCategoryDelete(category.Id)}
                              >
                                <ApperIcon name="Trash2" size={16} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Lesson Selection Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <ApperIcon name="BookOpen" size={20} />
                      Lesson Plans ({lessonPlans.length})
                    </h3>
                    <div className="mb-4">
                      <FormField label="Update Category for Selected Lessons">
                        <Select
                          value={formData.category}
                          onChange={(e) => handleChange("category", e.target.value)}
                        >
                          <option value="">Select Category</option>
                          {categories.map(category => (
                            <option key={category.Id} value={category.name}>
                              {category.name}
                            </option>
                          ))}
                        </Select>
                      </FormField>
                    </div>
                    <div className="max-h-64 overflow-y-auto border rounded-lg">
                      {lessonPlans.map(lessonPlan => (
                        <div
                          key={lessonPlan.Id}
                          className={`p-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 ${
                            selectedLessons.includes(lessonPlan.Id) ? 'bg-blue-50 border-blue-200' : ''
                          }`}
                          onClick={() => toggleLessonSelection(lessonPlan.Id)}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={selectedLessons.includes(lessonPlan.Id)}
                              onChange={() => toggleLessonSelection(lessonPlan.Id)}
                              className="rounded"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{lessonPlan.subject}</span>
                                <span className="text-sm px-2 py-1 bg-gray-200 rounded">
                                  {lessonPlan.category}
                                </span>
                              </div>
                              <div className="text-sm text-gray-600">
                                {lessonPlan.className} • {lessonPlan.date} at {lessonPlan.time}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      disabled={selectedLessons.length === 0 || !formData.category}
                      className="flex-1"
                    >
                      <ApperIcon name="Save" size={18} className="mr-2" />
                      Update Selected ({selectedLessons.length})
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBulkDelete}
                      disabled={selectedLessons.length === 0}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <ApperIcon name="Trash2" size={18} className="mr-2" />
                      Delete Selected
                    </Button>
                    <Button type="button" variant="outline" onClick={onClose}>
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Category Edit Modal */}
        {isEditingCategory && categoryToEdit && (
          <CategoryEditModal
            category={categoryToEdit}
            onSave={handleCategoryEdit}
            onClose={() => {
              setIsEditingCategory(false);
              setCategoryToEdit(null);
            }}
          />
        )}
      </div>
    );
  }

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
                <div className="md:col-span-2">
                  <FormField label="Subject">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
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
                      </div>
                      <div className="flex items-center gap-2">
                        {iconPreview ? (
                          <div className="relative">
                            <img 
                              src={iconPreview} 
                              alt="Subject icon" 
                              className="w-12 h-12 object-cover rounded-lg border-2 border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={handleRemoveIcon}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              <ApperIcon name="X" size={10} />
                            </button>
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                            <ApperIcon name="Image" size={20} className="text-gray-400" />
                          </div>
                        )}
                        <div className="flex flex-col gap-1">
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                            <Button type="button" variant="outline" size="sm">
                              <ApperIcon name="Upload" size={14} className="mr-1" />
                              {iconPreview ? "Change" : "Upload"}
                            </Button>
                          </label>
                          <p className="text-xs text-gray-500">Icon/Image</p>
                        </div>
                      </div>
                    </div>
                  </FormField>
                </div>
<FormField label="Category">
                  <Select
                    value={formData.category}
                    onChange={(e) => handleChange("category", e.target.value)}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Core Subjects">Core Subjects</option>
                    <option value="Arts & Creativity">Arts & Creativity</option>
                    <option value="Physical Education">Physical Education</option>
                    <option value="Language Arts">Language Arts</option>
                    <option value="STEM">STEM</option>
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

// Category Edit Modal Component
const CategoryEditModal = ({ category, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: category?.name || "",
    description: category?.description || ""
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (formData.name.trim().length > 50) {
      newErrors.name = "Name must be less than 50 characters";
    }
    
    if (formData.description && formData.description.length > 200) {
      newErrors.description = "Description must be less than 200 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSave({
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim()
      });
      toast.success("Category saved successfully");
    } catch (error) {
      toast.error("Failed to save category");
      console.error("Category save error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ApperIcon name="Edit" size={20} className="text-primary-600" />
                Edit Category
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
                <ApperIcon name="X" size={16} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <FormField 
                label="Category Name" 
                error={errors.name}
                required
              >
                <Input
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter category name"
                  error={!!errors.name}
                  disabled={isSubmitting}
                  maxLength={50}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  aria-invalid={!!errors.name}
                />
              </FormField>
              <FormField 
                label="Description"
                error={errors.description}
              >
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Enter category description"
                  rows={3}
                  error={!!errors.description}
                  disabled={isSubmitting}
                  maxLength={200}
                  aria-describedby={errors.description ? "description-error" : undefined}
                  aria-invalid={!!errors.description}
                />
              </FormField>
              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1" 
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  <ApperIcon name="Save" size={16} className="mr-2" />
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose}
                  disabled={isSubmitting}
                >
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