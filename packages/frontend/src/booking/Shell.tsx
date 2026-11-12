import type { ReactNode } from 'react';

import './booking.css';
import { href, type Page } from './nav';
import { SearchIcon } from './ui';

type Area =
  | 'calendar'
  | 'consultants'
  | 'patients'
  | 'waiting-list'
  | 'rooms'
  | 'reports';

const AREA: Record<Page, Area> = {
  day: 'calendar',
  week: 'calendar',
  month: 'calendar',
  'new-booking': 'calendar',
  consultants: 'consultants',
  'add-consultant': 'consultants',
  patients: 'patients',
  'waiting-list': 'waiting-list',
  rooms: 'rooms',
  reports: 'reports',
};

const NAV: { area: Area; label: string; to: Page; d: string; badge?: string }[] =
  [
    { area: 'calendar', label: 'Calendar', to: 'day', d: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4' },
    { area: 'consultants', label: 'Consultants', to: 'consultants', d: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20c0-3 3-5 6-5s6 2 6 5M17 11a3 3 0 1 0 0-6M21 20c0-2-1-4-4-5' },
    { area: 'patients', label: 'Patients', to: 'patients', d: 'M8 4h8v3H8zM6 5H5v16h14V5h-1M9 12h6M9 16h6' },
    { area: 'waiting-list', label: 'Waiting list', to: 'waiting-list', d: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2', badge: '10' },
    { area: 'rooms', label: 'Rooms', to: 'rooms', d: 'M5 21V4h10v17M3 21h18M15 7h4v14M11 12v1' },
    { area: 'reports', label: 'Reports', to: 'reports', d: 'M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-6' },
  ];

const CALENDAR_VIEWS: Page[] = ['day', 'week', 'month'];
const DOTS = [5, 12, 19];

export function Shell({ page, children }: { page: Page; children: ReactNode }) {
  const area = AREA[page];
  const isCalendarView = CALENDAR_VIEWS.includes(page);

  return (
    <div
      className="hcb"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#F5F5F5',
        color: '#242424',
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        fontSize: 14,
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap',
          padding: '4px 16px',
          minHeight: 48,
          boxSizing: 'border-box',
          background: '#0A4F43',
          color: '#FFFFFF',
        }}
      >
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF">
          {DOTS.flatMap((cy) =>
            DOTS.map((cx) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2" />)
          )}
        </svg>
        <div style={{ fontWeight: 600, fontSize: 16 }}>
          Hospital Consultant Booking Application
        </div>
        <div style={{ fontSize: 13, color: '#CFE5E0' }}>
          [HOSPITAL NAME] · Outpatients workspace
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: 10,
            border: '1px solid #CFE5E0',
            color: '#FFFFFF',
          }}
        >
          Sample data
        </span>
        <div style={{ flex: '1 1 0' }} />
        {isCalendarView && (
          <label
            className="hcb-search"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#FFFFFF',
              borderRadius: 4,
              padding: '0 10px',
              height: 32,
              flex: '0 1 320px',
            }}
          >
            <SearchIcon />
            <input
              type="search"
              aria-label="Search patients, consultants or bookings"
              placeholder="Search patient, MRN or consultant"
              style={{
                border: 0,
                outline: 0,
                fontSize: 13,
                flex: '1 1 0',
                minWidth: 0,
                color: '#242424',
                background: 'transparent',
              }}
            />
          </label>
        )}
        <div style={{ fontSize: 13, color: '#CFE5E0' }}>Booking desk</div>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: '#FFFFFF',
            color: '#0A4F43',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 600,
            fontSize: 12,
          }}
        >
          EB
        </div>
      </header>

      <div style={{ display: 'flex', flexWrap: 'wrap', flex: '1 1 auto' }}>
        <nav
          aria-label="Main"
          style={{
            flex: '1 0 208px',
            maxWidth: '100%',
            boxSizing: 'border-box',
            background: '#FFFFFF',
            borderRight: '1px solid #E0E0E0',
            padding: '12px 8px',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {NAV.map((n) => {
            const active = n.area === area;
            return (
              <a
                key={n.area}
                href={href(n.to)}
                aria-current={active ? 'page' : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  minHeight: 44,
                  padding: '0 12px',
                  borderRadius: 4,
                  textDecoration: 'none',
                  color: active ? '#0A4F43' : '#242424',
                  background: active ? '#E6F2EF' : 'transparent',
                  fontWeight: active ? 600 : 400,
                }}
              >
                <svg
                  aria-hidden="true"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={n.d} />
                </svg>
                <span style={{ flex: '1 1 0' }}>{n.label}</span>
                {n.badge && (
                  <span
                    style={{
                      fontSize: 12,
                      background: '#EBEBEB',
                      color: '#424242',
                      borderRadius: 10,
                      padding: '1px 8px',
                    }}
                  >
                    {n.badge}
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        <main
          style={{
            flex: '999 1 560px',
            minWidth: 0,
            padding: '16px 20px 20px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: isCalendarView ? 12 : 14,
          }}
        >
          {children}
        </main>
      </div>

      <div
        style={{
          padding: '6px 20px 8px',
          textAlign: 'right',
          fontSize: 12,
          letterSpacing: '0.02em',
          color: '#5C5C5C',
          background: '#F5F5F5',
          borderTop: '1px solid #E0E0E0',
        }}
      >
        Created by Erick Bulatowicz
      </div>
    </div>
  );
}
