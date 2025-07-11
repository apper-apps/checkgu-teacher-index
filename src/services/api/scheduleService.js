import scheduleData from "@/services/mockData/schedules.json";

let schedules = [...scheduleData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const scheduleService = {
  async getAll() {
    await delay(300);
    return [...schedules];
  },

  async getById(id) {
    await delay(200);
    const schedule = schedules.find(s => s.Id === parseInt(id));
    if (!schedule) {
      throw new Error("Schedule not found");
    }
    return { ...schedule };
  },

  async create(scheduleData) {
    await delay(400);
    const newSchedule = {
      ...scheduleData,
      Id: Math.max(...schedules.map(s => s.Id), 0) + 1
    };
    schedules.push(newSchedule);
    return { ...newSchedule };
  },

  async update(id, scheduleData) {
    await delay(300);
    const index = schedules.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Schedule not found");
    }
    schedules[index] = { ...schedules[index], ...scheduleData };
    return { ...schedules[index] };
  },

  async delete(id) {
    await delay(200);
    const index = schedules.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Schedule not found");
    }
schedules.splice(index, 1);
    return true;
  },

  async getByWeek(weekStart) {
    await delay(300);
    // For now, return all schedules as we don't have date-specific data
    // In a real app, you would filter by the actual week dates
    return [...schedules];
  }
};