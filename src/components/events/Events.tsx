"use client";
//Types
import { IBooking } from "@/src/types/IBooking";
import { IEvent } from "@/src/types/IEvent";
//Vendors
import { useEffect, useState } from "react";
import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";
//Contexts
import { useCrud } from "../CrudContext";
import { useAuth } from "../AuthContext";
//Components
import LoadingPage from "../LoadingPage/loading";
//BookStores
import Swal from "sweetalert2";

const stripePromise = loadStripe("pk_test_51PldYdILmxc4WwcXRDtM9FzksSogclB9IaH3r88oivd4pzPJCTQR9DRvg4JFN2b5lSbNJDIza1s75tIXpvODxzKW007koW2jl3");

const Events: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
  const [quantity, setQuantity] = useState(1); 
  const { events, loading, book, fetchBookingByEventId } = useCrud();
  const { user } = useAuth();

  const handleImageClick = (event: IEvent) => {
    const seatsRemain = event.maxseats - (event.totalPersons || 0);
    setSelectedEvent({
      ...event,
      seatsRemain,
    });
    setQuantity(1);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setQuantity(1); 
  };
  const handlePersonChange = (increment: boolean) => {
    if (selectedEvent) {
      setQuantity((prev) => {
        const maxAllowed = Math.min(
          selectedEvent.seatsRemain ?? 0, 
          selectedEvent.maxseats ?? 0 
        );

        if (increment) {
          return prev < maxAllowed ? prev + 1 : prev; 
        } else {
          return prev > 1 ? prev - 1 : 1; 
        }
      });
    }
  };

  useEffect(() => {
    if (selectedEvent && user) {
    fetchBookingByEventId(user.id,selectedEvent.id);

    }
  }, [selectedEvent, user, fetchBookingByEventId])


  if (loading) {
    return <LoadingPage />;
  }

  const formatEventDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  const handleCheckout = async (event: IEvent) => {
    const stripe = await stripePromise;
    if (!user) {
      Swal.fire({
        icon: "error",
        text: "You need to be logged in to add an experience.",
      });
      return;
    }
    if (!stripe) {
      console.error("Stripe.js no se ha cargado.");
      return;
    }
    try {
      // Solicita la creación de una sesión de pago
      const bookingDetails: IBooking = {
        ...book,
        TransactionNumber: book.TransactionNumber,
        Quantity: book.Quantity,
        Paid: book.Paid,
        Date: book.Date,
        userId:book.userId,
        eventsId:book.eventsId
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: event.id,
          title: event.title,
          price: event.price,
          description: event.description,
          bookingDetails
        }),
      });

      const { sessionId } = await response.json();
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error("Error al redirigir a Stripe Checkout", error);
      }
    } catch (error) {
      console.error("Error al crear la sesión de pago", error);
    }
  };

  /* const handleCheckout = async (event: IEvent) => {
    const stripe = await stripePromise;
    if (!user) {
      Swal.fire({
        icon: "error",
        text: "You need to be logged in to add an experience.",
      });
      return;
    }
    if (!stripe) {
      console.error("Stripe.js no se ha cargado.");
      return;
    }
    try {
      const booking = {
        TransactionNumber: "123456785", // Ajusta esto si es necesario
        Quantity: quantity,
        Paid: event.price * quantity,
        Date: new Date().toISOString(),
        userId: user.id, // Asegúrate de que el objeto user tiene un id
        eventsId: event.id,
      };

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(booking),
      });

      const { sessionId } = await response.json();
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error("Error al redirigir a Stripe Checkout", error);
      }
    } catch (error) {
      console.error("Error al crear la sesión de pago", error);
    }
  }; */

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 my-9">
      <title>Experiences</title>

      {events.length === 0 ? (
        <div className="lg:flex flex-col justify-center items-center text-2xl text-red-800 cursor-not-allowed">
          No hay eventos disponibles
        </div>
      ) : (
        events.map((event) => (
          <div
            key={event.id}
            className="flex flex-col h-full bg-gray-800 rounded-md p-4 text-center space-y-4 
              border-2 border-transparent transform transition-colors duration-500 hover:border-white"
          >
            <div>
              <Image
                src={event.picture}
                alt="Event Image"
                layout="responsive"
                width={500}
                height={500}
                className="rounded-lg"
              />
            </div>
            <div className="flex flex-col flex-grow justify-between">
              <div>
                <h1 className="text-xl font-bold text-white mb-4">
                  {event.title}
                </h1>
                <h2 className="text-lg font-medium text-gray-300 mb-4">
                  {event.subtitle}
                </h2>
                <p>Price: {event.price} $</p>
              </div>
              <div className="mt-auto">
                <button
                  className="bg-yellow-500 rounded-md hover:bg-yellow-700 px-8 py-4 mt-4 w-full"
                  onClick={() => handleImageClick(event)}
                >
                  Event Details
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white bg-opacity-95 p-6 rounded-lg w-11/12 md:w-1/2 max-h-screen overflow-y-auto relative">
            <div className="flex justify-end items-center mb-4">
              <button onClick={handleCloseModal} className="text-black text-3xl">
                X
              </button>
            </div>
            <div className="flex flex-col justify-center items-center">
              <h2 className="text-2xl font-bold text-black">
                {selectedEvent.title}
              </h2>
              <Image
                src={selectedEvent.picture}
                alt="Event Picture"
                width={300}
                height={300}
                className="rounded-lg mb-4"
              />
              <p className="text-gray-700 text-base leading-relaxed mt-4 whitespace-pre-line">
                {selectedEvent.description}
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-bold text-black">Date:</span>{" "}
                {formatEventDate(selectedEvent.date)}
              </p>
              <p className="text-gray-700 mb-2 flex items-center">
                <span className="font-bold text-black">Location:</span>{" "}
                <a
                  href={selectedEvent.location}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2"
                >
                  <Image
                    src={"/assets/googleMaps.png"}
                    alt="Google Maps"
                    width={30}
                    height={30}
                  />
                </a>
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-bold text-black">MaxSeats:</span>{" "}
                {selectedEvent.maxseats}
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-bold text-black">Price:</span> $
                {selectedEvent.price}
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-bold text-black">Seats Remain:</span>{" "}
                {selectedEvent.seatsRemain}
              </p>
              <div className="flex items-center mt-4">
                <button
                  className="bg-gray-200 rounded-l px-4 py-2 text-black"
                  onClick={() => handlePersonChange(false)}
                >
                  -
                </button>
                <div className="bg-white px-4 py-2 text-black">{quantity}</div>
                <button
                  className="bg-gray-200 rounded-r px-4 py-2 text-black"
                  onClick={() => handlePersonChange(true)}
                >
                  +
                </button>
              </div>
              <button className="bg-yellow-500 rounded-md hover:bg-yellow-700 px-8 py-4 mt-4 w-full"
                onClick={() => handleCheckout(selectedEvent)}
              >
                Add Experience
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
