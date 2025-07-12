import { toast } from "react-toastify";
import subjectsData from "@/services/mockData/subjects.json";
import React from "react";
import Error from "@/components/ui/Error";
import classesData from "@/services/mockData/classes.json";

// Mock data for settings
let academicCalendar = {
  termStart: "2025-02-17",
  termEnd: "2025-06-30",
  winterBreakStart: "2025-04-01",
  winterBreakEnd: "2025-04-15",
  springTermStart: "2025-04-16",
  springTermEnd: "2025-06-30",
  weekStartsOnSunday: false,
  breaks: [
    { Id: 1, name: "Winter Break", startDate: "2025-04-01", endDate: "2025-04-15" },
    { Id: 2, name: "Spring Break", startDate: "2025-03-15", endDate: "2025-03-22" }
  ]
};

let dailySchedule = {
  Monday: { enabled: true, startTime: "08:00", endTime: "15:30" },
  Tuesday: { enabled: true, startTime: "08:00", endTime: "15:30" },
  Wednesday: { enabled: true, startTime: "08:00", endTime: "15:30" },
  Thursday: { enabled: true, startTime: "08:00", endTime: "15:30" },
  Friday: { enabled: true, startTime: "08:00", endTime: "15:30" },
  Saturday: { enabled: false, startTime: "08:00", endTime: "12:00" },
  Sunday: { enabled: false, startTime: "08:00", endTime: "12:00" }
};

let schedulePreferences = {
  classPeriodMinutes: 45,
  breakMinutes: 15,
  lunchBreakMinutes: 60,
  timeFormat: "12hour"
};

let schoolProfile = {
  name: "Greenwood Elementary School",
  type: "Public Elementary",
  address: "123 Education Lane, Springfield, ST 12345",
  phone: "+1 (555) 987-6543",
  email: "info@greenwood.edu",
  website: "www.greenwood.edu",
  logo: null
};

let notificationPreferences = {
  classReminders: true,
  processingComplete: true,
  systemUpdates: false
};

// Data management - subjects and classes
let subjects = [...subjectsData];
let classes = [...classesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const settingsService = {
  // Academic Calendar Methods
  async getAcademicCalendar() {
    await delay(300);
    return { ...academicCalendar };
  },

  async updateAcademicCalendar(calendar) {
    await delay(400);
    academicCalendar = { ...calendar };
    return { ...academicCalendar };
  },

  // Daily Schedule Methods
  async getDailySchedule() {
    await delay(200);
    return { ...dailySchedule };
  },

  async updateDailySchedule(schedule) {
    await delay(300);
    dailySchedule = { ...schedule };
    return { ...dailySchedule };
  },

  // Schedule Preferences Methods
  async getSchedulePreferences() {
    await delay(200);
    return { ...schedulePreferences };
  },

  async updateSchedulePreferences(preferences) {
    await delay(300);
    schedulePreferences = { ...preferences };
    return { ...schedulePreferences };
  },

  // School Profile Methods
  async getSchoolProfile() {
    await delay(200);
    return { ...schoolProfile };
  },

  async updateSchoolProfile(profile) {
    await delay(300);
    schoolProfile = { ...profile };
    return { ...schoolProfile };
  },

  // Notification Preferences Methods
  async getNotificationPreferences() {
    await delay(200);
    return { ...notificationPreferences };
},

  async updateNotificationPreferences(preferences) {
    await delay(300);
    notificationPreferences = { ...preferences };
    return { ...notificationPreferences };
  },

  // Subject Management Methods
  async getSubjects() {
    await delay(300);
    return [...subjects];
  },

  async getSubjectById(id) {
    await delay(200);
    const subject = subjects.find(s => s.Id === parseInt(id));
    if (!subject) {
      throw new Error("Subject not found");
    }
    return { ...subject };
  },

  async createSubject(subjectData) {
    await delay(400);
    const newSubject = {
      ...subjectData,
      Id: Math.max(...subjects.map(s => s.Id), 0) + 1
    };
    subjects.push(newSubject);
    return { ...newSubject };
  },

  async updateSubject(id, subjectData) {
    await delay(300);
    const index = subjects.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Subject not found");
    }
    subjects[index] = { ...subjects[index], ...subjectData };
    return { ...subjects[index] };
  },

  async deleteSubject(id) {
    await delay(200);
    const index = subjects.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Subject not found");
    }
    subjects.splice(index, 1);
    return true;
  },

  // Class Management Methods
  async getClasses() {
    await delay(300);
    return [...classes];
  },

  async getClassById(id) {
    await delay(200);
    const classItem = classes.find(c => c.Id === parseInt(id));
    if (!classItem) {
      throw new Error("Class not found");
    }
    return { ...classItem };
  },

  async createClass(classData) {
    await delay(400);
    const newClass = {
      ...classData,
      Id: Math.max(...classes.map(c => c.Id), 0) + 1
    };
    classes.push(newClass);
    return { ...newClass };
  },

  async updateClass(id, classData) {
    await delay(300);
    const index = classes.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Class not found");
    }
    classes[index] = { ...classes[index], ...classData };
    return { ...classes[index] };
  },

