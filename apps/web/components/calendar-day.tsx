import { isSameDay } from "@/lib/utils"
import AppointmentBar from "./appointment-bar"
import { Appointment } from "@repo/prisma/types"

interface DayCellProps {
  day: Date
  appointments: Appointment[]
  selectDate: (date: Date) => void
  showOnlyCheckoutDays?: boolean
}

export default function DayCell({ day, appointments, selectDate, showOnlyCheckoutDays = false }: DayCellProps) {
  const date = new Date(day)

  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)
  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  const eventsForDay = appointments.filter((appointment) => {
    const isEventOnDay = appointment.startTime <= endOfDay && appointment.endTime >= startOfDay
    
    if (showOnlyCheckoutDays) {
      return isEventOnDay && isSameDay(appointment.date, date)
    }
    
    return isEventOnDay
  })

  return (
    <div 
      className="relative w-full aspect-square p-2 hover:bg-muted/50 cursor-pointer rounded-md border border-border/50" 
      onClick={() => selectDate(day)}
    >
      <p className="text-sm absolute top-2 right-2">{date.getDate()}</p>
      {eventsForDay.map((event) => (
        <AppointmentBar key={event.id} appointment={event} currentDate={date} isCheckoutOnly={showOnlyCheckoutDays} />
      ))}
    </div>
  )
}