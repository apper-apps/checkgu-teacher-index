import studentData from "@/services/mockData/students.json";

let students = [...studentData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const studentService = {
  async getAll() {
    await delay(300);
    return [...students];
  },

  async getById(id) {
    await delay(200);
    const student = students.find(s => s.Id === parseInt(id));
    if (!student) {
      throw new Error("Student not found");
    }
    return { ...student };
  },

  async create(studentData) {
    await delay(400);
    const newStudent = {
      ...studentData,
      Id: Math.max(...students.map(s => s.Id), 0) + 1,
      attendanceRate: Math.floor(Math.random() * 20) + 80, // Random attendance 80-100%
      overallGrade: "B+"
    };
    students.push(newStudent);
    return { ...newStudent };
  },

  async update(id, studentData) {
    await delay(300);
    const index = students.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Student not found");
    }
    students[index] = { ...students[index], ...studentData };
    return { ...students[index] };
  },

  async delete(id) {
    await delay(200);
    const index = students.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Student not found");
    }
    students.splice(index, 1);
    return true;
  }
};