import { authenticated, date, entity, set, text, uuid } from '@microsoft/rayfin-core';

/** A patient who can be booked or placed on the waiting list. */
@entity()
@authenticated('*')
export class Patient {
  @uuid() id!: string;
  @text({ min: 1, max: 20, unique: true }) mrn!: string;
  @text({ min: 1, max: 60 }) firstName!: string;
  @text({ min: 1, max: 60 }) lastName!: string;
  @date({ optional: true }) dateOfBirth?: Date;
  @text({ optional: true, max: 30 }) phone?: string;
  @text({ optional: true, max: 120 }) gpPractice?: string;
  @set('text', 'phone', 'letter', 'email')
  contactPreference!: 'text' | 'phone' | 'letter' | 'email';
  @text({ optional: true, max: 200 }) needs?: string;
  @date() createdAt!: Date;
}
