import { useState } from 'react';

import {
  CAL_CONSULTANTS,
  CAL_SPECS,
  hash,
  specOptions,
  type CalConsultant,
  type SpecFilter,
} from '../data';
import { href } from '../nav';
import { ACCENT, btn, card, chipRow, h2, linkBtnSm, listRow, muted12, muted13, section, split, statTile } from '../styles';
import { ChipRow, Pill } from '../ui';
import { CalendarToolbar } from './calendar-parts';

/** Index of Wed 11 Nov in the weekday grid that starts Mon 2 Nov. */
const TODAY = 7;
const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const dateOf = (i: number) => {
  const n = 2 + Math.floor(i / 5) * 7 + (i % 5);
  return n > 30 ? { n: n - 30, m: 'Dec' } : { n, m: 'Nov' };
};

type Load = { leave: true } | { leave: false; cap: number; booked: number };

/** One consultant on one day: null when no clinic runs. */
function load(c: CalConsultant, i: number): Load | null {
  const share = c.clinic[i % 5];
  if (!share) return null;
  if (c.leave.includes(i)) return { leave: true };
  if (i === TODAY) return { leave: false, cap: 18, booked: 18 - c.todayFree };
  const cap = Math.round(15 * share);
  const weeksOut = Math.floor(i / 5) - 1;
  const base = i < TODAY ? 0.8 : Math.max(0.15, 0.78 - 0.2 * weeksOut);
  const fill = Math.min(1, base + (hash(`${c.id}${i}`) % 21) / 100);
  return { leave: false, cap, booked: Math.round(cap * fill) };
}

const CHIPS = specOptions(CAL_SPECS);

