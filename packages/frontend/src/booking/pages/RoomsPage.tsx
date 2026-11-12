import { useState } from 'react';

import { SPEC, WEEK_DAYS, type Option, type Speciality } from '../data';
import { href } from '../nav';
import { btn, btnPrimary, card, chipRow, dd, dl, dt, emptyRow, field, h2, iconBtn, muted13, row, section, select, split } from '../styles';
import { ChipRow, PageTitle, Pill, PlusIcon } from '../ui';

/** Full name, short name and speciality of each consultant who can hold a session. */
const STAFF: Record<string, [string, string, Speciality]> = {
  ao: ['Dr Amara Okafor', 'Okafor', 'Cardiology'],
  sa: ['Dr Samuel Adeyemi', 'Adeyemi', 'Cardiology'],
  jw: ['Mr James Whitfield', 'Whitfield', 'Orthopaedics'],
  pr: ['Dr Priya Raman', 'Raman', 'Neurology'],
  er: ['Dr Elena Rossi', 'Rossi', 'Paediatrics'],
  th: ['Dr Tomás Herrera', 'Herrera', 'Oncology'],
  mt: ['Dr Mei Tanaka', 'Tanaka', 'Dermatology'],
};

interface Room {
  id: string;
  name: string;
  area: string;
  kit: string;
  access: string;
  /** Mon am, Mon pm, Tue am ... Fri pm: consultant id, or '' when free. */
  sessions: string[];
}

const ROOMS: Room[] = [
  { id: 'c2r4', name: 'Clinic 2, Rm 4', area: 'Clinic 2', kit: 'ECG, echo', access: 'Step-free', sessions: ['ao', 'ao', '', '', 'ao', 'ao', 'ao', 'ao', '', ''] },
  { id: 'c2r6', name: 'Clinic 2, Rm 6', area: 'Clinic 2', kit: 'ECG', access: 'Step-free', sessions: ['', '', 'sa', 'sa', '', 'sa', '', '', 'sa', 'sa'] },
  { id: 'c3r2', name: 'Clinic 3, Rm 2', area: 'Clinic 3', kit: 'Dermatoscope, minor ops', access: 'Step-free, hoist', sessions: ['', '', 'mt', 'mt', '', '', '', '', 'mt', 'mt'] },
  { id: 'c5r1', name: 'Clinic 5, Rm 1', area: 'Clinic 5', kit: 'Exam couch', access: 'Step-free', sessions: ['pr', 'pr', '', '', 'pr', 'pr', '', '', 'pr', 'pr'] },
  { id: 'c5r3', name: 'Clinic 5, Rm 3', area: 'Clinic 5', kit: 'Exam couch', access: 'Step-free', sessions: ['', '', '', '', '', '', '', '', '', ''] },
  { id: 'c7r2', name: 'Clinic 7, Rm 2', area: 'Clinic 7', kit: 'Exam couch, phlebotomy', access: 'Step-free', sessions: ['', '', '', '', 'th', 'th', 'th', 'th', 'th', 'th'] },
  { id: 'frac', name: 'Fracture clinic', area: 'Other', kit: 'Plaster room, X-ray nearby', access: 'Step-free, wide door', sessions: ['jw', 'jw', '', '', 'jw', '', '', '', '', ''] },
  { id: 'copd', name: 'Children’s OPD', area: 'Other', kit: 'Paediatric scales, play area', access: 'Step-free', sessions: ['er', 'er', 'er', 'er', 'er', 'er', 'er', 'er', '', ''] },
];

const AREAS: Option<string>[] = ['All', 'Clinic 2', 'Clinic 3', 'Clinic 5', 'Clinic 7', 'Other'].map((a) => ({
  key: a,
  label: a === 'All' ? 'All areas' : a,
}));

const TODAY = 2;
const sessionName = (i: number) => `${WEEK_DAYS[Math.floor(i / 2)]} Nov, ${i % 2 ? 'afternoon' : 'morning'}`;

