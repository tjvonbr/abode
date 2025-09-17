
import { isSameDay } from "@/lib/utils";
import { Appointment } from "@repo/prisma/types";

interface AppointmentBarProps {
  appointment: Appointment;
  currentDate: Date;
  isCheckoutOnly?: boolean;
}

export default function AppointmentBar({ appointment, currentDate, isCheckoutOnly = false }: AppointmentBarProps) {
  const isStartDate = isSameDay(appointment.date, currentDate);
  const isEndDate = isSameDay(appointment.date, currentDate);

  const getBarStyles = () => {
      if (isCheckoutOnly) {
        return "h-6 w-4/5 left-1/2 -translate-x-1/2 rounded-sm";
      }
    
    if (isStartDate) {
      return "h-6 w-1/2 right-0 rounded-l-full";
    } else if (isEndDate) {
      return "h-6 w-1/2 left-0 rounded-r-full";
    } else {
      return "h-6 w-full left-0";
    }
  };

  return (
    <div
      className={`absolute top-1/2 flex justify-center items-center -translate-y-1/2 bg-primary dark:bg-white ${getBarStyles()}`}
      title={`${appointment.type} - ${appointment.date.toLocaleDateString()}`}
    >
      {isCheckoutOnly && <p className="text-xs text-white">{appointment.type}</p>}
    </div>
  );
}
