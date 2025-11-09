

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
  hours?: Record<string, { open: string; close: string }> | any
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