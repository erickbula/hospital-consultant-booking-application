/**
 * Browser-safe contracts shared by the data registration package and frontend.
 *
 * Keep each record shape aligned with its decorated runtime entity in
 * `@rayfin-app/data`. This package must stay isomorphic, so do not import the
 * decorated classes here.
 */

export type ConsultantStatus = 'active' | 'on-leave' | 'leaving' | 'removed';
export type ContactPreference = 'text' | 'phone' | 'letter' | 'email';
export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'checked-in'
  | 'attended'
  | 'did-not-attend'
  | 'cancelled'
  | 'unavailable';
export type ConsultationMode = 'in-person' | 'video' | 'telephone';
export type Priority = 'routine' | 'urgent' | 'two-week-wait';
export type WaitingStatus = 'waiting' | 'offered' | 'booked' | 'removed';
export type SessionHalf = 'am' | 'pm';

export interface RoomRecord {
  id: string;
  name: string;
  area: string;
  equipment?: string;
  access?: string;
  outOfService: boolean;
}

export interface ConsultantRecord {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  speciality: string;
  jobTitle?: string;
  registrationNumber?: string;
  workEmail?: string;
  secretaryContact?: string;
  startDate?: Date;
  lastWorkingDay?: Date;
  status: ConsultantStatus;
  clinicSessions?: string;
  newPatientMinutes: number;
  followUpMinutes: number;
  acceptsReferrals: boolean;
  offersVideo: boolean;
  allowOverbooking: boolean;
  defaultRoom_id?: string;
  defaultRoom?: RoomRecord;
  createdAt: Date;
}

export interface PatientRecord {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  phone?: string;
  gpPractice?: string;
  contactPreference: ContactPreference;
  needs?: string;
  createdAt: Date;
}

export interface AppointmentRecord {
  id: string;
  consultant_id: string;
  consultant: ConsultantRecord;
  patient_id?: string;
  patient?: PatientRecord;
  room_id?: string;
  room?: RoomRecord;
  startsAt: Date;
  durationMinutes: number;
  appointmentType: string;
  status: AppointmentStatus;
  mode: ConsultationMode;
  priority: Priority;
  referralSource?: string;
  blockLabel?: string;
  notes?: string;
  textConfirmation: boolean;
  reminder48h: boolean;
  interpreterRequired: boolean;
  transportRequired: boolean;
  createdAt: Date;
}

export interface WaitingListEntryRecord {
  id: string;
  patient_id: string;
  patient: PatientRecord;
  speciality: string;
  priority: Priority;
  referredOn: Date;
  preferredConsultant_id?: string;
  preferredConsultant?: ConsultantRecord;
  preferenceNote?: string;
  status: WaitingStatus;
  offeredSlotAt?: Date;
  createdAt: Date;
}

export interface RoomSessionRecord {
  id: string;
  room_id: string;
  room: RoomRecord;
  consultant_id: string;
  consultant: ConsultantRecord;
  sessionDate: Date;
  half: SessionHalf;
}

export type UniversalAppSchema = {
  Room: RoomRecord;
  Consultant: ConsultantRecord;
  Patient: PatientRecord;
  Appointment: AppointmentRecord;
  WaitingListEntry: WaitingListEntryRecord;
  RoomSession: RoomSessionRecord;
};
