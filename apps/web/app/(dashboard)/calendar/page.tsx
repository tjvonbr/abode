import CalendarView from "@/components/calendar-view";
import { Appointment } from "@repo/prisma/types";

export default async function CalendarPage() {
  const appointments: Appointment[] = []
  
  return <CalendarView appointments={appointments} showOnlyCheckoutDays={true} />;
}