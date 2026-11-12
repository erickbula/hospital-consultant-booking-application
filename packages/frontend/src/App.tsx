import { useEffect, type ComponentType } from 'react';

import { Shell } from './booking/Shell';
import { usePage, type Page } from './booking/nav';
import { AddConsultantPage } from './booking/pages/AddConsultantPage';
import { ConsultantsPage } from './booking/pages/ConsultantsPage';
import { DayPage } from './booking/pages/DayPage';
import { MonthPage } from './booking/pages/MonthPage';
import { NewBookingPage } from './booking/pages/NewBookingPage';
import { PatientsPage } from './booking/pages/PatientsPage';
import { ReportsPage } from './booking/pages/ReportsPage';
import { RoomsPage } from './booking/pages/RoomsPage';
import { WaitingListPage } from './booking/pages/WaitingListPage';
import { WeekPage } from './booking/pages/WeekPage';

const SCREENS: Record<Page, { title: string; view: ComponentType }> = {
  day: { title: 'Calendar', view: DayPage },
  week: { title: 'Calendar – week', view: WeekPage },
  month: { title: 'Calendar – month', view: MonthPage },
  'new-booking': { title: 'New booking', view: NewBookingPage },
  consultants: { title: 'Consultants', view: ConsultantsPage },
  'add-consultant': { title: 'Add consultant', view: AddConsultantPage },
  patients: { title: 'Patients', view: PatientsPage },
  'waiting-list': { title: 'Waiting list', view: WaitingListPage },
  rooms: { title: 'Rooms', view: RoomsPage },
  reports: { title: 'Reports', view: ReportsPage },
};

function App() {
  const page = usePage();
  const { title, view: View } = SCREENS[page];

  useEffect(() => {
    document.title = `${title} · Hospital Consultant Booking Application`;
    document.documentElement.scrollTop = 0;
  }, [title]);


  return (
    <Shell page={page}>
      <View key={page} />
    </Shell>
  );
}

export default App;
