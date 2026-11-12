import { authenticated, date, entity, one, set, uuid } from '@microsoft/rayfin-core';

import { Consultant } from './Consultant.js';
import { Room } from './Room.js';

/** One half-day of a room allocated to a consultant. */
@entity()
@authenticated('*')
export class RoomSession {
  @uuid() id!: string;
  @uuid() room_id!: string;
  @one(() => Room) room!: Room;
  @uuid() consultant_id!: string;
  @one(() => Consultant) consultant!: Consultant;
  /** The calendar day of the session (time part unused). */
  @date() sessionDate!: Date;
  @set('am', 'pm') half!: 'am' | 'pm';
}
