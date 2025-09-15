// Re-export all Prisma types for clean imports
export type {
  User,
  Home,
  Appointment,
  Role,
  AppointmentType,
  Prisma,
} from '../generated/prisma/index.js'

// Re-export commonly used types - these are available in the Prisma namespace
export type {
  Prisma as PrismaTypes,
} from '../generated/prisma/index.js'
