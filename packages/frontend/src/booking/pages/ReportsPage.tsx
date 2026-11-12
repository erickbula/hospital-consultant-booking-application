import { useState } from 'react';

import { ALL_SPECS, DIRECTORY, specOptions, type SpecFilter, type Speciality } from '../data';
import { href, type Page } from '../nav';
import { ACCENT, btn, chipRow, h2, inlineField, listRow, muted12, muted13, row, section, select } from '../styles';
import { ChipRow, Kpi, PageTitle, Pill } from '../ui';

const TARGET = 28;
const SCALE = 50;

const STATS: Record<Speciality, { wait: number; dna: number; cancel: number }> = {
  Cardiology: { wait: 18, dna: 6.1, cancel: 4 },
  Orthopaedics: { wait: 34, dna: 8.4, cancel: 3 },
  Neurology: { wait: 41, dna: 7.2, cancel: 2 },
  Paediatrics: { wait: 12, dna: 9.8, cancel: 5 },
  Oncology: { wait: 9, dna: 3.1, cancel: 1 },
  Dermatology: { wait: 27, dna: 5.5, cancel: 2 },
};

const ALERTS: { spec: Speciality; text: string; action: string; to: Page }[] = [
  { spec: 'Neurology', text: 'Neurology median wait is 41 days, 13 over target.', action: 'Waiting list', to: 'waiting-list' },
  { spec: 'Orthopaedics', text: 'Orthopaedics median wait is 34 days, 6 over target.', action: 'Waiting list', to: 'waiting-list' },
  { spec: 'Orthopaedics', text: 'Ms Hannah Lindqvist is on leave until 23 Nov with 18 bookings to reassign.', action: 'Reassign', to: 'consultants' },
  { spec: 'Orthopaedics', text: 'Mr James Whitfield is 95% booked this week.', action: 'Open diary', to: 'day' },
  { spec: 'Dermatology', text: 'Dr Mei Tanaka leaves on 30 Nov with 12 future bookings.', action: 'Reassign', to: 'consultants' },
];

const DAY_SHARE = [0.22, 0.2, 0.21, 0.19];
const DAY_NAMES = ['Monday 9', 'Tuesday 10', 'Wednesday 11', 'Thursday 12', 'Friday 13'];
const DAY_LABELS = ['Mon 9', 'Tue 10', 'Wed 11', 'Thu 12', 'Fri 13'];
const CHIPS = specOptions(ALL_SPECS);

const chartCard = (grow: number, basis: number) =>
  ({ ...section, flex: `${grow} 1 ${basis}px`, minWidth: 0 }) as const;

