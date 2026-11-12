import { useState } from 'react';

import { SPEC, type Speciality } from '../data';
import { href } from '../nav';
import { ACCENT, btn, btnPrimary, card, check, dd, dl, dt, field, grid2, h1, h2, input, muted13, section, select, split } from '../styles';
import { Avatar, Pill } from '../ui';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const SESSIONS = [
  { key: 'AM', label: 'Morning', hours: '08:30 – 12:30' },
  { key: 'PM', label: 'Afternoon', hours: '13:30 – 17:00' },
];
const TITLES = ['Dr', 'Mr', 'Ms', 'Miss', 'Mrs', 'Prof'];
const SPECS = ['Dermatology', 'Cardiology', 'Neurology', 'Oncology', 'Orthopaedics', 'Paediatrics'];
const NEW_SPEC = 'Add new speciality…';
const ROOMS = ['Clinic 3, Rm 2', 'Clinic 2, Rm 4', 'Clinic 5, Rm 1', 'Assign per session'];

const dayHead = { textAlign: 'center', fontSize: 12, fontWeight: 600 } as const;

function formatStart(value: string): string {
  const date = new Date(`${value}T00:00:00`);
  if (!value || Number.isNaN(date.getTime())) return 'Not set';
  return date
    .toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
    .replace(',', '');
}

