// Mock settings service for academic calendar, school profile, and schedule preferences
const mockAcademicCalendar = {
  termStart: "2025-02-17",
  termEnd: "2025-06-30",
  winterBreakStart: "2025-04-01",
  winterBreakEnd: "2025-04-15",
  springTermStart: "2025-04-16",
  springTermEnd: "2025-06-30",
  weekStartsOnSunday: false
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
  classPeriodMinutes: 45,
  breakDuration: 15,
  lunchDuration: 30,
  numberOfLevels: 5,
  numberOfClasses: 2,
  defaultLessonDuration: 30,
  defaultWorkingHours: {
    start: "08:00",
    end: "16:00"
  }
};

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
  }
};