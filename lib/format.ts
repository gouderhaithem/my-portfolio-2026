const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

/**
 * Formats an ISO date string (e.g. "2026-05-18") as "May 18, 2026".
 * Parses the parts directly to stay deterministic across server and client
 * (avoids timezone-dependent `Date` rendering mismatches).
 */
export function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map((part) => Number(part))
  if (!year || !month || !day) return iso
  return `${MONTHS[month - 1]} ${day}, ${year}`
}
