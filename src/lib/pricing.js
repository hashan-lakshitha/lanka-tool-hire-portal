/**
 * Hire cost calculation shared by /api/quote and /api/rentals so the price a
 * customer is charged is always computed server-side from the tool's rates.
 */
export function calculateCost(hourlyRate, dailyRate, weeklyRate, start, end) {
  const msPerHour = 1000 * 60 * 60;
  const totalHours = Math.ceil((end - start) / msPerHour);

  if (totalHours <= 0) {
    throw new Error('End time must be after start time');
  }

  if (totalHours <= 24) {
    return Math.min(hourlyRate * totalHours, dailyRate);
  }

  const totalDays = Math.ceil(totalHours / 24);

  if (totalDays < 7) {
    return dailyRate * totalDays;
  }

  const weeks = Math.floor(totalDays / 7);
  const remainderDays = totalDays % 7;
  return weeks * weeklyRate + Math.min(remainderDays * dailyRate, weeklyRate);
}

/** Parses a date input, returning null when it is missing or invalid. */
export function parseDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function calculateToolCost(tool, start, end) {
  return calculateCost(
    Number(tool.hourlyRate),
    Number(tool.dailyRate),
    Number(tool.weeklyRate),
    start,
    end
  );
}
