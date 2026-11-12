import { useState } from 'react';

import {
  CAL_CONSULTANTS,
  CAL_SPECS,
  DAY_START,
  NOW,
  PILL,
  SPEC,
  TODAY_APPTS,
  WEEK_DAYS,
  fmt,
  hash,
  initials,
  specOptions,
  type Appt,
  type CalConsultant,
  type SpecFilter,
} from '../data';
import { href } from '../nav';
import { btn, card, chipRow, dd, dl, dt, h2, linkBtnSm, muted12, muted13, section, spacer, split, statTile } from '../styles';
import { Avatar, ChipRow, Pill } from '../ui';
import { apptLook } from './appt-look';
import { ApptBlock, CalendarToolbar, HoursColumn, Legend, SlotColumn } from './calendar-parts';

const H = 64;
const TODAY = 2;

const PATIENTS = ['A. Byrne', 'C. Olawale', 'D. Singh', 'E. Novak', 'F. Hughes', 'G. Tran', 'H. Mbeki', 'I. Costa', 'J. Palmer', 'K. Demir', 'L. Okoye', 'M. Reid', 'N. Farouk', 'O. Jensen', 'P. Shah', 'R. Collins', 'S. Yamada', 'T. Morgan'];

interface DayPlan {
  appts: Appt[];
  free: number[];
}

/** One consultant's week: per day, the appointments and the free half-hour slots. */
function weekFor(c: CalConsultant): DayPlan[] {
  return WEEK_DAYS.map((_, d) => {
    const kind = c.week[d];
    if (kind === 'W') {
      const appts = TODAY_APPTS.filter((a) => a.c === c.id);
      const busy = (t: number) => appts.some((a) => t >= a.start && t < a.start + a.dur);
      const free: number[] = [];
      for (let t = 8; t < 17; t += 0.5) if (!busy(t)) free.push(t);
      return { appts, free };
    }
    if (!kind) {
      return {
        appts: [{ id: `${c.id}${d}x`, c: c.id, start: 8, dur: 9, patient: 'No clinic', type: 'Not bookable', status: 'Unavailable' }],
        free: [],
      };
    }
    const appts: Appt[] = [];
    const free: number[] = [];
    const past = d < TODAY;
    for (const [from, to] of [[8.5, 12.5], [13.5, 17]]) {
      for (let t = from; t < to; t += 0.5) {
        const r = hash(`${c.id}${d}-${t}`);
        const m = r % 10;
        const patient = PATIENTS[r % PATIENTS.length];
        const status = past ? 'Attended' : r % 7 === 0 ? 'Pending' : 'Confirmed';
        if (m === 6 && t + 1 <= to) {
          appts.push({ id: `${c.id}${d}${t}`, c: c.id, start: t, dur: 1, patient, type: 'New patient', status });
          t += 0.5;
        } else if (m < 6) {
          appts.push({ id: `${c.id}${d}${t}`, c: c.id, start: t, dur: 0.5, patient, type: 'Follow-up', status });
        } else if (!past) {
          free.push(t);
        }
      }
    }
    return { appts, free };
  });
}

const CHIPS = specOptions(CAL_SPECS);

