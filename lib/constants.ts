// The seeded main demo clinic. Used as the default clinic for public patient
// self-service flows (homepage / join-queue) when no clinic is specified.
export const DEFAULT_CLINIC_ID = "00000000-0000-0000-0000-000000000001";

// Queue statuses considered "still in the room today" (not finished/removed).
export const ACTIVE_QUEUE_STATUSES = ["waiting", "called", "with_doctor"] as const;

/** Start of the current day as an ISO string, for "today" filters on created_at. */
export function startOfToday(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}
