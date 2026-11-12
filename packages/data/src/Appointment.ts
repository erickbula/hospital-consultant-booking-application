import {
  authenticated,
  boolean,
  date,
  entity,
  int,
  one,
  set,
  text,
  uuid,
} from '@microsoft/rayfin-core';

import { Consultant } from './Consultant.js';
import { Patient } from './Patient.js';
import { Room } from './Room.js';

/**
 * A slot in a consultant diary: a patient booking, or a blocked session
 * (status "unavailable", no patient) such as a theatre list or MDT meeting.
 */
@entity()
@authenticated('*')
export class Appointment {
  @uuid() id!: string;
  @uuid() consultant_id!: string;
  @one(() => Consultant) consultant!: Consultant;
  @uuid({ optional: true }) patient_id?: string;
  @one(() => Patient, { optional: true }) patient?: Patient;
  @uuid({ optional: true }) room_id?: string;
  @one(() => Room, { optional: true }) room?: Room;
  @date() startsAt!: Date;
  @int({ min: 5, max: 600 }) durationMinutes!: number;
  @text({ min: 1, max: 60 }) appointmentType!: string;
  @set(
    'pending',
    'confirmed',
    'checked-in',
    'attended',
    'did-not-attend',
    'cancelled',
    'unavailable'
  )
  status!:
    | 'pending'
    | 'confirmed'
    | 'checked-in'
    | 'attended'
    | 'did-not-attend'
    | 'cancelled'
    | 'unavailable';
  @set('in-person', 'video', 'telephone')
  mode!: 'in-person' | 'video' | 'telephone';
  @set('routine', 'urgent', 'two-week-wait')
  priority!: 'routine' | 'urgent' | 'two-week-wait';
  @text({ optional: true, max: 60 }) referralSource?: string;
  /** Label for a blocked session, for example "Theatre list". */
  @text({ optional: true, max: 120 }) blockLabel?: string;
  @text({ optional: true, max: 2000 }) notes?: string;
  @boolean({ default: false }) textConfirmation!: boolean;
  @boolean({ default: false }) reminder48h!: boolean;
  @boolean({ default: false }) interpreterRequired!: boolean;
  @boolean({ default: false }) transportRequired!: boolean;
  @date() createdAt!: Date;
}
