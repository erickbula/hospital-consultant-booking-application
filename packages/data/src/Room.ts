import { authenticated, boolean, entity, text, uuid } from '@microsoft/rayfin-core';

/** A clinic room that sessions and appointments can be held in. */
@entity()
@authenticated('*')
export class Room {
  @uuid() id!: string;
  @text({ min: 1, max: 80, unique: true }) name!: string;
  @text({ max: 60 }) area!: string;
  @text({ optional: true, max: 200 }) equipment?: string;
  @text({ optional: true, max: 120 }) access?: string;
  @boolean({ default: false }) outOfService!: boolean;
}