async deleteClass(id) {
    await delay(200);
    const index = classes.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Class not found");
    }
    classes.splice(index, 1);
    return true;
  },

  // Holiday Management Methods
  async getHolidays() {
    await delay(200);
    return [...mockHolidays];
  },

  async addHoliday(holidayData) {
    await delay(400);
    const newHoliday = { 
      ...holidayData, 
      Id: nextHolidayId++,
      isSchoolHoliday: holidayData.isSchoolHoliday || false
    };
    mockHolidays.push(newHoliday);
    return { ...newHoliday };
  },

  async updateHoliday(id, holidayData) {
    await delay(300);
    const index = mockHolidays.findIndex(h => h.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Holiday not found");
    }
    mockHolidays[index] = { ...mockHolidays[index], ...holidayData };
    return { ...mockHolidays[index] };
  },

  async deleteHoliday(id) {
    await delay(200);
    const index = mockHolidays.findIndex(h => h.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Holiday not found");
    }
    mockHolidays.splice(index, 1);
    return true;
  },

  async addMultipleHolidays(holidaysData) {
    await delay(400);
    const newHolidays = holidaysData.map(holiday => ({
      ...holiday,
      Id: nextHolidayId++,
      isSchoolHoliday: holiday.isSchoolHoliday || false
    }));
    mockHolidays.push(...newHolidays);
    return [...newHolidays];
  },

  async toggleSchoolHoliday(id) {
    await delay(300);
    const index = mockHolidays.findIndex(h => h.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Holiday not found");
    }
    mockHolidays[index].isSchoolHoliday = !mockHolidays[index].isSchoolHoliday;
    return { ...mockHolidays[index] };
  },

  async toggleSchoolHolidays(ids) {
    await delay(300);
    const updatedHolidays = [];
    ids.forEach(id => {
      const index = mockHolidays.findIndex(h => h.Id === parseInt(id));
      if (index !== -1) {
        mockHolidays[index].isSchoolHoliday = !mockHolidays[index].isSchoolHoliday;
        updatedHolidays.push({ ...mockHolidays[index] });
      }
    });
    return updatedHolidays;
  },

  async processCSV(csvData) {
    await delay(400);
    try {
      const lines = csvData.trim().split('\n');
      const holidays = [];
      
      for (const line of lines) {
        const [name, date, description, isSchoolHoliday] = line.split(',');
        
        if (!name || !date) {
          continue;
        }
        
        // Validate date format
        const dateObj = new Date(date.trim());
        if (isNaN(dateObj.getTime())) {
          continue;
        }
        
        holidays.push({
          name: name.trim(),
          date: date.trim(),
          description: description?.trim() || '',
          isSchoolHoliday: isSchoolHoliday?.trim().toLowerCase() === 'true'
        });
      }
      
      if (holidays.length === 0) {
        return { success: false, error: 'No valid holidays found in CSV' };
      }
      
      const newHolidays = holidays.map(holiday => ({
        ...holiday,
        Id: nextHolidayId++
      }));
      
      mockHolidays.push(...newHolidays);
      return { success: true, holidays: [...newHolidays] };
    } catch (error) {
      return { success: false, error: 'Invalid CSV format' };
    }
  }
};

// Additional mock data for extended functionality
let mockSchedulePreferences = { ...schedulePreferences };
let mockDailySchedule = { ...dailySchedule };
let mockAcademicCalendar = { ...academicCalendar };
let mockClassLevels = [
  { Id: 1, name: "Grade 1", description: "First Grade" },
  { Id: 2, name: "Grade 2", description: "Second Grade" },
  { Id: 3, name: "Grade 3", description: "Third Grade" },
  { Id: 4, name: "Grade 4", description: "Fourth Grade" },
  { Id: 5, name: "Grade 5", description: "Fifth Grade" }
];

let mockHolidays = [
  { Id: 1, name: "New Year's Day", date: "2025-01-01", description: "New Year Holiday", isSchoolHoliday: true },
  { Id: 2, name: "Independence Day", date: "2025-07-04", description: "National Holiday", isSchoolHoliday: true },
  { Id: 3, name: "Christmas Day", date: "2025-12-25", description: "Christmas Holiday", isSchoolHoliday: true }
];

let nextHolidayId = 4;

