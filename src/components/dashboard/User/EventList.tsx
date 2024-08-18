import { IBooking } from "@/src/types/IBooking";
import { useState } from "react";

interface EventListProps {
  bookings: (IBooking & { eventTitle: string })[];
  title: string;
}

const EventList: React.FC<EventListProps> = ({ bookings, title }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 4;

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = bookings.slice(indexOfFirstEvent, indexOfLastEvent);

  const totalPages = Math.ceil(bookings.length / eventsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    console.log(`Page changed to: ${pageNumber}`); 
};

const getUniqueKey = (booking: IBooking) => {
    return booking.TransactionNumber || `${booking.Date}-${Math.random()}`;
  };

  return (
    <div className="bg-white bg-opacity-30 w-full flex flex-col text-center h-auto rounded-md mx-auto space-y-6 p-6">
      <h1 className="text-gray-100 text-3xl font-bold">{title}</h1>
      <ul className="flex flex-wrap gap-4 justify-center">
        {currentEvents.length > 0 ? (
          currentEvents.map(booking => (
            <li key={getUniqueKey(booking)} className="flex-none bg-gray-200 p-4 rounded-md shadow-md w-full sm:w-2/3 md:w-5/12">
              <h3 className="text-gray-800 text-md font-semibold">{booking.eventTitle}</h3>
              <p className="text-gray-600 text-sm">Transaction: {booking.TransactionNumber}</p>
              <p className="text-gray-600 text-sm">Quantity: {booking.Quantity}</p>
              <p className="text-gray-600 text-sm">Paid: ${booking.Paid}</p>
              <p className="text-gray-600 text-sm">
                Date: {new Date(booking.Date).toLocaleString('en-US', { 
                  dateStyle: 'short',
                  timeStyle: 'short' 
                })}
              </p>
            </li>
          ))
        ) : (
          <p className="text-gray-600">No {title.toLowerCase()}</p>
        )}
      </ul>
      <div className="flex justify-center mt-4 space-x-2 flex-wrap">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 rounded text-sm ${currentPage === index + 1 ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EventList;
