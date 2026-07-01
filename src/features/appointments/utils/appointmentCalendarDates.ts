function padDatePart(value: number): string {
  return value.toString().padStart(2, "0");
}

export function toDateOnly(value: Date): string {
  return [
    value.getFullYear(),
    padDatePart(value.getMonth() + 1),
    padDatePart(value.getDate()),
  ].join("-");
}

export function toInclusiveCalendarEndDate(value: Date): string {
  const inclusiveEnd = new Date(value);
  inclusiveEnd.setDate(inclusiveEnd.getDate() - 1);
  return toDateOnly(inclusiveEnd);
}
