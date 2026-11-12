import { authenticated, date, entity, one, set, text, uuid } from '@microsoft/rayfin-core';

import { Consultant } from './Consultant.js';
import { Patient } from './Patient.js';

/** A referred patient who has not been booked yet. */
@entity()
@authenticated('*')
export class WaitingListEntry {
  @uuid() id!: string;
  @uuid() patient_id!: string;
  @one(() => Patient) patient!: Patient;
  @text({ min: 1, max: 60 }) speciality!: string;
  @set('routine', 'urgent', 'two-week-wait')
  priority!: 'routine' | 'urgent' | 'two-week-wait';
  @date() referredOn!: Date;
  @uuid({ optional: true }) preferredConsultant_id?: string;
  @one(() => Consultant, { optional: true }) preferredConsultant?: Consultant;
  @text({ optional: true, max: 200 }) preferenceNote?: string;
  @set('waiting', 'offered', 'booked', 'removed')
  status!: 'waiting' | 'offered' | 'booked' | 'removed';
  @date({ optional: true }) offeredSlotAt?: Date;
  @date() createdAt!: Date;
}
