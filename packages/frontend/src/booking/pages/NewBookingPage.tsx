import { useState } from 'react';

import { ALL_SPECS, type Speciality } from '../data';
import { href } from '../nav';
import { ACCENT, btn, btnPrimary, card, check, dd, dl, dt, field, grid2, h1, h2, input, muted13, section, select, split } from '../styles';
import { Avatar } from '../ui';

const TEAM: Record<Speciality, string[]> = {
  Cardiology: ['Dr Amara Okafor', 'Dr Samuel Adeyemi'],
  Orthopaedics: ['Mr James Whitfield', 'Ms Hannah Lindqvist'],
  Neurology: ['Dr Priya Raman'],
  Paediatrics: ['Dr Elena Rossi'],
  Oncology: ['Dr Tomás Herrera'],
  Dermatology: ['Dr Mei Tanaka'],
};

const WEEK: [string, string[]][] = [
  ['Mon 16 Nov', ['09:00', '11:30', '14:00', '15:30']],
  ['Tue 17 Nov', ['08:30', '10:30', '11:00', '13:30', '16:00']],
  ['Wed 18 Nov', []],
  ['Thu 19 Nov', ['09:30', '10:00', '14:30']],
  ['Fri 20 Nov', ['08:30', '09:00', '11:00', '12:00']],
];

const fieldset = {
  border: 0,
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
} as const;

const laterFieldset = {
  ...fieldset,
  padding: '18px 0 0',
  borderTop: '1px solid #EBEBEB',
} as const;

const legend = {
  padding: 0,
  fontSize: 15,
  fontWeight: 600,
  marginBottom: 10,
} as const;

const laterLegend = { ...legend, float: 'left', width: '100%' } as const;

