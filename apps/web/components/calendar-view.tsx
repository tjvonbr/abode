'use client';

import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import DayCell from './calendar-day';
import { Appointment } from '@repo/prisma/types';

interface CalendarViewProps {
  appointments: Appointment[]
  showOnlyCheckoutDays?: boolean
}

export default function CalendarView({ showOnlyCheckoutDays = false }: CalendarViewProps ) {  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const appointments: Appointment[] = []

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="rounded-md [&_.rdp-table]:border-separate [&_.rdp-table]:border-spacing-2 [&_.rdp-tbody_td]:p-1"
        components={{
          Day: (props) => <DayCell day={props.day.date} appointments={appointments} selectDate={setSelectedDate} showOnlyCheckoutDays={showOnlyCheckoutDays} />
        }}
      />
    </div>
  );
} 