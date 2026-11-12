// Sample data for the booking desk UI, taken from the approved design.
// Nothing here is read from or written to a live source yet.

export type Speciality =
  | 'Cardiology'
  | 'Orthopaedics'
  | 'Neurology'
  | 'Paediatrics'
  | 'Oncology'
  | 'Dermatology';

export type SpecFilter = Speciality | 'All';

/** Background and foreground colour for each speciality. */
export const SPEC: Record<Speciality, readonly [string, string]> = {
  Cardiology: ['#EBF3FC', '#0F548C'],
  Orthopaedics: ['#FDF3E7', '#8A3707'],
  Neurology: ['#F3EEFA', '#5C2E91'],
  Paediatrics: ['#E6F5F5', '#025F63'],
  Oncology: ['#FCEAF2', '#8F1150'],
  Dermatology: ['#F1F1E4', '#55550D'],
};

export const ALL_SPECS = Object.keys(SPEC) as Speciality[];

/** Specialities that run clinics in the calendar views. */
export const CAL_SPECS: Speciality[] = [
  'Cardiology',
  'Orthopaedics',
  'Neurology',
  'Paediatrics',
  'Oncology',
];

export interface Option<T extends string> {
  key: T;
  label: string;
}

export const specOptions = (
  specs: readonly Speciality[]
): Option<SpecFilter>[] => [
  { key: 'All', label: 'All specialities' },
  ...specs.map((s) => ({ key: s, label: s })),
];

export type ApptStatus =
  | 'Confirmed'
  | 'Checked in'
  | 'Attended'
  | 'Pending'
  | 'Unavailable';

/** Pill background, pill foreground and dot colour for each booking status. */
export const PILL: Record<ApptStatus, readonly [string, string, string]> = {
  Confirmed: ['#E6F2EF', '#0A4F43', '#0A4F43'],
  'Checked in': ['#EBF3FC', '#0F548C', '#0F6CBD'],
  Attended: ['#EBEBEB', '#424242', '#8A8A8A'],
  Pending: ['#FFF4CE', '#6B4E00', '#8A6100'],
  Unavailable: ['#EBEBEB', '#424242', '#8A8A8A'],
};

export interface CalConsultant {
  id: string;
  name: string;
  spec: Speciality;
  room: string;
  /** Mon to Fri: 'AP' = morning and afternoon clinic, '' = no clinic, 'W' = today. */
  week: readonly string[];
  /** Mon to Fri share of a full clinic day (15 half-hour slots). */
  clinic: readonly number[];
  /** Month-grid indexes on leave. */
  leave: readonly number[];
  todayFree: number;
}

export const CAL_CONSULTANTS: CalConsultant[] = [
  { id: 'ao', name: 'Dr Amara Okafor', spec: 'Cardiology', room: 'Clinic 2, Rm 4', week: ['AP', '', 'W', 'AP', ''], clinic: [1, 0, 1, 1, 0], leave: [13], todayFree: 8 },
  { id: 'sa', name: 'Dr Samuel Adeyemi', spec: 'Cardiology', room: 'Clinic 2, Rm 6', week: ['', 'AP', 'W', '', 'AP'], clinic: [0, 1, 0.5, 0, 1], leave: [], todayFree: 5 },
  { id: 'jw', name: 'Mr James Whitfield', spec: 'Orthopaedics', room: 'Fracture clinic', week: ['AP', '', 'W', '', ''], clinic: [1, 0, 0.5, 0, 0], leave: [], todayFree: 5 },
  { id: 'pr', name: 'Dr Priya Raman', spec: 'Neurology', room: 'Clinic 5, Rm 1', week: ['AP', '', 'W', '', 'AP'], clinic: [1, 0, 1, 0, 1], leave: [], todayFree: 11 },
  { id: 'er', name: 'Dr Elena Rossi', spec: 'Paediatrics', room: 'Children’s OPD', week: ['AP', 'AP', 'W', 'AP', ''], clinic: [1, 1, 1, 1, 0], leave: [15, 16, 17, 18], todayFree: 11 },
  { id: 'th', name: 'Dr Tomás Herrera', spec: 'Oncology', room: 'Clinic 7, Rm 2', week: ['', '', 'W', 'AP', 'AP'], clinic: [0, 0, 1, 1, 1], leave: [], todayFree: 10 },
];

export interface Appt {
  id: string;
  c: string;
  start: number;
  dur: number;
  patient: string;
  type: string;
  status: ApptStatus;
}

const A = (
  id: string,
  c: string,
  start: number,
  dur: number,
  patient: string,
  type: string,
  status: ApptStatus
): Appt => ({ id, c, start, dur, patient, type, status });

const U = 'Unavailable';