export function NewBookingPage() {
  const [spec, setSpec] = useState<Speciality>('Cardiology');
  const [consultantState, setConsultant] = useState('Dr Amara Okafor');
  const [slot, setSlot] = useState('Tue 17 Nov|10:30');

  const names = ['Any available consultant', ...TEAM[spec]];
  const consultant = names.includes(consultantState) ? consultantState : TEAM[spec][0];
  const [slotDay, slotTime] = slot.split('|');

  return (
    <>
      <div>
        <div style={muted13}>
          <a href={href('day')}>Calendar</a> / New booking
        </div>
        <h1 style={{ ...h1, margin: '4px 0 0' }}>New booking</h1>
      </div>

      <div style={split}>
        <form
          onSubmit={(e) => e.preventDefault()}
          style={{ ...card, flex: '999 1 460px', minWidth: 0, padding: 20, display: 'flex', flexDirection: 'column', gap: 18 }}
        >
          <fieldset style={fieldset}>
            <legend style={legend}>1. Patient</legend>
            <label style={field}>
              Find patient
              <input type="search" defaultValue="Moreau" style={input} />
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                flexWrap: 'wrap',
                padding: 12,
                border: '1px solid #0F6C5C',
                borderRadius: 4,
                background: '#E6F2EF',
              }}
            >
              <Avatar text="FM" bg="#0A4F43" fg="#FFFFFF" size={36} />
              <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                <div style={{ fontWeight: 600 }}>Fiona Moreau</div>
                <div style={{ fontSize: 12, color: '#424242' }}>MRN [MRN] · DOB [DOB] · [PHONE]</div>
              </div>
              <div style={{ fontSize: 12, color: '#424242' }}>1 upcoming booking · no DNAs</div>
            </div>
            <div style={grid2}>
              <label style={field}>
                Referral source
                <select style={select}>
                  <option>GP referral</option>
                  <option>Internal referral</option>
                  <option>Emergency department</option>
                  <option>Self-referral</option>
                </select>
              </label>
              <label style={field}>
                Priority
                <select style={select}>
                  <option>Routine</option>
                  <option>Urgent</option>
                  <option>Two-week wait</option>
                </select>
              </label>
            </div>
          </fieldset>

          <fieldset style={laterFieldset}>
            <legend style={laterLegend}>2. Appointment</legend>
            <div style={{ ...grid2, clear: 'both' }}>
              <label style={field}>
                Speciality
                <select
                  style={select}
                  value={spec}
                  onChange={(e) => {
                    const next = e.target.value as Speciality;
                    setSpec(next);
                    setConsultant(TEAM[next][0]);
                  }}
                >
                  {ALL_SPECS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <label style={field}>
                Consultant
                <select style={select} value={consultant} onChange={(e) => setConsultant(e.target.value)}>
                  {names.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
              <label style={field}>
                Appointment type
                <select style={select}>
                  <option>New patient</option>
                  <option>Follow-up</option>
                  <option>Results</option>
                  <option>Pre-operative assessment</option>
                  <option>Post-op check</option>
                </select>
              </label>
              <label style={field}>
                Duration
                <select style={select}>
                  <option>30 minutes</option>
                  <option>15 minutes</option>
                  <option>45 minutes</option>
                  <option>60 minutes</option>
                </select>
              </label>
            </div>
            <div role="radiogroup" aria-label="Consultation mode" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 20px', alignItems: 'center' }}>
              <span style={{ fontSize: 13 }}>Consultation mode</span>
              {['In person', 'Video', 'Telephone'].map((m, i) => (
                <label key={m} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 36 }}>
                  <input type="radio" name="mode" defaultChecked={i === 0} /> {m}
                </label>
              ))}
            </div>
            <label style={field}>
              Location
              <select style={select}>
                <option>Consultant’s usual clinic room</option>
                <option>Clinic 2, Rm 4</option>
                <option>Clinic 2, Rm 6</option>
                <option>Clinic 5, Rm 1</option>
              </select>
            </label>
          </fieldset>

          <fieldset style={laterFieldset}>
            <legend style={laterLegend}>3. Notes and requirements</legend>
            <label style={{ ...field, clear: 'both' }}>
              Booking notes
              <textarea
                rows={2}
                placeholder="Reason for referral, access needs, tests to bring"
                style={{ padding: '8px 12px', border: '1px solid #8A8A8A', borderRadius: 4, fontSize: 14, color: '#242424', background: '#FFFFFF', resize: 'vertical' }}
              />
            </label>
            <div style={{ ...grid2, gap: '4px 12px' }}>
              <label style={check}>
                <input type="checkbox" defaultChecked /> Text message confirmation
              </label>
              <label style={check}>
                <input type="checkbox" defaultChecked /> Reminder 48 hours before
              </label>
              <label style={check}>
                <input type="checkbox" /> Interpreter required
              </label>
              <label style={check}>
                <input type="checkbox" /> Patient transport required
              </label>
            </div>
          </fieldset>
        </form>

        <div style={{ flex: '1 1 400px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <section style={section}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <h2 style={{ ...h2, flex: '1 1 160px' }}>Available slots</h2>
              <button type="button" aria-label="Previous week" style={{ ...btn, width: 36, height: 36, padding: 0, fontSize: 16 }}>
                ‹
              </button>
              <span style={{ fontSize: 13 }}>16 – 20 Nov 2026</span>
              <button type="button" aria-label="Next week" style={{ ...btn, width: 36, height: 36, padding: 0, fontSize: 16 }}>
                ›
              </button>
            </div>
            <div style={muted13}>
              {consultant} · {spec} · 30 minute slots
            </div>
            <div style={{ overflowX: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(72px, 1fr))', gap: 8, minWidth: 392 }}>
                {WEEK.map(([label, times]) => (
                  <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ textAlign: 'center', fontSize: 12, fontWeight: 600, paddingBottom: 6, borderBottom: '1px solid #E0E0E0' }}>
                      {label}
                    </div>
                    {times.map((t) => {
                      const key = `${label}|${t}`;
                      const on = key === slot;
                      return (
                        <button
                          key={t}
                          type="button"
                          aria-pressed={on}
                          aria-label={`${label} ${t}`}
                          onClick={() => setSlot(key)}
                          style={{
                            height: 36,
                            borderRadius: 4,
                            border: `1px solid ${on ? ACCENT : '#D1D1D1'}`,
                            background: on ? ACCENT : '#FFFFFF',
                            color: on ? '#FFFFFF' : '#242424',
                            fontSize: 13,
                            fontWeight: on ? 600 : 400,
                          }}
                        >
                          {t}
                        </button>
                      );
                    })}
                    {times.length === 0 && (
                      <div style={{ fontSize: 12, color: '#5C5C5C', textAlign: 'center', padding: '10px 0' }}>No clinic</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <a href={href('new-booking')} style={{ fontSize: 13 }}>
              Show first available across all {spec} consultants
            </a>
          </section>

          <section style={section}>
            <h2 style={h2}>Summary</h2>
            <dl style={dl(92)}>
              <dt style={dt}>Patient</dt>
              <dd style={dd}>Fiona Moreau</dd>
              <dt style={dt}>Consultant</dt>
              <dd style={dd}>{consultant}</dd>
              <dt style={dt}>When</dt>
              <dd style={{ ...dd, fontWeight: 600 }}>
                {slotDay} 2026, {slotTime} (30 min)
              </dd>
              <dt style={dt}>Where</dt>
              <dd style={dd}>Consultant’s usual clinic room</dd>
            </dl>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '10px 12px', borderRadius: 4, background: '#E6F2EF', color: '#0A4F43', fontSize: 13 }}>
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 18px' }}>
                <path d="M5 12l5 5 9-10" />
              </svg>
              <span>No clashes with the room, the consultant’s leave or the patient’s other bookings.</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <button type="button" style={{ ...btnPrimary, flex: '1 1 150px' }}>
                Confirm booking
              </button>
              <button type="button" style={{ ...btn, flex: '1 1 150px' }}>
                Hold as pending
              </button>
              <a
                href={href('day')}
                style={{ flex: '1 1 100%', height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}
              >
                Discard and return to calendar
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
