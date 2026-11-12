import { useState } from 'react';

import {
  CAL_CONSULTANTS,
  CAL_SPECS,
  DAY_HOURS,
  DAY_START,
  NOW,
  PILL,
  TODAY_APPTS,
  fmt,
  type Option,
  type SpecFilter,
} from '../data';
import { btn, btnPrimary, btnSm, card, chipRow, dd, dl, dt, h2, muted12, muted13, section, spacer, split } from '../styles';
import { ChipRow, Pill, SpecPill } from '../ui';
import { apptLook } from './appt-look';
import { ApptBlock, CalendarToolbar, HoursColumn, Legend, SlotColumn } from './calendar-parts';

const H = 64;

const WAITING = [
  { patient: 'A. Fitzgerald', spec: 'Cardiology', note: 'urgent, 6 days' },
  { patient: 'D. Okonkwo', spec: 'Neurology', note: 'routine, 19 days' },
  { patient: 'S. Larsen', spec: 'Orthopaedics', note: 'routine, 23 days' },
  { patient: 'P. Iyer', spec: 'Cardiology', note: 'routine, 31 days' },
];

const CHIPS: Option<SpecFilter>[] = (['All', ...CAL_SPECS] as SpecFilter[]).map(
  (n) => ({
    key: n,
    label:
      (n === 'All' ? 'All specialities' : n) +
      ' · ' +
      (n === 'All'
        ? CAL_CONSULTANTS.length
        : CAL_CONSULTANTS.filter((c) => c.spec === n).length),
  })
);

export function DayPage() {
  const [spec, setSpec] = useState<SpecFilter>('All');
  const [picked, setPicked] = useState('ao3');

  const shown = CAL_CONSULTANTS.filter((c) => spec === 'All' || c.spec === spec);
  const nowTop = Math.round((NOW - DAY_START) * H);

  const sel = TODAY_APPTS.find((a) => a.id === picked) ?? TODAY_APPTS[2];
  const selWho = CAL_CONSULTANTS.find((c) => c.id === sel.c) ?? CAL_CONSULTANTS[0];
  const selOff = sel.status === 'Unavailable';
  const waiting = WAITING.filter((w) => spec === 'All' || w.spec === spec).slice(0, 3);

  return (
    <>
      <CalendarToolbar title="Wednesday 11 November 2026" view="day" nowLabel="Today" />

      <div style={chipRow}>
        <span style={{ ...muted13, marginRight: 4 }}>Speciality</span>
        <ChipRow options={CHIPS} value={spec} onChange={setSpec} />
        <div style={spacer} />
        <Legend
          items={[
            { label: 'Confirmed', color: '#0A4F43' },
            { label: 'Checked in', color: '#0F6CBD' },
            { label: 'Pending', color: '#8A6100', kind: 'dashed' },
            { label: 'Unavailable', color: '#D1D1D1', kind: 'square' },
          ]}
        />
      </div>

      <div style={split}>
        <div style={{ ...card, flex: '999 1 560px', minWidth: 0, overflowX: 'auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `56px repeat(${shown.length}, minmax(132px, 1fr))`,
              minWidth: 56 + shown.length * 132,
            }}
          >
            <HoursColumn headHeight={78} hourHeight={H} />
            {shown.map((c) => {
              const mine = TODAY_APPTS.filter((a) => a.c === c.id);
              const booked = mine.reduce((s, a) => s + a.dur, 0);
              return (
                <div key={c.id} style={{ borderLeft: '1px solid #E0E0E0', minWidth: 0 }}>
                  <div
                    style={{
                      height: 78,
                      boxSizing: 'border-box',
                      padding: '10px 10px',
                      borderBottom: '1px solid #E0E0E0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.name}
                    </div>
                    <div>
                      <SpecPill spec={c.spec} small />
                    </div>
                    <div style={{ fontSize: 11, color: '#5C5C5C', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.room} · {Math.round((DAY_HOURS - booked) * 2)} slots free
                    </div>
                  </div>
                  <SlotColumn hourHeight={H} nowTop={nowTop}>
                    {mine.map((a) => {
                      const look = apptLook(a, c.spec, H);
                      return (
                        <ApptBlock
                          key={a.id}
                          {...look}
                          selected={a.id === picked}
                          title={`${fmt(a.start)} ${a.patient}`}
                          label={`${fmt(a.start)} ${a.patient}, ${a.type}, ${a.status}`}
                          onClick={() => setPicked(a.id)}
                        />
                      );
                    })}
                  </SlotColumn>
                </div>
              );
            })}
          </div>
        </div>

        <aside
          aria-label="Booking details"
          style={{ flex: '1 1 280px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          <section style={section}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <h2 style={h2}>Selected booking</h2>
              <Pill bg={PILL[sel.status][0]} fg={PILL[sel.status][1]}>
                {sel.status}
              </Pill>
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 600 }}>{sel.patient}</div>
              <div style={muted12}>
                {selOff ? 'Blocked session' : 'MRN [MRN] · DOB [DOB] · Referred by GP'}
              </div>
            </div>
            <dl style={dl(92)}>
              <dt style={dt}>Time</dt>
              <dd style={dd}>
                {fmt(sel.start)} – {fmt(sel.start + sel.dur)} ({Math.round(sel.dur * 60)} min)
              </dd>
              <dt style={dt}>Consultant</dt>
              <dd style={dd}>{selWho.name}</dd>
              <dt style={dt}>Speciality</dt>
              <dd style={dd}>{selWho.spec}</dd>
              <dt style={dt}>Type</dt>
              <dd style={dd}>{sel.type}</dd>
              <dt style={dt}>Location</dt>
              <dd style={dd}>{selWho.room}</dd>
            </dl>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <button type="button" style={{ ...btnPrimary, flex: '1 1 110px' }}>
                Check in
              </button>
              <button type="button" style={{ ...btn, flex: '1 1 110px', padding: 0 }}>
                Reschedule
              </button>
              <button type="button" style={{ ...btn, flex: '1 1 100%', color: '#B10E1C' }}>
                Cancel booking
              </button>
            </div>
          </section>

          <section style={{ ...section, gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
              <h2 style={h2}>Waiting list</h2>
              <span style={muted12}>{spec === 'All' ? 'All specialities' : spec}</span>
            </div>
            {waiting.map((w) => (
              <div
                key={w.patient}
                style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 10, borderTop: '1px solid #EBEBEB' }}
              >
                <div style={{ flex: '1 1 0', minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{w.patient}</div>
                  <div style={muted12}>
                    {w.spec} · {w.note}
                  </div>
                </div>
                <button type="button" style={btnSm}>
                  Offer slot
                </button>
              </div>
            ))}
            {waiting.length === 0 && (
              <div style={{ ...muted13, paddingTop: 10, borderTop: '1px solid #EBEBEB' }}>
                No one waiting for this speciality.
              </div>
            )}
          </section>
        </aside>
      </div>
    </>
  );
}
