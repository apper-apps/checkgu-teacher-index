import { differenceInWeeks, startOfWeek, parseISO } from 'date-fns';

export const calculateAcademicWeek = (currentDate, termStartDate) => {
  if (!termStartDate) return null;
  
  try {
    const termStart = typeof termStartDate === 'string' ? parseISO(termStartDate) : termStartDate;
    const current = typeof currentDate === 'string' ? parseISO(currentDate) : currentDate;
    
    // Get the start of the week for both dates (Monday as first day)
    const termStartWeek = startOfWeek(termStart, { weekStartsOn: 1 });
    const currentWeek = startOfWeek(current, { weekStartsOn: 1 });
    
    // Calculate the difference in weeks
    const weeksDiff = differenceInWeeks(currentWeek, termStartWeek);
    
    // Academic weeks start from 1
    return weeksDiff + 1;
  } catch (error) {
    console.error('Error calculating academic week:', error);
    return null;
  }
};