import { differenceInWeeks, startOfWeek, parseISO } from 'date-fns';

export const calculateAcademicWeek = (currentDate, termStartDate, weekStartsOnSunday = false) => {
  if (!termStartDate) return null;
  
  try {
    const termStart = typeof termStartDate === 'string' ? parseISO(termStartDate) : termStartDate;
    const current = typeof currentDate === 'string' ? parseISO(currentDate) : currentDate;
    
    // Get the start of the week for both dates (configurable first day)
    const weekStartsOn = weekStartsOnSunday ? 0 : 1; // 0 = Sunday, 1 = Monday
    const termStartWeek = startOfWeek(termStart, { weekStartsOn });
    const currentWeek = startOfWeek(current, { weekStartsOn });
    
    // Calculate the difference in weeks
    const weeksDiff = differenceInWeeks(currentWeek, termStartWeek);
    
    // Academic weeks start from 1
    return weeksDiff + 1;
  } catch (error) {
    console.error('Error calculating academic week:', error);
    return null;
  }
};