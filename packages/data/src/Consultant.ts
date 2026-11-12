import {
  authenticated,
  boolean,
  date,
  email,
  entity,
  int,
  one,
  set,
  text,
  uuid,
} from '@microsoft/rayfin-core';

import { Room } from './Room.js';

/** A consultant who runs clinics and can be booked. */
@entity()
@authenticated('*')
export class Consultant {
  @uuid() id!: string;
  @text({ max: 10 }) title!: string;
  @text({ min: 1, max: 60 }) firstName!: string;
  @text({ min: 1, max: 60 }) lastName!: string;
  @text({ min: 1, max: 60 }) speciality!: string;
  @text({ optional: true, max: 120 }) jobTitle?: string;
  @text({ optional: true, max: 40 }) registrationNumber?: string;
  @email({ optional: true, max: 200 }) workEmail?: string;
  @text({ optional: true, max: 120 }) secretaryContact?: string;
  @date({ optional: true }) startDate?: Date;
  @date({ optional: true }) lastWorkingDay?: Date;
  @set('active', 'on-leave', 'leaving', 'removed')
  status!: 'active' | 'on-leave' | 'leaving' | 'removed';
  /** Weekly clinic sessions as comma-separated keys, for example "Tue-AM,Tue-PM,Fri-AM". */
  @text({ optional: true, max: 100 }) clinicSessions?: string;
  @int({ default: 30 }) newPatientMinutes!: number;
  @int({ default: 15 }) followUpMinutes!: number;
  @boolean({ default: true }) acceptsReferrals!: boolean;
  @boolean({ default: false }) offersVideo!: boolean;
  @boolean({ default: false }) allowOverbooking!: boolean;
  @uuid({ optional: true }) defaultRoom_id?: string;
  @one(() => Room, { optional: true }) defaultRoom?: Room;
  @date() createdAt!: Date;
}
