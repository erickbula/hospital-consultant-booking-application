import { useEffect, useState } from 'react';

import {
  ALL_SPECS,
  DIRECTORY,
  SPEC,
  initials,
  specOptions,
  type ConsultantStatus,
  type SpecFilter,
} from '../data';
import { href } from '../nav';
import { btn, btnPrimary, btnSm, chipRow, emptyRow, field, input, row, select, tableWrap, td, th } from '../styles';
import { Avatar, ChipRow, PageTitle, Pill, PlusIcon, SearchBox, SpecPill } from '../ui';

const STATUS: Record<ConsultantStatus, [string, string]> = {
  Active: ['#E6F2EF', '#0A4F43'],
  'On leave': ['#FFF4CE', '#6B4E00'],
  Leaving: ['#EBEBEB', '#424242'],
};

const CHIPS = specOptions(ALL_SPECS);
const edgeCell = { ...td, padding: '10px 16px' };

export function ConsultantsPage() {
  const [spec, setSpec] = useState<SpecFilter>('All');
  const [query, setQuery] = useState('');
  const [removed, setRemoved] = useState<string[]>([]);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [undoId, setUndoId] = useState<string | null>(null);

  const live = DIRECTORY.filter((c) => !removed.includes(c.id));
  const q = query.trim().toLowerCase();
  const rows = live.filter(
    (c) => (spec === 'All' || c.spec === spec) && (!q || c.name.toLowerCase().includes(q))
  );
  const target = DIRECTORY.find((c) => c.id === confirmId);
  const undone = DIRECTORY.find((c) => c.id === undoId);

  useEffect(() => {
    if (!confirmId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setConfirmId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [confirmId]);

  return (
    <>
      <div style={row}>
        <PageTitle
          basis={240}
          title="Consultants"
          sub={`${live.length} consultants across ${ALL_SPECS.length} specialities · showing ${rows.length}`}
        />
        <button type="button" style={btn}>
          Export list
        </button>
        <a href={href('add-consultant')} style={btnPrimary}>
          <PlusIcon />
          Add consultant
        </a>
      </div>

      <div style={chipRow}>
        <SearchBox label="Search consultants by name" placeholder="Search by name" value={query} onChange={setQuery} />
        <ChipRow options={CHIPS} value={spec} onChange={setSpec} />
      </div>

      {undone && (
        <div
          role="status"
          style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', padding: '10px 14px', borderRadius: 4, background: '#E6F2EF', color: '#0A4F43', fontSize: 13 }}
        >
          <span style={{ flex: '1 1 240px' }}>
            {undone.name} was removed. Future bookings moved to the reassignment queue.
          </span>
          <button
            type="button"
            onClick={() => {
              setRemoved(removed.filter((id) => id !== undoId));
              setUndoId(null);
            }}
            style={{ height: 32, padding: '0 12px', border: '1px solid #0A4F43', borderRadius: 4, background: '#FFFFFF', color: '#0A4F43', fontSize: 13, fontWeight: 600 }}
          >
            Undo
          </button>
        </div>
      )}

      <div style={tableWrap}>
        <table style={{ width: '100%', minWidth: 900, borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#5C5C5C' }}>
              <th scope="col" style={{ ...th, padding: '12px 16px' }}>Consultant</th>
              <th scope="col" style={th}>Speciality</th>
              <th scope="col" style={th}>Clinic days</th>
              <th scope="col" style={th}>Next available</th>
              <th scope="col" style={th}>Booked this week</th>
              <th scope="col" style={th}>Status</th>
              <th scope="col" style={{ ...th, padding: '12px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id}>
                <td style={edgeCell}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar text={initials(c.name)} bg={SPEC[c.spec][0]} fg={SPEC[c.spec][1]} size={36} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: '#5C5C5C' }}>{c.sub}</div>
                    </div>
                  </div>
                </td>
                <td style={td}>
                  <SpecPill spec={c.spec} />
                </td>
                <td style={td}>{c.days}</td>
                <td style={td}>{c.next}</td>
                <td style={td}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div aria-hidden="true" style={{ width: 72, height: 6, borderRadius: 3, background: '#E0E0E0', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.round((c.booked / c.cap) * 100)}%`, height: 6, background: '#0F6C5C' }} />
                    </div>
                    <span>
                      {c.booked} of {c.cap}
                    </span>
                  </div>
                </td>
                <td style={td}>
                  <Pill bg={STATUS[c.status][0]} fg={STATUS[c.status][1]}>
                    {c.status}
                  </Pill>
                </td>
                <td style={{ ...edgeCell, textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <a href={href('day')} style={{ display: 'inline-flex', alignItems: 'center', height: 36, padding: '0 10px', fontSize: 13 }}>
                    Diary
                  </a>{' '}
                  <button type="button" style={btnSm}>
                    Edit
                  </button>{' '}
                  <button
                    type="button"
                    aria-label={`Remove ${c.name}`}
                    onClick={() => setConfirmId(c.id)}
                    style={{ ...btnSm, color: '#B10E1C' }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <div style={emptyRow}>No consultants match this filter.</div>}
      </div>

      {target && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 10, background: 'rgba(0, 0, 0, 0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, boxSizing: 'border-box' }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Remove consultant"
            style={{ width: '100%', maxWidth: 480, boxSizing: 'border-box', background: '#FFFFFF', borderRadius: 8, padding: 24, display: 'flex', flexDirection: 'column', gap: 14, boxShadow: '0 16px 48px rgba(0, 0, 0, 0.25)' }}
          >
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Remove {target.name}?</h2>
            <p style={{ margin: 0, color: '#424242', lineHeight: 1.5 }}>
              They will no longer appear in the calendar or be bookable. Past appointments stay in each patient’s record.
            </p>
            <div style={{ padding: 12, borderRadius: 4, background: '#FFF4CE', color: '#5C4300', fontSize: 13, lineHeight: 1.5 }}>
              {target.name} has <strong>{target.future} future bookings</strong>. Choose what happens to them before removing.
            </div>
            <label style={field}>
              Future bookings
              <select style={select}>
                <option>Move to reassignment queue</option>
                <option>Reassign to another {target.spec} consultant</option>
                <option>Cancel and notify patients</option>
              </select>
            </label>
            <label style={field}>
              Last working day
              <input type="date" defaultValue="2026-11-30" style={{ ...input, padding: '0 10px' }} />
            </label>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, flexWrap: 'wrap' }}>
              <button type="button" autoFocus onClick={() => setConfirmId(null)} style={{ ...btn, padding: '0 16px' }}>
                Keep consultant
              </button>
              <button
                type="button"
                onClick={() => {
                  setRemoved([...removed, target.id]);
                  setUndoId(target.id);
                  setConfirmId(null);
                }}
                style={{ ...btnPrimary, background: '#B10E1C' }}
              >
                Remove consultant
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