export function RoomsPage() {
  const [area, setArea] = useState('All');
  const [freeOnly, setFreeOnly] = useState(false);
  const [roomId, setRoomId] = useState('c3r2');
  const [cell, setCell] = useState('c3r2|6');
  const [over, setOver] = useState<Record<string, string>>({});
  const [closed, setClosed] = useState<Record<string, boolean>>({ c5r3: true });
  const [assignee, setAssignee] = useState('mt');

  const at = (room: Room, i: number) => over[`${room.id}|${i}`] ?? room.sessions[i];
  const freeCount = (room: Room) =>
    closed[room.id] ? 0 : room.sessions.filter((_, i) => !at(room, i)).length;

  const shown = ROOMS.filter((r) => (area === 'All' || r.area === area) && (!freeOnly || freeCount(r) > 0));
  const cur = ROOMS.find((r) => r.id === roomId) ?? ROOMS[0];
  const curClosed = !!closed[cur.id];
  const used = 10 - cur.sessions.filter((_, i) => !at(cur, i)).length;

  const [cellRoomId, cellIndex] = cell.split('|');
  const cellRoom = ROOMS.find((r) => r.id === cellRoomId) ?? cur;
  const ci = Number(cellIndex);
  const cid = at(cellRoom, ci);
  const cellClosed = !!closed[cellRoom.id];

  const totalFree = ROOMS.reduce((n, r) => n + freeCount(r), 0);
  const closedCount = ROOMS.filter((r) => closed[r.id]).length;

  return (
    <>
      <div style={row}>
        <PageTitle
          title="Rooms"
          sub={`Clinic room timetable · week of 9 – 13 November 2026 · ${ROOMS.length} rooms, ${totalFree} free sessions, ${closedCount} out of service`}
        />
        <div style={{ display: 'flex', gap: 4 }}>
          <button type="button" aria-label="Previous week" style={iconBtn}>
            ‹
          </button>
          <button type="button" style={btn}>
            This week
          </button>
          <button type="button" aria-label="Next week" style={iconBtn}>
            ›
          </button>
        </div>
        <button type="button" style={btnPrimary}>
          <PlusIcon />
          Add room
        </button>
      </div>

      <div style={chipRow}>
        <span style={{ ...muted13, marginRight: 4 }}>Area</span>
        <ChipRow options={AREAS} value={area} onChange={setArea} />
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, minHeight: 36, marginLeft: 8, fontSize: 13 }}>
          <input type="checkbox" checked={freeOnly} onChange={() => setFreeOnly(!freeOnly)} /> Only rooms with free sessions
        </label>
      </div>

      <div style={split}>
        <div style={{ ...card, flex: '999 1 560px', minWidth: 0, overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: 880, borderCollapse: 'collapse', fontSize: 12, tableLayout: 'fixed' }}>
            <thead>
              <tr>
                <th scope="col" rowSpan={2} style={{ width: 168, padding: '10px 12px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#5C5C5C', borderBottom: '1px solid #E0E0E0' }}>
                  Room
                </th>
                {WEEK_DAYS.map((d, i) => (
                  <th
                    key={d}
                    scope="colgroup"
                    colSpan={2}
                    style={{ padding: '8px 4px 2px', fontSize: 13, fontWeight: 600, borderLeft: '1px solid #E0E0E0', background: i === TODAY ? '#E6F2EF' : '#FFFFFF', color: i === TODAY ? '#0A4F43' : '#242424' }}
                  >
                    {d}
                    {i === TODAY ? ' · Today' : ''}
                  </th>
                ))}
              </tr>
              <tr>
                {Array.from({ length: 10 }, (_, i) => (
                  <th
                    key={i}
                    scope="col"
                    style={{ padding: '2px 4px 8px', fontWeight: 400, color: '#5C5C5C', borderBottom: '1px solid #E0E0E0', borderLeft: i % 2 ? 0 : '1px solid #E0E0E0', background: Math.floor(i / 2) === TODAY ? '#E6F2EF' : '#FFFFFF' }}
                  >
                    {i % 2 ? 'pm' : 'am'}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => {
                const isClosed = !!closed[r.id];
                return (
                  <tr key={r.id}>
                    <th scope="row" style={{ padding: '6px 12px', textAlign: 'left', borderBottom: '1px solid #EBEBEB', background: r.id === roomId ? '#E6F2EF' : '#FFFFFF' }}>
                      <button
                        type="button"
                        onClick={() => setRoomId(r.id)}
                        style={{ display: 'block', width: '100%', minHeight: 44, padding: 0, border: 0, background: 'transparent', textAlign: 'left', color: '#242424' }}
                      >
                        <span style={{ display: 'block', fontWeight: 600, fontSize: 13 }}>{r.name}</span>
                        <span style={{ display: 'block', fontSize: 12, fontWeight: 400, color: '#5C5C5C' }}>
                          {isClosed ? 'Out of service' : `${freeCount(r)} free of 10`}
                        </span>
                      </button>
                    </th>
                    {r.sessions.map((_, i) => {
                      const key = `${r.id}|${i}`;
                      const id = at(r, i);
                      const who = id ? STAFF[id] : undefined;
                      const col = who ? SPEC[who[2]] : undefined;
                      return (
                        <td key={key} style={{ padding: '4px 3px', borderBottom: '1px solid #EBEBEB', borderLeft: i % 2 ? 0 : '1px solid #E0E0E0' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setCell(key);
                              setRoomId(r.id);
                            }}
                            aria-pressed={key === cell}
                            aria-label={`${r.name}, ${sessionName(i)}, ${isClosed ? 'closed' : who ? who[0] : 'free'}`}
                            style={{
                              width: '100%',
                              height: 44,
                              padding: '0 2px',
                              borderRadius: 4,
                              border: isClosed ? '1px solid #D1D1D1' : col ? `1px solid ${col[1]}` : '1px dashed #8A8A8A',
                              background: isClosed ? '#EBEBEB' : col ? col[0] : '#FFFFFF',
                              color: isClosed ? '#424242' : col ? col[1] : '#5C5C5C',
                              outline: key === cell ? '2px solid #242424' : undefined,
                              outlineOffset: 1,
                              fontSize: 12,
                              fontWeight: who && !isClosed ? 600 : 400,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {isClosed ? 'Closed' : who ? who[1] : 'Free'}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
          {shown.length === 0 && <div style={{ ...emptyRow, fontSize: 14 }}>No rooms match this filter.</div>}
        </div>

        <aside
          aria-label="Room details"
          style={{ flex: '1 1 280px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          <section style={section}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <h2 style={h2}>{cur.name}</h2>
              <Pill bg={curClosed ? '#EBEBEB' : '#E6F2EF'} fg={curClosed ? '#424242' : '#0A4F43'}>
                {curClosed ? 'Out of service' : 'Available'}
              </Pill>
            </div>
            <dl style={dl(92)}>
              <dt style={dt}>Area</dt>
              <dd style={dd}>{cur.area}</dd>
              <dt style={dt}>Equipment</dt>
              <dd style={dd}>{cur.kit}</dd>
              <dt style={dt}>Access</dt>
              <dd style={dd}>{cur.access}</dd>
              <dt style={dt}>This week</dt>
              <dd style={dd}>{curClosed ? 'Closed for maintenance' : `${used} of 10 sessions in use`}</dd>
            </dl>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <button type="button" style={{ ...btn, flex: '1 1 110px', padding: 0 }}>
                Edit room
              </button>
              <button
                type="button"
                onClick={() => setClosed({ ...closed, [cur.id]: !curClosed })}
                style={{ ...btn, flex: '1 1 150px', padding: 0 }}
              >
                {curClosed ? 'Return to service' : 'Mark out of service'}
              </button>
            </div>
          </section>

          <section style={section}>
            <h2 style={h2}>Selected session</h2>
            <div>
              <div style={{ fontWeight: 600 }}>
                {cellRoom.name} · {sessionName(ci)}
              </div>
              <div style={muted13}>
                {cellClosed
                  ? 'Room is out of service'
                  : cid
                    ? `${STAFF[cid][0]} · ${STAFF[cid][2]} clinic`
                    : 'Free session'}
              </div>
            </div>
            {!cellClosed && !cid && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <label style={field}>
                  Assign to consultant
                  <select style={select} value={assignee} onChange={(e) => setAssignee(e.target.value)}>
                    {Object.entries(STAFF).map(([id, s]) => (
                      <option key={id} value={id}>
                        {s[0]} · {s[2]}
                      </option>
                    ))}
                  </select>
                </label>
                <button type="button" onClick={() => setOver({ ...over, [cell]: assignee })} style={btnPrimary}>
                  Assign session
                </button>
              </div>
            )}
            {!cellClosed && !!cid && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <a
                  href={href('week')}
                  style={{ ...btn, flex: '1 1 110px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
                >
                  Open diary
                </a>
                <button
                  type="button"
                  onClick={() => setOver({ ...over, [cell]: '' })}
                  style={{ ...btn, flex: '1 1 130px', padding: 0, color: '#B10E1C' }}
                >
                  Release session
                </button>
              </div>
            )}
          </section>
        </aside>
      </div>
    </>
  );
}
