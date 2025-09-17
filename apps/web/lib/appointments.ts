import { prisma } from "@repo/prisma/client";
import { Appointment } from "@repo/prisma/types";

export async function getAppointmentsByUserId(userId: string): Promise<Appointment[]> {
  const appointments = await prisma.appointment.findMany({
    where: {
      users: {
        some: {
          id: userId
        }
      }
    },
    include: {
      users: true,
      home: true
    }
  })

  return appointments
}