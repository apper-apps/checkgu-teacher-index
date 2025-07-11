// Mock settings service for academic calendar data
const mockAcademicCalendar = {
  termStart: "2025-02-17",
  termEnd: "2025-06-30",
  winterBreakStart: "2025-04-01",
  winterBreakEnd: "2025-04-15",
  springTermStart: "2025-04-16",
  springTermEnd: "2025-06-30"
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
  }
};