/** Bookings for the sample "today", Wednesday 11 November 2026. */
export const TODAY_APPTS: Appt[] = [
  A('ao1', 'ao', 8.5, 0.5, 'R. Patel', 'New patient', 'Checked in'),
  A('ao2', 'ao', 9, 0.5, 'M. Osei', 'Follow-up', 'Checked in'),
  A('ao3', 'ao', 9.5, 1, 'L. Brennan', 'Echo review', 'Confirmed'),
  A('ao4', 'ao', 11, 0.5, 'D. Kowalski', 'Follow-up', 'Confirmed'),
  A('ao5', 'ao', 12, 1, 'MDT meeting', 'Not bookable', U),
  A('ao6', 'ao', 13.5, 0.5, 'S. Ahmed', 'Telephone review', 'Pending'),
  A('ao7', 'ao', 14.5, 1, 'F. Moreau', 'New patient', 'Confirmed'),
  A('sa1', 'sa', 8, 4, 'Cath lab list', 'Not bookable', U),
  A('sa2', 'sa', 13, 0.5, 'J. Nwosu', 'Follow-up', 'Confirmed'),
  A('sa3', 'sa', 13.5, 0.5, 'P. Lindgren', 'Follow-up', 'Confirmed'),
  A('sa4', 'sa', 14, 1, 'H. Clarke', 'New patient', 'Pending'),
  A('sa5', 'sa', 15.5, 0.5, 'T. Banerjee', 'Results', 'Confirmed'),
  A('jw1', 'jw', 9, 0.5, 'C. Doyle', 'Fracture review', 'Checked in'),
  A('jw2', 'jw', 9.5, 0.5, 'A. Haddad', 'Fracture review', 'Checked in'),
  A('jw3', 'jw', 10, 0.5, 'N. Gupta', 'Post-op check', 'Confirmed'),
  A('jw4', 'jw', 11, 1, 'B. Sorensen', 'New patient', 'Confirmed'),
  A('jw5', 'jw', 13, 4, 'Theatre list', 'Not bookable', U),
  A('pr1', 'pr', 9, 1, 'G. Marsh', 'New patient', 'Checked in'),
  A('pr2', 'pr', 10.5, 0.5, 'Y. Chen', 'Follow-up', 'Confirmed'),
  A('pr3', 'pr', 11, 0.5, 'O. Bello', 'Follow-up', 'Pending'),
  A('pr4', 'pr', 14, 1, 'K. Fraser', 'New patient', 'Confirmed'),
  A('pr5', 'pr', 15, 0.5, 'I. Novak', 'Video consult', 'Confirmed'),
  A('er1', 'er', 8.5, 0.5, 'E. Wright', 'Follow-up', 'Checked in'),
  A('er2', 'er', 9, 0.5, 'Z. Khan', 'Follow-up', 'Checked in'),
  A('er3', 'er', 10, 1, 'W. Abbasi', 'New patient', 'Confirmed'),
  A('er4', 'er', 11.5, 0.5, 'V. Santos', 'Follow-up', 'Confirmed'),
  A('er5', 'er', 13, 0.5, 'Q. Mensah', 'Results', 'Pending'),
  A('er6', 'er', 13.5, 0.5, 'U. Petrov', 'Follow-up', 'Confirmed'),
  A('th1', 'th', 9, 1, 'X. Li', 'New patient', 'Checked in'),
  A('th2', 'th', 10, 0.5, 'R. Dubois', 'Treatment review', 'Confirmed'),
  A('th3', 'th', 11, 1, 'Tumour board', 'Not bookable', U),
  A('th4', 'th', 13, 1, 'J. Eze', 'New patient', 'Confirmed'),
  A('th5', 'th', 14.5, 0.5, 'M. Varga', 'Follow-up', 'Pending'),
];

export type ConsultantStatus = 'Active' | 'On leave' | 'Leaving';

export interface DirectoryConsultant {
  id: string;
  name: string;
  sub: string;
  spec: Speciality;
  days: string;
  next: string;
  booked: number;
  cap: number;
  status: ConsultantStatus;
  future: number;
}

const D = (
  id: string,
  name: string,
  sub: string,
  spec: Speciality,
  days: string,
  next: string,
  booked: number,
  cap: number,
  status: ConsultantStatus,
  future: number
): DirectoryConsultant => ({ id, name, sub, spec, days, next, booked, cap, status, future });

export const DIRECTORY: DirectoryConsultant[] = [
  D('ao', 'Dr Amara Okafor', 'Consultant cardiologist', 'Cardiology', 'Mon, Wed, Thu', 'Today 11:30', 38, 44, 'Active', 61),
  D('sa', 'Dr Samuel Adeyemi', 'Interventional cardiologist', 'Cardiology', 'Tue, Wed pm, Fri', 'Today 15:00', 22, 30, 'Active', 34),
  D('jw', 'Mr James Whitfield', 'Trauma and orthopaedic surgeon', 'Orthopaedics', 'Mon, Wed am', 'Mon 16 Nov 09:00', 19, 20, 'Active', 27),
  D('hl', 'Ms Hannah Lindqvist', 'Hand and wrist surgeon', 'Orthopaedics', 'Tue, Thu', 'Returns 23 Nov', 0, 24, 'On leave', 18),
  D('pr', 'Dr Priya Raman', 'Consultant neurologist', 'Neurology', 'Mon, Wed, Fri', 'Today 11:30', 26, 36, 'Active', 45),
  D('er', 'Dr Elena Rossi', 'Consultant paediatrician', 'Paediatrics', 'Mon – Thu', 'Today 12:00', 41, 52, 'Active', 58),
  D('th', 'Dr Tomás Herrera', 'Clinical oncologist', 'Oncology', 'Wed, Thu, Fri', 'Today 15:00', 17, 28, 'Active', 39),
  D('mt', 'Dr Mei Tanaka', 'Consultant dermatologist', 'Dermatology', 'Tue, Fri', 'Fri 13 Nov 09:30', 9, 24, 'Leaving', 12),
];

export const WEEK_DAYS = ['Mon 9', 'Tue 10', 'Wed 11', 'Thu 12', 'Fri 13'];

/** Sample "now" on the day and week grids: 10:40. */
export const NOW = 10 + 40 / 60;
export const DAY_START = 8;
export const DAY_HOURS = 9;

export const fmt = (t: number): string => {
  const h = Math.floor(t);
  const m = Math.round((t - h) * 60);
  return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
};

export const hash = (s: string): number => {
  let h = 7;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100003;
  return h;
};

/** Initials from a titled name: "Dr Amara Okafor" gives "AO". */
export const initials = (name: string): string =>
  name
    .split(' ')
    .slice(1)
    .map((w) => w[0])
    .join('');