export function ReportsPage() {
  const [spec, setSpec] = useState<SpecFilter>('All');

  const inScope = (s: Speciality) => spec === 'All' || s === spec;
  const list = DIRECTORY.filter((c) => inScope(c.spec));
  const names = ALL_SPECS.filter(inScope);
  const booked = list.reduce((s, c) => s + c.booked, 0);
  const cap = list.reduce((s, c) => s + c.cap, 0);
  const bySpec = (n: Speciality) =>
    DIRECTORY.filter((c) => c.spec === n).reduce((s, c) => s + c.booked, 0);
  const dna = names.reduce((s, n) => s + STATS[n].dna * bySpec(n), 0) / (booked || 1);
  const cancels = names.reduce((s, n) => s + STATS[n].cancel, 0);
  const sorted = names.map((n) => STATS[n].wait).sort((a, b) => a - b);
  const mid = sorted.length / 2;
  const medWait =
    sorted.length % 2 ? sorted[Math.floor(mid)] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);

  const util = [...list].sort((a, b) => b.booked / b.cap - a.booked / a.cap);
  const dayVals = DAY_SHARE.map((w) => Math.round(booked * w));
  dayVals.push(booked - dayVals.reduce((s, v) => s + v, 0));
  const maxDay = Math.max(...dayVals) || 1;
  const alerts = ALERTS.filter((a) => inScope(a.spec));

  return (
    <>
      <div style={row}>
        <PageTitle title="Reports" sub="Week of 9 – 13 November 2026 · sample data · refreshed today 10:30" />
        <label style={inlineField}>
          Period
          <select style={select}>
            <option>This week</option>
            <option>Last week</option>
            <option>This month</option>
            <option>Last 3 months</option>
            <option>Custom range…</option>
          </select>
        </label>
        <button type="button" style={btn}>
          Export
        </button>
      </div>

      <div style={chipRow}>
        <span style={{ ...muted13, marginRight: 4 }}>Speciality</span>
        <ChipRow options={CHIPS} value={spec} onChange={setSpec} />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Kpi large label="Bookings" value={String(booked)} sub={`of ${cap} available slots`} />
        <Kpi large label="Utilisation" value={`${Math.round((booked / cap) * 100)}%`} sub={`${list.length} ${list.length === 1 ? 'consultant' : 'consultants'}`} />
        <Kpi large label="Did not attend" value={`${dna.toFixed(1)}%`} sub="of completed clinic days" />
        <Kpi large label="Median wait" value={`${medWait} days`} sub={`target ${TARGET} days`} />
        <Kpi large label="Cancellations" value={String(cancels)} sub="by patient or hospital" />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'stretch' }}>
        <section style={chartCard(3, 420)}>
          <div>
            <h2 style={h2}>Utilisation by consultant</h2>
            <div style={{ ...muted12, marginTop: 2 }}>Booked slots as a share of clinic capacity this week</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {util.map((c) => {
              const pct = Math.round((c.booked / c.cap) * 100);
              return (
                <div
                  key={c.id}
                  title={`${c.name} (${c.spec}): ${c.booked} of ${c.cap} slots booked`}
                  style={{ display: 'grid', gridTemplateColumns: 'minmax(110px, 170px) minmax(0, 1fr) 96px', gap: 12, alignItems: 'center', fontSize: 13 }}
                >
                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                  <div style={{ borderLeft: '1px solid #C7C7C7', height: 20, display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: `${pct}%`, height: 10, borderRadius: '0 4px 4px 0', background: ACCENT }} />
                  </div>
                  <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <span style={{ fontWeight: 600 }}>{pct}%</span>{' '}
                    <span style={{ color: '#5C5C5C' }}>
                      {c.booked}/{c.cap}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section style={chartCard(2, 320)}>
          <div>
            <h2 style={h2}>Bookings by day</h2>
            <div style={{ ...muted12, marginTop: 2 }}>Appointments booked for each clinic day</div>
          </div>
          <div style={{ flex: '1 1 auto', display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 8, alignItems: 'end', borderBottom: '1px solid #C7C7C7', minHeight: 190 }}>
            {dayVals.map((v, i) => (
              <div
                key={DAY_NAMES[i]}
                title={`${DAY_NAMES[i]} November: ${v} bookings`}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
              >
                <div style={{ fontSize: 13, fontWeight: 600 }}>{v}</div>
                <div style={{ width: 28, height: Math.max(2, Math.round((v / maxDay) * 150)), borderRadius: '4px 4px 0 0', background: ACCENT }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 8, fontSize: 12, color: '#5C5C5C', textAlign: 'center' }}>
            {DAY_LABELS.map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>
        </section>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'stretch' }}>
        <section style={chartCard(3, 420)}>
          <div>
            <h2 style={h2}>Median wait for a first appointment</h2>
            <div style={{ ...muted12, marginTop: 2 }}>
              Days from referral, by speciality · the vertical line marks the 28-day target
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {names.map((n) => {
              const days = STATS[n].wait;
              return (
                <div
                  key={n}
                  title={`${n}: median ${days} days, target ${TARGET}`}
                  style={{ display: 'grid', gridTemplateColumns: 'minmax(110px, 170px) minmax(0, 1fr) 150px', gap: 12, alignItems: 'center', fontSize: 13 }}
                >
                  <div>{n}</div>
                  <div style={{ position: 'relative', borderLeft: '1px solid #C7C7C7', height: 24, display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: `${Math.round((days / SCALE) * 100)}%`, height: 10, borderRadius: '0 4px 4px 0', background: ACCENT }} />
                    <div aria-hidden="true" style={{ position: 'absolute', left: `${(TARGET / SCALE) * 100}%`, top: 0, bottom: 0, width: 2, background: '#242424' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, whiteSpace: 'nowrap' }}>
                    {days > TARGET && (
                      <Pill bg="#FFF4CE" fg="#5C4300" small>
                        Over target
                      </Pill>
                    )}
                    <span style={{ fontWeight: 600 }}>{days} days</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section style={{ ...chartCard(2, 320), gap: 4 }}>
          <h2 style={{ ...h2, margin: '0 0 6px' }}>Needs attention</h2>
          {alerts.map((a) => (
            <div key={a.text} style={listRow}>
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8A3707" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 18px' }}>
                <path d="M12 4l9 16H3zM12 10v4M12 17v.5" />
              </svg>
              <div style={{ flex: '1 1 0', minWidth: 0, fontSize: 13, lineHeight: 1.4 }}>{a.text}</div>
              <a href={href(a.to)} style={{ display: 'inline-flex', alignItems: 'center', height: 36, fontSize: 13, whiteSpace: 'nowrap' }}>
                {a.action}
              </a>
            </div>
          ))}
          {alerts.length === 0 && (
            <div style={{ ...muted13, padding: '10px 0', borderTop: '1px solid #EBEBEB' }}>
              Nothing needs attention for this speciality.
            </div>
          )}
        </section>
      </div>
    </>
  );
}
