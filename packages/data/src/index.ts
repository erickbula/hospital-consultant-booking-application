import type { UniversalAppSchema } from '@rayfin-app/shared';

import { Appointment } from './Appointment.js';
import { Consultant } from './Consultant.js';
import { Patient } from './Patient.js';
import { Room } from './Room.js';
import { RoomSession } from './RoomSession.js';
import { WaitingListEntry } from './WaitingListEntry.js';

/**
 * The app's Rayfin data schema.
 *
 * Keep `UniversalAppSchema` in `@rayfin-app/shared` in step with `schema`
 * below: a class registered here but missing from the shared type is reachable
 * at runtime and invisible to the compiler.
 */
export type { UniversalAppSchema };
export { Appointment, Consultant, Patient, Room, RoomSession, WaitingListEntry };

export const schema = [
  Room,
  Consultant,
  Patient,
  Appointment,
  WaitingListEntry,
  RoomSession,
];
