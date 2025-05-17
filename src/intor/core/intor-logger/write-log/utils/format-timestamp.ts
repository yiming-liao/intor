export const formatTimestamp = (
  timeZone?: string,
  date: Date = new Date(),
): string => {
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  if (timeZone) {
    try {
      new Intl.DateTimeFormat("en-GB", { timeZone }).format(date);
      options.timeZone = timeZone;
    } catch {
      console.warn(`Invalid timeZone: ${timeZone}. Defaulting to local time.`);
    }
  }

  return date.toLocaleTimeString("en-GB", options);
};
