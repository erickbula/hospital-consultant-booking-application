import { useState } from 'react';

import { ALL_SPECS, specOptions, type SpecFilter, type Speciality } from '../data';
import { href } from '../nav';
import { btn, btnPrimary, btnSm, chipRow, emptyRow, inlineField, muted12, muted13, row, select, spacer, tableWrap, td, th } from '../styles';
import { ChipRow, Kpi, PageTitle, Pill, PlusIcon, SpecPill } from '../ui';

type Priority = 'Urgent' | 'Two-week wait' | 'Routine';

const PRIORITY: Record<Priority, { target: number; bg: string; fg: string }> = {
  Urgent: { target: 7, bg: '#FDE7E9', fg: '#8E0B16' },
  'Two-week wait': { target: 14, bg: '#FFF4CE', fg: '#6B4E00' },
  Routine: { target: 28, bg: '#EBEBEB', fg: '#424242' },
};

interface Waiter {
  id: string;
  patient: string;
  spec: Speciality;
  priority: Priority;
  days: number;
  referred: string;
  pref: string;
  note: string;
  slot: string;
}

const W = (id: string, patient: string, spec: Speciality, priority: Priority, days: number, referred: string, pref: string, note: string, slot: string): Waiter =>
  ({ id, patient, spec, priority, days, referred, pref, note, slot });

const ALL: Waiter[] = [
  W('w1', 'A. Fitzgerald', 'Cardiology', 'Urgent', 6, '5 Nov', 'Any consultant', 'Mornings only', 'Dr Okafor · Today 11:30'),
  W('w2', 'P. Iyer', 'Cardiology', 'Routine', 31, '11 Oct', 'Dr Adeyemi', 'Any day', 'Dr Adeyemi · Today 15:00'),
  W('w3', 'D. Okonkwo', 'Neurology', 'Routine', 19, '23 Oct', 'Dr Raman', 'Not Fridays', 'Dr Raman · Today 11:30'),
  W('w4', 'T. Varga', 'Neurology', 'Two-week wait', 9, '2 Nov', 'Any consultant', 'Interpreter needed', 'Dr Raman · Mon 16 Nov 09:00'),
  W('w5', 'M. Achebe', 'Neurology', 'Routine', 44, '28 Sep', 'Dr Raman', 'Afternoons', 'Dr Raman · Mon 16 Nov 14:00'),
  W('w6', 'S. Larsen', 'Orthopaedics', 'Routine', 23, '19 Oct', 'Mr Whitfield', 'Any day', 'Mr Whitfield · Mon 16 Nov 09:00'),
  W('w7', 'H. Begum', 'Orthopaedics', 'Routine', 36, '6 Oct', 'Any consultant', 'Patient transport', 'Mr Whitfield · Mon 16 Nov 09:30'),
  W('w8', 'L. Ferrari', 'Paediatrics', 'Urgent', 3, '8 Nov', 'Dr Rossi', 'After school hours', 'Dr Rossi · Thu 12 Nov 16:00'),
  W('w9', 'K. Asante', 'Oncology', 'Two-week wait', 5, '6 Nov', 'Dr Herrera', 'Any day', 'Dr Herrera · Today 15:00'),
  W('w10', 'E. Nilsson', 'Dermatology', 'Routine', 27, '15 Oct', 'Any consultant', 'Video preferred', 'Dr Tanaka · Fri 13 Nov 09:30'),
];

const left = (w: Waiter) => PRIORITY[w.priority].target - w.days;
const plural = (n: number) => (n === 1 ? ' day' : ' days');
const CHIPS = specOptions(ALL_SPECS);
const edgeCell = { ...td, padding: '10px 16px' };

