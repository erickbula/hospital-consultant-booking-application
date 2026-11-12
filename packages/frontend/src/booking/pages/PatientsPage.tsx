import { useState } from 'react';

import { ALL_SPECS, specOptions, type SpecFilter, type Speciality } from '../data';
import { href } from '../nav';
import { btn, btnPrimary, card, chipRow, dd, dl, dt, emptyRow, h2, inlineField, listRow, muted12, muted13, row, section, select, spacer, split, td, th } from '../styles';
import { Avatar, ChipRow, PageTitle, Pill, PlusIcon, SearchBox, SpecPill } from '../ui';

type PatientStatus = 'Booked' | 'Waiting list' | 'No booking';
type Outcome = 'Confirmed' | 'Checked in' | 'Pending' | 'Attended' | 'Did not attend' | 'Cancelled' | 'Waiting';

const STATUS: Record<PatientStatus, [string, string]> = {
  Booked: ['#E6F2EF', '#0A4F43'],
  'Waiting list': ['#FFF4CE', '#6B4E00'],
  'No booking': ['#EBEBEB', '#424242'],
};

const OUTCOME: Record<Outcome, [string, string]> = {
  Confirmed: ['#E6F2EF', '#0A4F43'],
  'Checked in': ['#EBF3FC', '#0F548C'],
  Pending: ['#FFF4CE', '#6B4E00'],
  Attended: ['#EBEBEB', '#424242'],
  'Did not attend': ['#FDE7E9', '#8E0B16'],
  Cancelled: ['#EBEBEB', '#424242'],
  Waiting: ['#FFF4CE', '#6B4E00'],
};

interface Event {
  when: string;
  what: string;
  outcome: Outcome;
}

interface Patient {
  id: string;
  name: string;
  spec: Speciality;
  status: PatientStatus;
  next: string;
  who: string;
  needs: string;
  contact: string;
  events: Event[];
}

const E = (when: string, what: string, outcome: Outcome): Event => ({ when, what, outcome });
const P = (id: string, name: string, spec: Speciality, status: PatientStatus, next: string, who: string, needs: string, contact: string, events: Event[]): Patient =>
  ({ id, name, spec, status, next, who, needs, contact, events });

