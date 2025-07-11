import classData from "@/services/mockData/classes.json";

let classes = [...classData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const classService = {
  async getAll() {
    await delay(300);
    return [...classes];
  },

  async getById(id) {
    await delay(200);
    const classItem = classes.find(c => c.Id === parseInt(id));
    if (!classItem) {
      throw new Error("Class not found");
    }
    return { ...classItem };
  },

  async create(classData) {
    await delay(400);
    const newClass = {
      ...classData,
      Id: Math.max(...classes.map(c => c.Id), 0) + 1
    };
    classes.push(newClass);
    return { ...newClass };
  },

  async update(id, classData) {
    await delay(300);
    const index = classes.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Class not found");
    }
    classes[index] = { ...classes[index], ...classData };
    return { ...classes[index] };
  },

  async delete(id) {
    await delay(200);
    const index = classes.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Class not found");
    }
    classes.splice(index, 1);
    return true;
  }
};