export function WeekPage() {
  const [spec, setSpec] = useState<SpecFilter>('All');
  const [who, setWho] = useState('ao');
  const [picked, setPicked] = useState('ao3');

  const inSpec = CAL_CONSULTANTS.filter((c) => spec === 'All' || c.spec === spec);
  const cur = inSpec.find((c) => c.id === who) ?? inSpec[0];
  const week = weekFor(cur);
  const [whoBg, whoFg] = SPEC[cur.spec];
  const nowTop = Math.round((NOW - DAY_START) * H);

  let sel: Appt | undefined;
  let selDay = '';
  week.forEach((day, d) => {
    const found = day.appts.find((a) => a.id === picked);
    if (found) {
      sel = found;
      selDay = WEEK_DAYS[d];
    }
  });
  const selected = sel as Appt | undefined;

  const real = week.flatMap((day) => day.appts.filter((a) => a.status !== 'Unavailable'));
  const freeLeft = week.reduce((n, day, d) => n + (d < TODAY ? 0 : day.free.length), 0);
  const nextFree: string[] = [];
  week.forEach((day, d) => {
    if (d < TODAY) return;
    day.free.forEach((t) => {
      if (d === TODAY && t < 11) return;
      if (nextFree.length < 3) nextFree.push(`${WEEK_DAYS[d]} Nov, ${fmt(t)}`);
    });
  });

  return (
    <>
      <CalendarToolbar title="9 – 13 November 2026" view="week" nowLabel="This week" />

      <div style={chipRow}>
        <span style={{ ...muted13, width: 76 }}>Speciality</span>
        <ChipRow options={CHIPS} value={spec} onChange={setSpec} />
      </div>
      <div style={chipRow}>
        <span style={{ ...muted13, width: 76 }}>Consultant</span>
        <ChipRow
          square
          options={inSpec.map((c) => ({ key: c.id, label: c.name }))}
          value={cur.id}
          onChange={setWho}
        />
        <div style={spacer} />
        <Legend
          items={[
            { label: 'Confirmed', color: '#0A4F43' },
            { label: 'Checked in', color: '#0F6CBD' },
            { label: 'Attended', color: '#8A8A8A' },
            { label: 'Pending', color: '#8A6100', kind: 'dashed' },
          ]}
        />
      </div>

      <div style={split}>
        <div style={{ ...card, flex: '999 1 560px', minWidth: 0, overflowX: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '56px repeat(5, minmax(132px, 1fr))', minWidth: 716 }}>
            <HoursColumn headHeight={58} hourHeight={H} />
            {week.map((day, d) => {
              const isToday = d === TODAY;
              const off = cur.week[d] === '';
              return (
                <div key={WEEK_DAYS[d]} style={{ borderLeft: '1px solid #E0E0E0', minWidth: 0 }}>
                  <div
                    style={{
                      height: 58,
                      boxSizing: 'border-box',
                      padding: '9px 10px',
                      borderBottom: '1px solid #E0E0E0',
                      background: isToday ? '#E6F2EF' : '#FFFFFF',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: 13, color: isToday ? '#0A4F43' : '#242424' }}>
                      {WEEK_DAYS[d]}
                      {isToday ? ' · Today' : ''}
                    </div>
                    <div style={muted12}>
                      {off ? 'No clinic' : d < TODAY ? 'Completed' : `${day.free.length} free slots`}
                    </div>
                  </div>
                  <SlotColumn hourHeight={H} nowTop={isToday ? nowTop : undefined}>
                    {day.appts.map((a) => {
                      const look = apptLook(a, cur.spec, H);
                      return (
                        <ApptBlock
                          key={a.id}
                          {...look}
                          selected={a.id === picked}
                          title={`${fmt(a.start)} ${a.patient}`}
                          label={`${WEEK_DAYS[d]} ${fmt(a.start)} ${a.patient}, ${a.type}, ${a.status}`}
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
          aria-label="Week summary"
          style={{ flex: '1 1 280px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          <section style={section}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar text={initials(cur.name)} bg={whoBg} fg={whoFg} />
              <div style={{ minWidth: 0 }}>
                <h2 style={h2}>{cur.name}</h2>
                <div style={muted12}>
                  {cur.spec} · {cur.room}
                </div>
              </div>
            </div>
            <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8, textAlign: 'center' }}>
              {[
                { label: 'Booked', value: real.length },
                { label: 'Free slots', value: freeLeft },
                { label: 'Pending', value: real.filter((a) => a.status === 'Pending').length },
              ].map((s) => (
                <div key={s.label} style={statTile}>
                  <dd style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>{s.value}</dd>
                  <dt style={muted12}>{s.label}</dt>
                </div>
              ))}
            </dl>
          </section>

          <section style={section}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <h2 style={h2}>Selected booking</h2>
              {selected && (
                <Pill bg={PILL[selected.status][0]} fg={PILL[selected.status][1]}>
                  {selected.status}
                </Pill>
              )}
            </div>
            {selected ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600 }}>{selected.patient}</div>
                  <div style={muted12}>MRN [MRN] · DOB [DOB]</div>
                </div>
                <dl style={dl(60)}>
                  <dt style={dt}>When</dt>
                  <dd style={dd}>
                    {selDay} Nov, {fmt(selected.start)} – {fmt(selected.start + selected.dur)}
                  </dd>
                  <dt style={dt}>Type</dt>
                  <dd style={dd}>{selected.type}</dd>
                </dl>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <button type="button" style={{ ...btn, flex: '1 1 110px', padding: 0 }}>
                    Reschedule
                  </button>
                  <button type="button" style={{ ...btn, flex: '1 1 110px', padding: 0, color: '#B10E1C' }}>
                    Cancel booking
                  </button>
                </div>
              </div>
            ) : (
              <div style={muted13}>Select an appointment in the week to see its details.</div>
            )}
          </section>

          <section style={{ ...section, gap: 10 }}>
            <h2 style={h2}>Next free slots</h2>
            {nextFree.map((label) => (
              <div
                key={label}
                style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 10, borderTop: '1px solid #EBEBEB' }}
              >
                <div style={{ flex: '1 1 0', fontSize: 13 }}>{label}</div>
                <a href={href('new-booking')} style={linkBtnSm}>
                  Book
                </a>
              </div>
            ))}
            {nextFree.length === 0 && (
              <div style={{ ...muted13, paddingTop: 10, borderTop: '1px solid #EBEBEB' }}>
                No free slots left this week.
              </div>
            )}
          </section>
        </aside>
      </div>
    </>
  );
}