const ALL: Patient[] = [
  P('p1', 'F. Moreau', 'Cardiology', 'Booked', 'Today 14:30', 'Dr Okafor · New patient', '', 'Text message', [
    E('Wed 11 Nov 2026, 14:30', 'Dr Okafor · New patient · Clinic 2, Rm 4', 'Confirmed'),
    E('Thu 22 Oct 2026', 'GP referral received · Cardiology', 'Attended')]),
  P('p2', 'L. Brennan', 'Cardiology', 'Booked', 'Today 09:30', 'Dr Okafor · Echo review', '', 'Text message', [
    E('Wed 11 Nov 2026, 09:30', 'Dr Okafor · Echo review', 'Confirmed'),
    E('Mon 14 Sep 2026', 'Dr Okafor · New patient', 'Attended')]),
  P('p3', 'R. Patel', 'Cardiology', 'Booked', 'Today 08:30', 'Dr Okafor · New patient', 'Interpreter', 'Phone call', [
    E('Wed 11 Nov 2026, 08:30', 'Dr Okafor · New patient', 'Checked in')]),
  P('p4', 'H. Clarke', 'Cardiology', 'Booked', 'Today 14:00', 'Dr Adeyemi · New patient', '', 'Letter', [
    E('Wed 11 Nov 2026, 14:00', 'Dr Adeyemi · New patient', 'Pending'),
    E('Tue 27 Oct 2026', 'Dr Adeyemi · New patient', 'Did not attend')]),
  P('p5', 'A. Fitzgerald', 'Cardiology', 'Waiting list', 'Not booked', 'Urgent · waiting 6 days', '', 'Phone call', [
    E('Thu 5 Nov 2026', 'Added to Cardiology waiting list · mornings only', 'Waiting')]),
  P('p6', 'B. Sorensen', 'Orthopaedics', 'Booked', 'Today 11:00', 'Mr Whitfield · New patient', 'Patient transport', 'Text message', [
    E('Wed 11 Nov 2026, 11:00', 'Mr Whitfield · New patient · Fracture clinic', 'Confirmed')]),
  P('p7', 'S. Larsen', 'Orthopaedics', 'Waiting list', 'Not booked', 'Routine · waiting 23 days', '', 'Text message', [
    E('Mon 19 Oct 2026', 'Added to Orthopaedics waiting list', 'Waiting')]),
  P('p8', 'G. Marsh', 'Neurology', 'Booked', 'Today 09:00', 'Dr Raman · New patient', '', 'Text message', [
    E('Wed 11 Nov 2026, 09:00', 'Dr Raman · New patient', 'Checked in')]),
  P('p9', 'D. Okonkwo', 'Neurology', 'Waiting list', 'Not booked', 'Routine · waiting 19 days', '', 'Letter', [
    E('Fri 23 Oct 2026', 'Added to Neurology waiting list · not Fridays', 'Waiting'),
    E('Wed 7 Oct 2026', 'Dr Raman · Follow-up', 'Cancelled')]),
  P('p10', 'W. Abbasi', 'Paediatrics', 'Booked', 'Today 10:00', 'Dr Rossi · New patient', 'Interpreter', 'Phone call (parent)', [
    E('Wed 11 Nov 2026, 10:00', 'Dr Rossi · New patient · Children’s OPD', 'Confirmed')]),
  P('p11', 'X. Li', 'Oncology', 'Booked', 'Today 09:00', 'Dr Herrera · New patient', '', 'Text message', [
    E('Wed 11 Nov 2026, 09:00', 'Dr Herrera · New patient', 'Checked in')]),
  P('p12', 'J. Oduya', 'Dermatology', 'No booking', 'None', 'Discharged from clinic', '', 'Letter', [
    E('Fri 30 Oct 2026', 'Dr Tanaka · Follow-up', 'Attended'),
    E('Fri 11 Sep 2026', 'Dr Tanaka · New patient', 'Attended')]),
];

const CHIPS = specOptions(ALL_SPECS);
const cell = { ...td, padding: '8px 12px' };

