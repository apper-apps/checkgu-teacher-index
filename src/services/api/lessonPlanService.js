import lessonPlanData from "@/services/mockData/lessonPlans.json";

let lessonPlans = [...lessonPlanData];

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
  }
};