// Extended settings service with additional methods
export const extendedSettingsService = {
  updateSchedulePreferences: async (preferencesData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Validate default working hours if provided
          if (preferencesData.defaultWorkingHours) {
            const { start, end } = preferencesData.defaultWorkingHours;
            if (start && end) {
              const startTime = new Date(`2000-01-01T${start}:00`);
              const endTime = new Date(`2000-01-01T${end}:00`);
              if (startTime >= endTime) {
                reject(new Error("Start time must be before end time"));
                return;
              }
            }
          }
          
          // Validate class period minutes if provided
          if (preferencesData.classPeriodMinutes) {
            const minutes = parseInt(preferencesData.classPeriodMinutes);
            if (isNaN(minutes) || minutes < 15 || minutes > 120) {
              reject(new Error("Class period must be between 15 and 120 minutes"));
              return;
            }
          }
          
          Object.assign(mockSchedulePreferences, preferencesData);
          resolve({ ...mockSchedulePreferences });
        } catch (error) {
          reject(error);
        }
      }, 200);
    });
  },

  getDailySchedule: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...mockDailySchedule });
      }, 100);
    });
  },

  updateDailySchedule: async (scheduleData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        Object.assign(mockDailySchedule, scheduleData);
        resolve({ ...mockDailySchedule });
      }, 200);
    });
  },

  getClassLevels: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockClassLevels]);
      }, 100);
    });
  },

  updateClassLevels: async (levelsData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockClassLevels.length = 0;
        mockClassLevels.push(...levelsData);
        resolve([...mockClassLevels]);
      }, 200);
    });
  },

  getSchoolBreaks: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockAcademicCalendar.breaks]);
      }, 100);
    });
  },

  updateSchoolBreaks: async (breaksData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockAcademicCalendar.breaks = [...breaksData];
        resolve([...mockAcademicCalendar.breaks]);
      }, 200);
    });
  },

  addSchoolBreak: async (breakData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newBreak = { ...breakData, Id: Math.max(...mockAcademicCalendar.breaks.map(b => b.Id), 0) + 1 };
        mockAcademicCalendar.breaks.push(newBreak);
        resolve(newBreak);
      }, 200);
    });
  },

  deleteSchoolBreak: async (breakId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockAcademicCalendar.breaks.findIndex(b => b.Id === breakId);
        if (index !== -1) {
          mockAcademicCalendar.breaks.splice(index, 1);
        }
        resolve(true);
      }, 200);
    });
  },

  // Holiday Management Methods
  getHolidays: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockHolidays]);
      }, 200);
    });
  },

  addHoliday: async (holidayData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newHoliday = { 
          ...holidayData, 
          Id: nextHolidayId++,
          isSchoolHoliday: holidayData.isSchoolHoliday || false
        };
        mockHolidays.push(newHoliday);
        resolve(newHoliday);
      }, 200);
    });
  },

  updateHoliday: async (id, holidayData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockHolidays.findIndex(h => h.Id === id);
        if (index !== -1) {
          mockHolidays[index] = { ...mockHolidays[index], ...holidayData };
          resolve(mockHolidays[index]);
        }
      }, 200);
    });
  },

  deleteHoliday: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockHolidays.findIndex(h => h.Id === id);
        if (index !== -1) {
          mockHolidays.splice(index, 1);
        }
        resolve(true);
      }, 200);
    });
  },

  addMultipleHolidays: async (holidaysData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newHolidays = holidaysData.map(holiday => ({
          ...holiday,
          Id: nextHolidayId++,
          isSchoolHoliday: holiday.isSchoolHoliday || false
        }));
        mockHolidays.push(...newHolidays);
        resolve(newHolidays);
      }, 200);
    });
  },

  toggleSchoolHoliday: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockHolidays.findIndex(h => h.Id === id);
        if (index !== -1) {
          mockHolidays[index].isSchoolHoliday = !mockHolidays[index].isSchoolHoliday;
          resolve(mockHolidays[index]);
        }
      }, 200);
    });
  },

  toggleSchoolHolidays: async (ids) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedHolidays = [];
        ids.forEach(id => {
          const index = mockHolidays.findIndex(h => h.Id === id);
          if (index !== -1) {
            mockHolidays[index].isSchoolHoliday = !mockHolidays[index].isSchoolHoliday;
            updatedHolidays.push(mockHolidays[index]);
          }
        });
        resolve(updatedHolidays);
      }, 200);
    });
  },

  processCSV: async (csvData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const lines = csvData.trim().split('\n');
          const holidays = [];
          
          for (const line of lines) {
            const [name, date, description, isSchoolHoliday] = line.split(',');
            
            if (!name || !date) {
              continue;
            }
            
            // Validate date format
            const dateObj = new Date(date.trim());
            if (isNaN(dateObj.getTime())) {
              continue;
            }
            
            holidays.push({
              name: name.trim(),
              date: date.trim(),
              description: description?.trim() || '',
              isSchoolHoliday: isSchoolHoliday?.trim().toLowerCase() === 'true'
            });
          }
          
          if (holidays.length === 0) {
            resolve({ success: false, error: 'No valid holidays found in CSV' });
            return;
          }
          
          const newHolidays = holidays.map(holiday => ({
            ...holiday,
            Id: nextHolidayId++
          }));
          
          mockHolidays.push(...newHolidays);
          resolve({ success: true, holidays: newHolidays });
        } catch (error) {
          resolve({ success: false, error: 'Invalid CSV format' });
        }
      }, 200);
    });
  },

  updateNotificationPreferences: async (preferencesData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...preferencesData });
      }, 200);
    });
  }
};