export function WaitingListPage() {
  const [spec, setSpec] = useState<SpecFilter>('All');
  const [priority, setPriority] = useState<Priority | 'All'>('All');
  const [offered, setOffered] = useState(['w8']);
  const [removed, setRemoved] = useState<string[]>([]);

  const live = ALL.filter((w) => !removed.includes(w.id))
    .filter((w) => (spec === 'All' || w.spec === spec) && (priority === 'All' || w.priority === priority))
    .sort((a, b) => left(a) - left(b));

  const overCount = live.filter((w) => left(w) < 0).length;
  const longest = live.reduce((m, w) => Math.max(m, w.days), 0);

  return (
    <>
      <div style={row}>
        <PageTitle title="Waiting list" sub="Patients referred and not yet booked · as of Wednesday 11 November 2026" />
        <button type="button" style={btn}>
          Export
        </button>
        <button type="button" style={btnPrimary}>
          <PlusIcon />
          Add patient to list
        </button>
      </div>

      <div style={chipRow}>
        <span style={{ ...muted13, marginRight: 4 }}>Speciality</span>
        <ChipRow options={CHIPS} value={spec} onChange={setSpec} />
        <div style={spacer} />
        <label style={inlineField}>
          Priority
          <select
            style={{ ...select, height: 38 }}
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority | 'All')}
          >
            <option value="All">All priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="Two-week wait">Two-week wait</option>
            <option value="Routine">Routine</option>
          </select>
        </label>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Kpi label="Waiting" value={String(live.length)} sub={live.length === 1 ? 'patient' : 'patients'} />
        <Kpi label="Over target" value={String(overCount)} sub="past their booking target" />
        <Kpi label="Urgent or two-week wait" value={String(live.filter((w) => w.priority !== 'Routine').length)} sub="need a slot first" />
        <Kpi label="Longest wait" value={`${longest} days`} sub="since referral" />
      </div>

      <div style={tableWrap}>
        <table style={{ width: '100%', minWidth: 1040, borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#5C5C5C' }}>
              <th scope="col" style={{ ...th, padding: '12px 16px' }}>Patient</th>
              <th scope="col" style={th}>Speciality</th>
              <th scope="col" style={th}>Priority</th>
              <th scope="col" style={th}>Waiting</th>
              <th scope="col" style={th}>Preference</th>
              <th scope="col" style={th}>Earliest matching slot</th>
              <th scope="col" style={{ ...th, padding: '12px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {live.map((w) => {
              const l = left(w);
              const over = l < 0;
              const isOffered = offered.includes(w.id);
              return (
                <tr key={w.id}>
                  <td style={edgeCell}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{w.patient}</div>
                    <div style={muted12}>MRN [MRN] · referred {w.referred}</div>
                  </td>
                  <td style={td}>
                    <SpecPill spec={w.spec} />
                  </td>
                  <td style={td}>
                    <Pill bg={PRIORITY[w.priority].bg} fg={PRIORITY[w.priority].fg}>
                      {w.priority}
                    </Pill>
                  </td>
                  <td style={td}>
                    <div style={{ fontWeight: 600 }}>{w.days} days</div>
                    <div style={{ fontSize: 12, color: over ? '#8E0B16' : '#5C5C5C', fontWeight: over ? 600 : 400 }}>
                      {over
                        ? `Over target by ${-l}${plural(-l)}`
                        : l === 0
                          ? 'Target is today'
                          : `${l}${plural(l)} to target`}
                    </div>
                  </td>
                  <td style={td}>
                    <div>{w.pref}</div>
                    <div style={muted12}>{w.note}</div>
                  </td>
                  <td style={td}>
                    <div>{w.slot}</div>
                    {isOffered && (
                      <div style={{ fontSize: 12, color: '#0A4F43', fontWeight: 600 }}>
                        Offer sent by text · awaiting reply
                      </div>
                    )}
                  </td>
                  <td style={{ ...edgeCell, textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <button
                      type="button"
                      onClick={() => setOffered(isOffered ? offered.filter((id) => id !== w.id) : [...offered, w.id])}
                      style={btnSm}
                    >
                      {isOffered ? 'Withdraw offer' : 'Offer slot'}
                    </button>{' '}
                    <a
                      href={href('new-booking')}
                      style={{ display: 'inline-flex', alignItems: 'center', height: 36, padding: '0 12px', borderRadius: 4, background: '#E6F2EF', color: '#0A4F43', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}
                    >
                      Book
                    </a>{' '}
                    <button
                      type="button"
                      onClick={() => setRemoved([...removed, w.id])}
                      aria-label={`Remove ${w.patient} from the waiting list`}
                      style={{ ...btnSm, padding: '0 10px', color: '#B10E1C' }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {live.length === 0 && <div style={emptyRow}>No one is waiting for this filter.</div>}
      </div>
      <div style={muted12}>
        Sorted by time left before the booking target: urgent 7 days, two-week wait 14 days, routine 28 days.
      </div>
    </>
  );
}
