export function formatTimeString(time: string): string {
  if (time.length !== 4) {
    return time;
  }

  const hour = time.slice(0, 2);
  const minute = time.slice(2, 4);
  return `${hour}:${minute}`;
}
