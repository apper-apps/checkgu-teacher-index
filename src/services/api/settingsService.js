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
  defaultWorkingHours: {
    start: "08:00",
    end: "16:00"
  }
};

const mockDailySchedule = {
  Monday: { enabled: true, startTime: "08:00", endTime: "16:00" },
  Tuesday: { enabled: true, startTime: "08:00", endTime: "16:00" },
  Wednesday: { enabled: true, startTime: "08:00", endTime: "16:00" },
  Thursday: { enabled: true, startTime: "08:00", endTime: "16:00" },
  Friday: { enabled: true, startTime: "08:00", endTime: "15:00" }
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
    return new Promise((resolve) => {
      setTimeout(() => {
        Object.assign(mockSchedulePreferences, preferencesData);
        resolve({ ...mockSchedulePreferences });
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
  }
};