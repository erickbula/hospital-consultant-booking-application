import type { ReactNode } from 'react';

import { DAY_HOURS, DAY_START, fmt } from '../data';
import { href, type Page } from '../nav';
import { btn, btnPrimary, h1, iconBtn, row, spacer } from '../styles';
import { PlusIcon } from '../ui';

type View = 'day' | 'week' | 'month';

const VIEWS: { key: View; label: string }[] = [
  { key: 'day', label: 'Day' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
];

export function CalendarToolbar({
  title,
  view,
  nowLabel,
}: {
  title: string;
  view: View;
  nowLabel: string;
}) {
  return (
    <div style={row}>
      <h1 style={h1}>{title}</h1>
      <div style={{ display: 'flex', gap: 4 }}>
        <button type="button" aria-label={`Previous ${view}`} style={iconBtn}>
          ‹
        </button>
        <button type="button" style={btn}>
          {nowLabel}
        </button>
        <button type="button" aria-label={`Next ${view}`} style={iconBtn}>
          ›
        </button>
      </div>
      <div style={spacer} />
      <div
        role="group"
        aria-label="Calendar view"
        style={{
          display: 'flex',
          border: '1px solid #D1D1D1',
          borderRadius: 4,
          overflow: 'hidden',
          background: '#FFFFFF',
        }}
      >
        {VIEWS.map((v, i) => {
          const edge = i > 0 ? '1px solid #D1D1D1' : undefined;
          return v.key === view ? (
            <button
              key={v.key}
              type="button"
              aria-pressed="true"
              style={{
                height: 38,
                padding: '0 14px',
                border: 0,
                borderLeft: edge,
                background: '#E6F2EF',
                color: '#0A4F43',
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              {v.label}
            </button>
          ) : (
            <a
              key={v.key}
              href={href(v.key as Page)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                height: 38,
                padding: '0 14px',
                borderLeft: edge,
                background: '#FFFFFF',
                color: '#242424',
                fontSize: 14,
                textDecoration: 'none',
              }}
            >
              {v.label}
            </a>
          );
        })}
      </div>
      <a href={href('new-booking')} style={btnPrimary}>
        <PlusIcon />
        New booking
      </a>
    </div>
  );
}

export type LegendKind = 'solid' | 'dashed' | 'square';

export function Legend({
  items,
}: {
  items: { label: string; color: string; kind?: LegendKind }[];
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexWrap: 'wrap',
        fontSize: 12,
        color: '#5C5C5C',
      }}
    >
      {items.map((it) => (
        <span
          key={it.label}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              boxSizing: 'border-box',
              borderRadius: it.kind === 'square' ? 0 : '50%',
              background: it.kind === 'dashed' ? undefined : it.color,
              border: it.kind === 'dashed' ? `2px dashed ${it.color}` : undefined,
            }}
          />
          {it.label}
        </span>
      ))}
    </div>
  );
}

/** The left-hand hours gutter of a day or week grid. */
export function HoursColumn({
  headHeight,
  hourHeight,
}: {
  headHeight: number;
  hourHeight: number;
}) {
  return (
    <div>
      <div
        style={{
          height: headHeight,
          boxSizing: 'border-box',
          borderBottom: '1px solid #E0E0E0',
        }}
      />
      {Array.from({ length: DAY_HOURS }, (_, i) => (
        <div
          key={i}
          style={{
            height: hourHeight,
            boxSizing: 'border-box',
            padding: '4px 8px 0 0',
            textAlign: 'right',
            fontSize: 12,
            color: '#5C5C5C',
          }}
        >
          {fmt(DAY_START + i)}
        </div>
      ))}
    </div>
  );
}

/** The hour lines of one grid column, with its appointment blocks on top. */
export function SlotColumn({
  hourHeight,
  nowTop,
  children,
}: {
  hourHeight: number;
  nowTop?: number;
  children: ReactNode;
}) {
  return (
    <div style={{ position: 'relative' }}>
      {Array.from({ length: DAY_HOURS }, (_, i) => (
        <div
          key={i}
          style={{
            height: hourHeight,
            boxSizing: 'border-box',
            borderBottom: '1px solid #EBEBEB',
          }}
        />
      ))}
      {children}
      {nowTop !== undefined && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: nowTop,
            height: 2,
            background: '#B10E1C',
          }}
        />
      )}
    </div>
  );
}

export function ApptBlock({
  top,
  height,
  bg,
  fg,
  border,
  dot,
  selected,
  title,
  detail,
  tall,
  label,
  onClick,
}: {
  top: number;
  height: number;
  bg: string;
  fg: string;
  border: string;
  dot: string;
  selected: boolean;
  title: string;
  detail: string;
  tall: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={selected}
      style={{
        position: 'absolute',
        left: 4,
        right: 4,
        top,
        height,
        boxSizing: 'border-box',
        padding: '3px 8px',
        textAlign: 'left',
        borderRadius: 4,
        border,
        background: bg,
        color: fg,
        outline: selected ? '2px solid #242424' : undefined,
        outlineOffset: 1,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        fontSize: 12,
        lineHeight: 1.3,
      }}
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          whiteSpace: 'nowrap',
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            flex: '0 0 8px',
            borderRadius: '50%',
            background: dot,
          }}
        />
        <span
          style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {title}
        </span>
      </span>
      {tall && (
        <span
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {detail}
        </span>
      )}
    </button>
  );
}
