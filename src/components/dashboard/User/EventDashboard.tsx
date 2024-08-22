import { useState } from "react";
import { IEvent } from "@/src/types/IEvent";
import { IBooking } from "@/src/types/IBooking";
import EventList from "./EventList";

export interface IBookingWithEvent extends IBooking {
  event: IEvent;
}

interface EventDashboardProps {
  events: IEvent[];
  bookings: IBooking[];
}

const EventDashboard: React.FC<EventDashboardProps> = ({ events, bookings }) => {
  const [view, setView] = useState<'active' | 'history'>('active');
  const now = new Date();

  const bookingsWithEvents: IBookingWithEvent[] = bookings
    .map(booking => {
      const event = events.find(event => event.id === booking.eventsId);
      if (!event) {
        console.error(`Event with id ${booking.eventsId} not found.`);
        return null; 
      }
      return {
        ...booking,
        event
      };
    })
    .filter((booking): booking is IBookingWithEvent => booking !== null);

  const activeEvents = bookingsWithEvents.filter(booking => new Date(booking.event.date).getTime() >= now.getTime());
  const eventHistory = bookingsWithEvents.filter(booking => new Date(booking.event.date).getTime() < now.getTime());

  return (
    <div>
      <nav className="w-full bg-gray-800 rounded-md mb-6">
        <section className="flex flex-col justify-center items-center rounded-md w-[90%] mx-auto space-y-6 p-5">
          <ul className="flex justify-center space-x-6 py-4">
            <li>
              <button
                onClick={() => setView('active')}
                className={`px-4 py-2 rounded text-sm ${view === 'active' ? 'bg-gray-200 text-gray-800' : 'bg-gray-600 text-white'}`}
              >
                🎟️ Active Events
              </button>
            </li>
            <li>
              <button
                onClick={() => setView('history')}
                className={`px-4 py-2 rounded text-sm ${view === 'history' ? 'bg-gray-200 text-gray-800' : 'bg-gray-600 text-white'}`}
              >
                📖 Event History
              </button>
            </li>
          </ul>

          {view === 'active' && <EventList bookings={activeEvents} title="🎟️ Active Events" />}
          {view === 'history' && <EventList bookings={eventHistory} title="📖 Event History" />}
        </section>
      </nav>
    </div>
  );
};

export default EventDashboard;
