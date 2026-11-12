import { DAY_START, PILL, SPEC, type Appt, type Speciality } from '../data';

/** Position and colours of an appointment block on a day or week grid. */
export function apptLook(a: Appt, spec: Speciality, hourHeight: number) {
  const off = a.status === 'Unavailable';
  const [bg, fg] = SPEC[spec];
  return {
    top: Math.round((a.start - DAY_START) * hourHeight) + 2,
    height: Math.round(a.dur * hourHeight) - 4,
    bg: off ? '#EBEBEB' : bg,
    fg: off ? '#424242' : fg,
    border:
      a.status === 'Pending'
        ? `1px dashed ${fg}`
        : `1px solid ${off ? '#D1D1D1' : fg}`,
    dot: PILL[a.status][2],
    detail: `${a.type} · ${a.status}`,
    tall: a.dur >= 1,
  };
}