export function MonthPage() {
  const [spec, setSpec] = useState<SpecFilter>('All');
  const [whoState, setWho] = useState('all');
  const [day, setDay] = useState(13);

  const inSpec = CAL_CONSULTANTS.filter((c) => spec === 'All' || c.spec === spec);
  const who = inSpec.some((c) => c.id === whoState) ? whoState : 'all';
  const scope = who === 'all' ? inSpec : inSpec.filter((c) => c.id === who);

  const cells = Array.from({ length: 25 }, (_, i) => {
    const dt = dateOf(i);
    const loads = scope.flatMap((c) => {
      const l = load(c, i);
      return l ? [{ c, l }] : [];
    });
    const running = loads.flatMap((x) => (x.l.leave ? [] : [x.l]));
    const away = loads.filter((x) => x.l.leave);
    const cap = running.reduce((n, l) => n + l.cap, 0);
    const booked = running.reduce((n, l) => n + l.booked, 0);
    const free = cap - booked;
    const past = i < TODAY;
    const open = running.length > 0;
    return {
      i,
      dt,
      past,
      open,
      cap,
      booked,
      free,
      clinics: open
        ? `${running.length} ${running.length === 1 ? 'clinic' : 'clinics'}`
        : away.length
          ? 'No clinic running'
          : 'No clinic',
      pct: cap ? Math.round((booked / cap) * 100) : 0,
      main: past ? `${booked} seen` : free === 0 ? 'Full' : `${free} free`,
      rest: past ? '' : `of ${cap}`,
      leave: away.length
        ? away.length === 1
          ? `${away[0].c.name.split(' ').slice(-1)[0]} on leave`
          : `${away.length} on leave`
        : '',
    };
  });

  const ahead = cells.filter((d) => !d.past && d.open);
  const monthFree = ahead.reduce((n, d) => n + d.free, 0);
  const monthBooked = ahead.reduce((n, d) => n + d.booked, 0);
  const firstDay = ahead.find((d) => d.free > 0 && d.i > TODAY);
  const firstFree = firstDay
    ? `${DOW[firstDay.i % 5]} ${firstDay.dt.n} ${firstDay.dt.m} (${firstDay.free} free)`
    : "";

  const sd = dateOf(day);
  const dayPast = day < TODAY;
  const dayRows = scope.flatMap((c) => {
    const l = load(c, day);
    if (!l) return [];
    const free = l.leave ? 0 : l.cap - l.booked;
    return [
      {
        id: c.id,
        name: c.name,
        spec: c.spec,
        detail: l.leave
          ? 'on leave'
          : dayPast
            ? `${l.booked} seen`
            : `${l.booked} of ${l.cap} booked, ${free} free`,
        canBook: !l.leave && !dayPast && free > 0,
      },
    ];
  });
  const dayCell = cells[day];

  return (
    <>
      <CalendarToolbar title="November 2026" view="month" nowLabel="This month" />

      <div style={chipRow}>
        <span style={{ ...muted13, width: 76 }}>Speciality</span>
        <ChipRow
          options={CHIPS}
          value={spec}
          onChange={(n) => {
            setSpec(n);
            setWho('all');
          }}
        />
      </div>
      <div style={chipRow}>
        <span style={{ ...muted13, width: 76 }}>Consultant</span>
        <ChipRow
          square
          options={[{ key: 'all', label: 'All consultants' }, ...inSpec.map((c) => ({ key: c.id, label: c.name }))]}
          value={who}
          onChange={setWho}
        />
      </div>

      <div style={split}>
        <div style={{ ...card, flex: '999 1 560px', minWidth: 0, overflowX: 'auto' }}>
          <div style={{ minWidth: 640 }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
                borderBottom: '1px solid #E0E0E0',
                fontSize: 13,
                fontWeight: 600,
                color: '#5C5C5C',
              }}
            >
              {FULL.map((d) => (
                <div key={d} style={{ padding: '10px 12px' }}>
                  {d}
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' }}>
              {cells.map((d) => {
                const sel = d.i === day;
                const dec = d.dt.m === 'Dec';
                return (
                  <button
                    key={d.i}
                    type="button"
                    onClick={() => setDay(d.i)}
                    aria-pressed={sel}
                    aria-label={`${DOW[d.i % 5]} ${d.dt.n} ${d.dt.m}${d.open ? `, ${d.booked} of ${d.cap} booked` : ', no clinic'}`}
                    style={{
                      minHeight: 116,
                      boxSizing: 'border-box',
                      padding: '8px 12px',
                      border: 0,
                      borderRight: '1px solid #EBEBEB',
                      borderBottom: '1px solid #EBEBEB',
                      background: sel ? '#E6F2EF' : dec ? '#FAFAFA' : '#FFFFFF',
                      outline: sel ? '2px solid #0A4F43' : undefined,
                      outlineOffset: -2,
                      textAlign: 'left',
                      color: '#242424',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                      fontSize: 12,
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 15, fontWeight: 600, color: dec || d.past ? '#5C5C5C' : '#242424' }}>
                        {dec ? `${d.dt.n} Dec` : d.dt.n}
                      </span>
                      {d.i === TODAY && (
                        <Pill bg="#0A4F43" fg="#FFFFFF" small style={{ padding: '1px 8px' }}>
                          Today
                        </Pill>
                      )}
                    </span>
                    {d.open ? (
                      <span style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <span style={{ color: '#5C5C5C' }}>{d.clinics}</span>
                        <span
                          aria-hidden="true"
                          style={{ display: 'block', height: 6, borderRadius: 3, background: '#E0E0E0', overflow: 'hidden' }}
                        >
                          <span
                            style={{ display: 'block', width: `${d.pct}%`, height: 6, background: d.past ? '#8A8A8A' : ACCENT }}
                          />
                        </span>
                        <span>
                          <span style={{ fontWeight: 600 }}>{d.main}</span>{' '}
                          <span style={{ color: '#5C5C5C' }}>{d.rest}</span>
                        </span>
                      </span>
                    ) : (
                      <span style={{ color: '#5C5C5C' }}>{d.clinics}</span>
                    )}
                    {d.leave && (
                      <Pill bg="#FFF4CE" fg="#5C4300" small style={{ alignSelf: 'flex-start', padding: '1px 8px' }}>
                        {d.leave}
                      </Pill>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <aside
          aria-label="Day summary"
          style={{ flex: '1 1 290px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          <section style={{ ...section, gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
              <h2 style={h2}>
                {FULL[day % 5]} {sd.n} {sd.m === 'Dec' ? 'December' : 'November'}
              </h2>
              <span style={muted12}>
                {dayCell.open ? dayCell.main + (dayCell.rest ? ` ${dayCell.rest}` : '') : ''}
              </span>
            </div>
            {dayRows.map((r) => (
              <div key={r.id} style={listRow}>
                <div style={{ flex: '1 1 0', minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{r.name}</div>
                  <div style={muted12}>
                    {r.spec} · {r.detail}
                  </div>
                </div>
                {r.canBook && (
                  <a href={href('new-booking')} style={linkBtnSm}>
                    Book
                  </a>
                )}
              </div>
            ))}
            {dayRows.length === 0 && (
              <div style={{ ...muted13, padding: '10px 0', borderTop: '1px solid #EBEBEB' }}>
                No clinics run on this day for the current filter.
              </div>
            )}
            <a
              href={href('day')}
              style={{ ...btn, marginTop: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
            >
              Open day view
            </a>
          </section>

          <section style={section}>
            <h2 style={h2}>Rest of the month</h2>
            <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8, textAlign: 'center' }}>
              <div style={statTile}>
                <dd style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>{monthFree}</dd>
                <dt style={muted12}>Free slots left</dt>
              </div>
              <div style={statTile}>
                <dd style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>{monthBooked}</dd>
                <dt style={muted12}>Booked ahead</dt>
              </div>
            </dl>
            <div style={{ fontSize: 13, color: '#424242', lineHeight: 1.5 }}>
              {firstFree ? `Next day with space after today: ${firstFree}.` : 'No free slots left in this period.'}
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}