export function PatientsPage() {
  const [spec, setSpec] = useState<SpecFilter>('All');
  const [status, setStatus] = useState<PatientStatus | 'All'>('All');
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState('p1');

  const q = query.trim().toLowerCase();
  const rows = ALL.filter(
    (p) =>
      (spec === 'All' || p.spec === spec) &&
      (status === 'All' || p.status === status) &&
      (!q || p.name.toLowerCase().includes(q))
  );
  const cur = ALL.find((p) => p.id === picked) ?? ALL[0];
  const dna = cur.events.filter((e) => e.outcome === 'Did not attend').length;
  const attended = cur.events.filter((e) => e.outcome === 'Attended' || e.outcome === 'Checked in').length;

  return (
    <>
      <div style={row}>
        <PageTitle title="Patients" sub={`Showing ${rows.length} of ${ALL.length} sample patients`} />
        <button type="button" style={btnPrimary}>
          <PlusIcon />
          Register patient
        </button>
      </div>

      <div style={chipRow}>
        <SearchBox label="Search patients by name or MRN" placeholder="Search by name or MRN" value={query} onChange={setQuery} />
        <ChipRow options={CHIPS} value={spec} onChange={setSpec} />
        <div style={spacer} />
        <label style={inlineField}>
          Status
          <select
            style={{ ...select, height: 38 }}
            value={status}
            onChange={(e) => setStatus(e.target.value as PatientStatus | 'All')}
          >
            <option value="All">All patients</option>
            <option value="Booked">Booked</option>
            <option value="Waiting list">On waiting list</option>
            <option value="No booking">No booking</option>
          </select>
        </label>
      </div>

      <div style={split}>
        <div style={{ ...card, flex: '999 1 520px', minWidth: 0, overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: 700, borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: 'left', color: '#5C5C5C' }}>
                <th scope="col" style={{ ...th, padding: '12px 16px' }}>Patient</th>
                <th scope="col" style={th}>Speciality</th>
                <th scope="col" style={th}>Next appointment</th>
                <th scope="col" style={th}>Status</th>
                <th scope="col" style={{ ...th, padding: '12px 16px' }}>Needs</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} style={{ background: p.id === picked ? '#E6F2EF' : '#FFFFFF' }}>
                  <td style={{ ...td, padding: '4px 16px' }}>
                    <button
                      type="button"
                      onClick={() => setPicked(p.id)}
                      aria-pressed={p.id === picked}
                      style={{ display: 'block', width: '100%', minHeight: 44, padding: 0, border: 0, background: 'transparent', textAlign: 'left', color: '#242424' }}
                    >
                      <span style={{ display: 'block', fontWeight: 600, fontSize: 14 }}>{p.name}</span>
                      <span style={{ display: 'block', fontSize: 12, color: '#5C5C5C' }}>MRN [MRN] · DOB [DOB]</span>
                    </button>
                  </td>
                  <td style={cell}>
                    <SpecPill spec={p.spec} />
                  </td>
                  <td style={cell}>
                    <div>{p.next}</div>
                    <div style={muted12}>{p.who}</div>
                  </td>
                  <td style={cell}>
                    <Pill bg={STATUS[p.status][0]} fg={STATUS[p.status][1]}>
                      {p.status}
                    </Pill>
                  </td>
                  <td style={{ ...td, padding: '8px 16px', color: '#424242' }}>{p.needs || 'None'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <div style={emptyRow}>No patients match this search.</div>}
        </div>

        <aside
          aria-label="Patient record"
          style={{ flex: '1 1 340px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          <section style={section}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar text={cur.name.replace(/[^A-Z]/g, '').slice(0, 2)} bg="#0A4F43" fg="#FFFFFF" />
              <div style={{ flex: '1 1 0', minWidth: 0 }}>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{cur.name}</h2>
                <div style={muted12}>MRN [MRN] · DOB [DOB]</div>
              </div>
              <Pill bg={STATUS[cur.status][0]} fg={STATUS[cur.status][1]}>
                {cur.status}
              </Pill>
            </div>
            <dl style={dl(100)}>
              <dt style={dt}>Phone</dt>
              <dd style={dd}>[PHONE]</dd>
              <dt style={dt}>GP practice</dt>
              <dd style={dd}>[GP PRACTICE]</dd>
              <dt style={dt}>Contact by</dt>
              <dd style={dd}>{cur.contact}</dd>
              <dt style={dt}>Needs</dt>
              <dd style={dd}>{cur.needs || 'None recorded'}</dd>
              <dt style={dt}>Attendance</dt>
              <dd style={dd}>
                {attended} attended · {dna} did not attend
              </dd>
            </dl>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <a href={href('new-booking')} style={{ ...btnPrimary, flex: '1 1 120px', padding: 0 }}>
                New booking
              </a>
              <a
                href={href('waiting-list')}
                style={{ ...btn, flex: '1 1 150px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', boxSizing: 'border-box' }}
              >
                Add to waiting list
              </a>
              <button type="button" style={{ ...btn, flex: '1 1 100%' }}>
                Edit details
              </button>
            </div>
          </section>

          <section style={{ ...section, gap: 4 }}>
            <h2 style={{ ...h2, margin: '0 0 6px' }}>Appointments</h2>
            {cur.events.map((e) => (
              <div key={e.when + e.what} style={listRow}>
                <div style={{ flex: '1 1 0', minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{e.when}</div>
                  <div style={muted12}>{e.what}</div>
                </div>
                <Pill bg={OUTCOME[e.outcome][0]} fg={OUTCOME[e.outcome][1]}>
                  {e.outcome}
                </Pill>
              </div>
            ))}
            {cur.events.length === 0 && (
              <div style={{ ...muted13, padding: '10px 0', borderTop: '1px solid #EBEBEB' }}>No appointments on record.</div>
            )}
          </section>
        </aside>
      </div>
    </>
  );
}
