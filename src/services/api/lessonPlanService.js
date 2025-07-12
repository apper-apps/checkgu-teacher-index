import lessonPlanData from "@/services/mockData/lessonPlans.json";

let lessonPlans = [...lessonPlanData];

// Default categories for lesson plans
let categories = [
  { Id: 1, name: "Core Subjects", description: "Essential academic subjects" },
  { Id: 2, name: "Arts & Creativity", description: "Creative and artistic subjects" },
  { Id: 3, name: "Physical Education", description: "Sports and physical activities" },
  { Id: 4, name: "Language Arts", description: "Communication and literature" },
  { Id: 5, name: "STEM", description: "Science, Technology, Engineering, Math" }
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const lessonPlanService = {
  async getAll() {
    await delay(300);
    return [...lessonPlans];
  },

  async getById(id) {
    await delay(200);
    const lessonPlan = lessonPlans.find(lp => lp.Id === parseInt(id));
    if (!lessonPlan) {
      throw new Error("Lesson plan not found");
    }
    return { ...lessonPlan };
  },

  async create(lessonPlanData) {
    await delay(400);
    const newLessonPlan = {
      ...lessonPlanData,
      Id: Math.max(...lessonPlans.map(lp => lp.Id), 0) + 1
    };
    lessonPlans.push(newLessonPlan);
    return { ...newLessonPlan };
  },

  async update(id, lessonPlanData) {
    await delay(300);
    const index = lessonPlans.findIndex(lp => lp.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Lesson plan not found");
    }
    lessonPlans[index] = { ...lessonPlans[index], ...lessonPlanData };
    return { ...lessonPlans[index] };
  },

  async delete(id) {
    await delay(200);
    const index = lessonPlans.findIndex(lp => lp.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Lesson plan not found");
    }
    lessonPlans.splice(index, 1);
    return true;
  },

  // Category management
  async getCategories() {
    await delay(200);
    return [...categories];
  },

  async updateCategory(id, categoryData) {
    await delay(300);
    const index = categories.findIndex(cat => cat.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Category not found");
    }
    categories[index] = { ...categories[index], ...categoryData };
    return { ...categories[index] };
  },

  async deleteCategory(id) {
    await delay(200);
    const index = categories.findIndex(cat => cat.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Category not found");
    }
    categories.splice(index, 1);
    return true;
  },

  // Bulk operations
  async updateMultiple(ids, updateData) {
    await delay(400);
    const updatedPlans = [];
    for (const id of ids) {
      const index = lessonPlans.findIndex(lp => lp.Id === parseInt(id));
      if (index !== -1) {
        lessonPlans[index] = { ...lessonPlans[index], ...updateData };
        updatedPlans.push({ ...lessonPlans[index] });
      }
    }
    return updatedPlans;
  },

  async deleteMultiple(ids) {
    await delay(300);
    const deletedIds = [];
    for (const id of ids) {
      const index = lessonPlans.findIndex(lp => lp.Id === parseInt(id));
      if (index !== -1) {
        lessonPlans.splice(index, 1);
        deletedIds.push(parseInt(id));
      }
    }
    return deletedIds;
  }
};