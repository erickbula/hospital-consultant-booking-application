import type { CSSProperties, ReactNode } from 'react';

import { SPEC, type Option, type Speciality } from './data';
import { ACCENT, card, muted12, muted13 } from './styles';

export function ChipRow<T extends string>({
  options,
  value,
  onChange,
  square,
}: {
  options: readonly Option<T>[];
  value: T;
  onChange: (key: T) => void;
  square?: boolean;
}) {
  return (
    <>
      {options.map((o) => {
        const on = o.key === value;
        return (
          <button
            key={o.key}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(o.key)}
            style={{
              height: 36,
              padding: '0 14px',
              borderRadius: square ? 4 : 18,
              border: `1px solid ${on ? ACCENT : '#D1D1D1'}`,
              background: on ? ACCENT : '#FFFFFF',
              color: on ? '#FFFFFF' : '#242424',
              fontSize: 13,
              fontWeight: on ? 600 : 400,
            }}
          >
            {o.label}
          </button>
        );
      })}
    </>
  );
}

export function Pill({
  bg,
  fg,
  small,
  children,
  style,
}: {
  bg: string;
  fg: string;
  small?: boolean;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        fontSize: small ? 11 : 12,
        fontWeight: 600,
        padding: small ? '2px 8px' : '2px 10px',
        borderRadius: 10,
        whiteSpace: 'nowrap',
        background: bg,
        color: fg,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export function SpecPill({
  spec,
  small,
}: {
  spec: Speciality;
  small?: boolean;
}) {
  return (
    <Pill bg={SPEC[spec][0]} fg={SPEC[spec][1]} small={small}>
      {spec}
    </Pill>
  );
}

export function Avatar({
  text,
  bg,
  fg,
  size = 44,
}: {
  text: string;
  bg: string;
  fg: string;
  size?: number;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        flex: `0 0 ${size}px`,
        borderRadius: '50%',
        background: bg,
        color: fg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        fontSize: size >= 44 ? 14 : size >= 36 ? 12 : 12,
      }}
    >
      {text}
    </div>
  );
}

export function PlusIcon() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="2.2"
      strokeLinecap="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#5C5C5C"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-4-4" />
    </svg>
  );
}

export function SearchBox({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label
      className="hcb-search"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: '#FFFFFF',
        border: '1px solid #8A8A8A',
        borderRadius: 4,
        padding: '0 10px',
        height: 38,
        flex: '0 1 260px',
      }}
    >
      <SearchIcon />
      <input
        type="search"
        aria-label={label}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          border: 0,
          outline: 0,
          fontSize: 14,
          flex: '1 1 0',
          minWidth: 0,
          color: '#242424',
          background: 'transparent',
        }}
      />
    </label>
  );
}

export function Kpi({
  label,
  value,
  sub,
  large,
}: {
  label: string;
  value: string;
  sub: string;
  large?: boolean;
}) {
  return (
    <div
      style={{
        ...card,
        flex: '1 1 160px',
        minWidth: 0,
        padding: large ? '14px 16px' : '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <div style={muted13}>{label}</div>
      <div style={{ fontSize: large ? 30 : 26, fontWeight: 600, lineHeight: 1.2 }}>
        {value}
      </div>
      <div style={muted12}>{sub}</div>
    </div>
  );
}

export function PageTitle({
  title,
  sub,
  basis = 260,
}: {
  title: string;
  sub: string;
  basis?: number;
}) {
  return (
    <div style={{ flex: `1 1 ${basis}px` }}>
      <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>{title}</h1>
      <div style={muted13}>{sub}</div>
    </div>
  );
}
