export function formatTimestamp(timestamp: number /* ms */): string {
  let minutes = Math.floor(timestamp / 1000 / 60);
  let minutesPadding = "";
  if (minutes < 10) {
    minutesPadding = "0";
  }
  let seconds = Math.floor((timestamp / 1000) % 60);
  let secondsPadding = "";
  if (seconds < 10) {
    secondsPadding = "0";
  }
  return `${minutesPadding}${minutes}:${secondsPadding}${seconds}`;
}
