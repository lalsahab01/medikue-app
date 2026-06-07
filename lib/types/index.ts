export type QueueStatus = 'waiting' | 'called' | 'with_doctor' | 'done' | 'skipped' | 'cancelled'
export type AppointmentStatus = 'scheduled' | 'waiting' | 'in_progress' | 'completed' | 'cancelled'
export type PaymentMethod = 'cash' | 'upi' | 'card'
export type PaymentStatus = 'pending' | 'completed' | 'refunded'

export interface Doctor {
  id: string
  clinic_id: string
  name: string
  specialization: string
  qualification: string
  experience_years: number
  consultation_fee: number
  is_available: boolean
  photo_url: string | null
  bio: string | null
  languages: string[]
  available_days: string[]
  slot_duration_minutes: number
  created_at: string
}

export interface Patient {
  id: string
  clinic_id: string
  name: string
  phone: string
  age: number | null
  gender: string | null
  blood_group: string | null
  created_at: string
}

export interface QueueEntry {
  id: string
  clinic_id: string
  doctor_id: string
  patient_id: string | null
  patient_name: string
  patient_phone: string
  token_number: number
  status: QueueStatus
  reason: string | null
  estimated_wait_minutes: number | null
  called_at: string | null
  done_at: string | null
  created_at: string
  doctor?: Doctor
}