export function AddConsultantPage() {
  const [on, setOn] = useState(['Tue-AM', 'Tue-PM', 'Fri-AM']);
  const [title, setTitle] = useState('Dr');
  const [first, setFirst] = useState('Nadia');
  const [last, setLast] = useState('Rahman');
  const [spec, setSpec] = useState('Dermatology');
  const [start, setStart] = useState('2026-12-01');
  const [room, setRoom] = useState(ROOMS[0]);

  const fullName = [title, first.trim(), last.trim()].filter(Boolean).join(' ');
  const avatar = ((first.trim()[0] ?? '') + (last.trim()[0] ?? '')).toUpperCase();
  const [specBg, specFg] = spec in SPEC ? SPEC[spec as Speciality] : ['#EBEBEB', '#424242'];

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 240px' }}>
          <div style={muted13}>
            <a href={href('consultants')}>Consultants</a> / Add consultant
          </div>
          <h1 style={{ ...h1, margin: '4px 0 0' }}>Add consultant</h1>
        </div>
        <a
          href={href('consultants')}
          style={{ ...btn, display: 'inline-flex', alignItems: 'center', padding: '0 16px', textDecoration: 'none' }}
        >
          Cancel
        </a>
        <button type="button" style={{ ...btn, padding: '0 16px' }}>
          Save draft
        </button>
        <button type="button" style={btnPrimary}>
          Add consultant
        </button>
      </div>

      <div style={split}>
        <form
          onSubmit={(e) => e.preventDefault()}
          style={{ ...card, flex: '999 1 420px', minWidth: 0, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}
        >
          <h2 style={h2}>Details</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '110px minmax(0, 1fr) minmax(0, 1fr)', gap: 12 }}>
            <label style={field}>
              Title
              <select style={select} value={title} onChange={(e) => setTitle(e.target.value)}>
                {TITLES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <label style={field}>
              First name
              <input type="text" value={first} onChange={(e) => setFirst(e.target.value)} style={input} />
            </label>
            <label style={field}>
              Last name
              <input type="text" value={last} onChange={(e) => setLast(e.target.value)} style={input} />
            </label>
          </div>
          <div style={grid2}>
            <label style={field}>
              Speciality
              <select style={select} value={spec} onChange={(e) => setSpec(e.target.value)}>
                {[...SPECS, NEW_SPEC].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <label style={field}>
              Sub-speciality or interest
              <input type="text" placeholder="Optional" style={input} />
            </label>
            <label style={field}>
              Registration number
              <input type="text" placeholder="[REGISTRATION NO.]" style={input} />
            </label>
            <label style={field}>
              Start date
              <input type="date" value={start} onChange={(e) => setStart(e.target.value)} style={{ ...input, padding: '0 10px' }} />
            </label>
            <label style={field}>
              Work email
              <input type="email" placeholder="[WORK EMAIL]" style={input} />
            </label>
            <label style={field}>
              Secretary or contact
              <input type="text" placeholder="[SECRETARY NAME / EXT.]" style={input} />
            </label>
          </div>

          <h2 style={{ ...h2, margin: '6px 0 0', paddingTop: 16, borderTop: '1px solid #EBEBEB' }}>Booking rules</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
            <label style={field}>
              New patient slot
              <select style={select}>
                <option>30 minutes</option>
                <option>20 minutes</option>
                <option>45 minutes</option>
                <option>60 minutes</option>
              </select>
            </label>
            <label style={field}>
              Follow-up slot
              <select style={select}>
                <option>15 minutes</option>
                <option>10 minutes</option>
                <option>20 minutes</option>
                <option>30 minutes</option>
              </select>
            </label>
            <label style={field}>
              Default room
              <select style={select} value={room} onChange={(e) => setRoom(e.target.value)}>
                {ROOMS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </label>
          </div>
          <div style={{ ...grid2, gap: '4px 12px' }}>
            <label style={check}>
              <input type="checkbox" defaultChecked /> Accepts new referrals
            </label>
            <label style={check}>
              <input type="checkbox" defaultChecked /> Offers video consultations
            </label>
            <label style={check}>
              <input type="checkbox" /> Allow overbooking (1 per session)
            </label>
            <label style={check}>
              <input type="checkbox" defaultChecked /> Sync leave from staff rota
            </label>
          </div>
        </form>

        <div style={{ flex: '1 1 400px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <section style={section}>
            <div>
              <h2 style={h2}>Weekly clinic sessions</h2>
              <div style={{ ...muted13, marginTop: 2 }}>
                Select the sessions patients can be booked into. {on.length} selected.
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '72px repeat(5, minmax(56px, 1fr))', gap: 6, minWidth: 380, alignItems: 'center' }}>
                <div />
                {DAYS.map((d) => (
                  <div key={d} style={dayHead}>
                    {d}
                  </div>
                ))}
                {SESSIONS.flatMap((s) => [
                  <div key={s.key} style={{ fontSize: 12, color: '#5C5C5C', lineHeight: 1.3 }}>
                    {s.label}
                    <br />
                    {s.hours}
                  </div>,
                  ...DAYS.map((d) => {
                    const key = `${d}-${s.key}`;
                    const sel = on.includes(key);
                    return (
                      <button
                        key={key}
                        type="button"
                        aria-pressed={sel}
                        aria-label={`${d} ${s.label.toLowerCase()}${sel ? ', clinic' : ', off'}`}
                        onClick={() => setOn(sel ? on.filter((k) => k !== key) : [...on, key])}
                        style={{
                          height: 44,
                          borderRadius: 4,
                          border: `1px solid ${sel ? ACCENT : '#D1D1D1'}`,
                          background: sel ? ACCENT : '#FFFFFF',
                          color: sel ? '#FFFFFF' : '#5C5C5C',
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {sel ? 'Clinic' : 'Off'}
                      </button>
                    );
                  }),
                ])}
              </div>
            </div>
          </section>

          <section style={section}>
            <h2 style={h2}>Calendar preview</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar text={avatar} bg={specBg} fg={specFg} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600 }}>{fullName}</div>
                <div style={{ marginTop: 4 }}>
                  <Pill bg={specBg} fg={specFg} small>
                    {spec === NEW_SPEC ? 'New speciality' : spec}
                  </Pill>
                </div>
              </div>
            </div>
            <dl style={dl(130)}>
              <dt style={dt}>Bookable from</dt>
              <dd style={dd}>{formatStart(start)}</dd>
              <dt style={dt}>Weekly capacity</dt>
              <dd style={dd}>
                {on.length} sessions · about {on.length * 8} new-patient slots
              </dd>
              <dt style={dt}>Default room</dt>
              <dd style={dd}>{room}</dd>
            </dl>
          </section>
        </div>
      </div>
    </>
  );
}
