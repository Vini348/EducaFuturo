export interface SubjectSchedule {
  id: string
  name: string // This will map to subject_name in the database
  description: string
  color: string
}

export interface TimeSlot {
  id: string
  startTime: string
  endTime: string
  activity: string
  subject?: string
  description?: string
}

export interface WeeklySchedule {
  monday: TimeSlot[]
  tuesday: TimeSlot[]
  wednesday: TimeSlot[]
  thursday: TimeSlot[]
  friday: TimeSlot[]
  saturday: TimeSlot[]
  sunday: TimeSlot[]
}

export interface CustomActivity {
  id: string
  name: string
}
