import React, { useEffect, useState, useCallback } from 'react';
import { Calendar, dateFnsLocalizer, Event as RBCEvent, Views } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

// Event type for react-big-calendar
interface CalendarEvent extends RBCEvent {
  _id?: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  createdBy?: string;
  type?: string;
}

interface CareConnectCalendarProps {
  familyCircleId: string;
  userId: string;
}

const CareConnectCalendar: React.FC<CareConnectCalendarProps> = ({ familyCircleId, userId }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch events from backend
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/calendar/events?familyCircleId=${familyCircleId}`);
      if (!res.ok) throw new Error('Failed to fetch events');
      const data = await res.json();
      setEvents(
        data.map((ev: any) => ({
          ...ev,
          start: new Date(ev.dateTime),
          end: new Date(ev.dateTime),
        }))
      );
    } catch (err: any) {
      setError(err.message || 'Error fetching events');
    } finally {
      setLoading(false);
    }
  }, [familyCircleId]);

  useEffect(() => {
    if (familyCircleId) fetchEvents();
  }, [familyCircleId, fetchEvents]);

  // Add new event
  const handleSelectSlot = async ({ start }: { start: Date }) => {
    const title = prompt('Event title:');
    if (!title) return;
    const description = prompt('Description (optional):') || '';
    const type = 'appointment';
    try {
      const res = await fetch('/api/calendar/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          dateTime: start,
          createdBy: userId,
          familyCircleId,
          type,
        }),
      });
      if (!res.ok) throw new Error('Failed to create event');
      await fetchEvents();
    } catch (err: any) {
      alert(err.message || 'Error creating event');
    }
  };

  // Edit or delete event
  const handleSelectEvent = async (event: CalendarEvent) => {
    const action = window.prompt('Type "edit" to edit, "delete" to delete this event, or Cancel to close:', 'edit');
    if (action === 'edit') {
      const newTitle = prompt('New title:', event.title) || event.title;
      const newDescription = prompt('New description:', event.description || '') || event.description;
      try {
        const res = await fetch(`/api/calendar/events/${event._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: newTitle, description: newDescription }),
        });
        if (!res.ok) throw new Error('Failed to update event');
        await fetchEvents();
      } catch (err: any) {
        alert(err.message || 'Error updating event');
      }
    } else if (action === 'delete') {
      if (!window.confirm('Are you sure you want to delete this event?')) return;
      try {
        const res = await fetch(`/api/calendar/events/${event._id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete event');
        await fetchEvents();
      } catch (err: any) {
        alert(err.message || 'Error deleting event');
      }
    }
  };

  return (
    <div style={{ height: 500, background: '#fff', borderRadius: 8, padding: 16, boxShadow: '0 2px 8px #0001' }}>
      <h2 style={{ marginBottom: 16 }}>Family Shared Calendar</h2>
      {loading && <div>Loading events...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 400 }}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
        popup
      />
    </div>
  );
};

export default CareConnectCalendar;