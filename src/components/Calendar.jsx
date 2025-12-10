import dynamic from 'next/dynamic';
import { useMemo } from 'react';
const FullCalendar = dynamic(() => import('@fullcalendar/react'), { ssr:false });
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export default function Calendar({ events = [] }){
  const plugins = useMemo(() => [ dayGridPlugin, timeGridPlugin, interactionPlugin ], []);
  return <FullCalendar plugins={plugins} initialView="dayGridMonth" events={events} height={520} />;
}
