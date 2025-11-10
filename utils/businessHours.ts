
// Helper function to convert time string (e.g., "11:00 AM") to minutes since midnight
const parseTime = (timeStr: string): number => {
  const [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
};

// Check if a location is currently open based on its hours
export const isLocationOpen = (
  hours?: Record<string, { open: string; close: string } | string>
): { isOpen: boolean; status: string } => {
  if (!hours) {
    return { isOpen: true, status: '' }; // No hours info, assume open
  }

  const now = new Date();
  const dayName = now
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toLowerCase();

  const todayHours = hours[dayName];
  if (!todayHours) {
    return { isOpen: false, status: 'Closed' };
  }

  // Handle string values like "closed"
  if (typeof todayHours === 'string') {
    return { isOpen: false, status: todayHours.charAt(0).toUpperCase() + todayHours.slice(1).toLowerCase() };
  }

  const { open, close } = todayHours;

  // Check if open 24 hours (open time equals close time)
  if (open === close) {
    return { isOpen: true, status: 'Open 24h' };
  }

  // Parse times
  const openTime = parseTime(open);
  const closeTime = parseTime(close);
  const currentTime = now.getHours() * 60 + now.getMinutes();

  // Handle case where close time is earlier than open time (overnight hours)
  let isOpen: boolean;
  if (closeTime <= openTime) {
    isOpen = currentTime >= openTime || currentTime < closeTime;
  } else {
    isOpen = currentTime >= openTime && currentTime < closeTime;
  }

  const statusText = isOpen ? 'Open' : 'Closed';
  return { isOpen, status: statusText };
};

// Format when the location will be open next
export const formatNextOpenTime = (hours?: Record<string, { open: string; close: string } | string>): string => {
  if (!hours) return 'Hours not available';
  
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  
  const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayDisplayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Check if currently open
  const todayHours = hours[dayName];
  if (todayHours && typeof todayHours === 'object' && 'open' in todayHours && 'close' in todayHours && todayHours.open && todayHours.close) {
    const openTime = parseTime(todayHours.open);
    const closeTime = parseTime(todayHours.close);
    
    // Check if open 24 hours
    if (openTime === closeTime) {
      return 'Open 24 hours';
    }
    
    // Check if currently open
    let isOpen = false;
    if (closeTime <= openTime) {
      // Overnight hours
      isOpen = currentTime >= openTime || currentTime < closeTime;
    } else {
      isOpen = currentTime >= openTime && currentTime < closeTime;
    }
    
    if (isOpen) {
      // Format close time (times are already in 12-hour format from API)
      const closeTimeStr = todayHours.close;
      const [time, period] = closeTimeStr.split(' ');
      const displayTime = `${time} ${period.toLowerCase()}`;
      return `Open until ${displayTime}`;
    }
    
    // If closed today but opens later today
    if (currentTime < openTime) {
      // Format open time (times are already in 12-hour format from API)
      const [time, period] = todayHours.open.split(' ');
      const displayTime = `${time} ${period.toLowerCase()}`;
      return `Opens today at ${displayTime}`;
    }
  }
  
  // Find next open day
  const todayIndex = dayNames.indexOf(dayName);
  if (todayIndex === -1) return 'Hours not available';
  
  // Check next 7 days (including today if we haven't checked it yet)
  for (let i = 0; i < 7; i++) {
    const checkIndex = (todayIndex + i) % 7;
    const checkDay = dayNames[checkIndex];
    const checkDayHours = hours[checkDay];
    
    if (!checkDayHours) continue;
    
    // Handle string values like "closed"
    if (typeof checkDayHours === 'string') {
      const lowerValue = checkDayHours.toLowerCase();
      if (lowerValue === 'closed') continue;
    }
    
    if (typeof checkDayHours === 'object' && checkDayHours.open && checkDayHours.close) {
      const openTime = parseTime(checkDayHours.open);
      
      // If checking today and we're past open time, skip
      if (i === 0 && currentTime >= openTime) continue;
      
      // Format the day name
      let dayLabel = '';
      if (i === 0) {
        dayLabel = 'today';
      } else if (i === 1) {
        dayLabel = 'tomorrow';
      } else {
        dayLabel = `next ${dayDisplayNames[checkIndex]}`;
      }
      
      // Format the time (times are already in 12-hour format from API)
      const [time, period] = checkDayHours.open.split(' ');
      const displayTime = `${time} ${period.toLowerCase()}`;
      
      return `Opens ${dayLabel} at ${displayTime}`;
    }
  }
  
  return 'Hours not available';
};