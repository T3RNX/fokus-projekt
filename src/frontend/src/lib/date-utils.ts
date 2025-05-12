export const parseLocalDate = (dateString: string): Date => {
  if (!dateString) return new Date(0);
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const formatTime = (timeString: string): string => {
  if (!timeString) return "";
  return timeString.substring(0, 5) + " Uhr";
};

export const isToday = (dateString: string): boolean => {
  if (!dateString) return false;

  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  return dateString === todayString;
};

export const formatDateTime = (date: string, time: string): string => {
  if (!date) return "";

  const formattedDate = parseLocalDate(date).toLocaleDateString("de-DE");
  const formattedTime = time ? formatTime(time) : "";

  if (formattedTime) {
    return `${formattedDate}, ${formattedTime}`;
  }

  return formattedDate;
};

export const getCurrentDateString = (): string => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(today.getDate()).padStart(2, "0")}`;
};

export const getCurrentTimeString = (): string => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}:00`;
};

export const compareDates = (date1: string, date2: string): number => {
  if (!date1 || !date2) return 0;

  const d1 = parseLocalDate(date1);
  const d2 = parseLocalDate(date2);

  return d1.getTime() - d2.getTime();
};

export const isFutureDate = (dateString: string): boolean => {
  if (!dateString) return false;

  const date = parseLocalDate(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date > today;
};

export const isPastDate = (dateString: string): boolean => {
  if (!dateString) return false;

  const date = parseLocalDate(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date < today;
};

export const formatDateForInput = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

export const formatTimeForInput = (timeString: string): string => {
  if (!timeString) return "";
  return timeString.substring(0, 5);
};
