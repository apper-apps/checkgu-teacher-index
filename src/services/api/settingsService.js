// Mock settings service for academic calendar, school profile, and schedule preferences
const mockAcademicCalendar = {
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

const mockHolidays = [
  { Id: 1, name: "New Year's Day", date: "2025-01-01", description: "New Year celebration", isSchoolHoliday: true },
  { Id: 2, name: "Martin Luther King Jr. Day", date: "2025-01-20", description: "Federal holiday", isSchoolHoliday: true },
  { Id: 3, name: "Presidents' Day", date: "2025-02-17", description: "Federal holiday", isSchoolHoliday: true },
  { Id: 4, name: "Memorial Day", date: "2025-05-26", description: "Federal holiday", isSchoolHoliday: true },
  { Id: 5, name: "Independence Day", date: "2025-07-04", description: "Fourth of July", isSchoolHoliday: false },
  { Id: 6, name: "Labor Day", date: "2025-09-01", description: "Federal holiday", isSchoolHoliday: true },
  { Id: 7, name: "Thanksgiving", date: "2025-11-27", description: "Thanksgiving Day", isSchoolHoliday: true },
  { Id: 8, name: "Christmas Day", date: "2025-12-25", description: "Christmas celebration", isSchoolHoliday: true }
];

let nextHolidayId = 9;

const mockSchoolProfile = {
  name: "Greenwood Elementary School",
  type: "Public Elementary",
  address: "123 Education Lane, Springfield, ST 12345",
  phone: "+1 (555) 987-6543",
  email: "info@greenwood.edu",
  website: "www.greenwood.edu",
  logo: null,
  logoPreview: null
};

const mockSchedulePreferences = {
  numberOfLevels: 5,
  numberOfClasses: 2,
  defaultLessonDuration: 30,
  defaultGradeLevelName: "Grade",
  defaultWorkingHours: {
    start: "08:00",
end: "16:00"
  },
  gradeLevels: [
    { Id: 1, name: "Grade 1", numberOfClasses: 2 },
    { Id: 2, name: "Grade 2", numberOfClasses: 2 },
    { Id: 3, name: "Grade 3", numberOfClasses: 2 },
    { Id: 4, name: "Grade 4", numberOfClasses: 2 },
    { Id: 5, name: "Grade 5", numberOfClasses: 2 }
  ]
};
const mockDailySchedule = {
  Monday: { enabled: true, startTime: "08:00", endTime: "16:00" },
  Tuesday: { enabled: true, startTime: "08:00", endTime: "16:00" },
  Wednesday: { enabled: true, startTime: "08:00", endTime: "16:00" },
  Thursday: { enabled: true, startTime: "08:00", endTime: "16:00" },
  Friday: { enabled: true, startTime: "08:00", endTime: "16:00" }
};

const mockClassLevels = [
  { Id: 1, name: "Grade 1", description: "Elementary level - Age 6-7" },
  { Id: 2, name: "Grade 2", description: "Elementary level - Age 7-8" },
  { Id: 3, name: "Grade 3", description: "Elementary level - Age 8-9" },
  { Id: 4, name: "Grade 4", description: "Elementary level - Age 9-10" },
  { Id: 5, name: "Grade 5", description: "Elementary level - Age 10-11" },
  { Id: 6, name: "Grade 6", description: "Elementary level - Age 11-12" }
];

export const settingsService = {
  getAcademicCalendar: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...mockAcademicCalendar });
      }, 100);
    });
  },

  updateAcademicCalendar: async (calendarData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        Object.assign(mockAcademicCalendar, calendarData);
        resolve({ ...mockAcademicCalendar });
      }, 200);
    });
  },

  getSchoolProfile: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...mockSchoolProfile });
      }, 100);
    });
  },

  updateSchoolProfile: async (profileData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        Object.assign(mockSchoolProfile, profileData);
        resolve({ ...mockSchoolProfile });
      }, 200);
    });
  },

  getSchedulePreferences: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...mockSchedulePreferences });
      }, 100);
    });
  },

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
          
          // Validate default lesson duration if provided
          if (preferencesData.defaultLessonDuration) {
            const minutes = parseInt(preferencesData.defaultLessonDuration);
            if (isNaN(minutes) || minutes < 15 || minutes > 120) {
              reject(new Error("Lesson duration must be between 15 and 120 minutes"));
              return;
            }
          }

          // Validate default grade level name if provided
          if (preferencesData.defaultGradeLevelName) {
            const name = preferencesData.defaultGradeLevelName.trim();
            if (name.length === 0) {
              reject(new Error("Grade level name cannot be empty"));
              return;
            }
            if (name.length > 20) {
              reject(new Error("Grade level name must be 20 characters or less"));
              return;
            }
          }

          // Validate number of levels if provided
          if (preferencesData.numberOfLevels) {
            const levels = parseInt(preferencesData.numberOfLevels);
            if (isNaN(levels) || levels < 1 || levels > 12) {
              reject(new Error("Number of levels must be between 1 and 12"));
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
        // Trigger calendar update event
        if (typeof window !== 'undefined') {
          localStorage.setItem('academicCalendarUpdated', Date.now().toString());
        }
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
        // Trigger calendar update event
        if (typeof window !== 'undefined') {
          localStorage.setItem('academicCalendarUpdated', Date.now().toString());
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
  },

  // User Profile Management
  getUserProfile: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userProfile = {
          name: "Ms. Johnson",
          email: "sarah.johnson@greenwood.edu",
          phone: "+1 (555) 123-4567",
          role: "Teacher",
          department: "Elementary"
        };
        resolve({ ...userProfile });
      }, 100);
    });
  },

  updateUserProfile: async (profileData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Validate required fields
          if (!profileData.name || profileData.name.trim().length === 0) {
            reject(new Error("Name is required"));
            return;
          }

          if (!profileData.email || profileData.email.trim().length === 0) {
            reject(new Error("Email is required"));
            return;
          }

          // Validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(profileData.email.trim())) {
            reject(new Error("Invalid email format"));
            return;
          }

          // Validate name length
          if (profileData.name.trim().length > 100) {
            reject(new Error("Name must be 100 characters or less"));
            return;
          }

// Validate phone format if provided
          if (profileData.phone && profileData.phone.trim().length > 0) {
            const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
            const cleanPhone = profileData.phone.replace(/[\s\-()]/g, '');
            if (!phoneRegex.test(cleanPhone)) {
              reject(new Error("Invalid phone number format"));
              return;
            }
          }

          // Simulate successful update
          const updatedProfile = {
            name: profileData.name.trim(),
            email: profileData.email.trim().toLowerCase(),
            phone: profileData.phone?.trim() || "",
            role: profileData.role || "Teacher",
            department: profileData.department || "Elementary"
          };

          resolve(updatedProfile);
        } catch (error) {
          reject(error);
        }
      }, 200);
    });
  }
};