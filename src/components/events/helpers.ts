
const apiUrl = process.env.NEXT_PUBLIC_API_URL  

const fetchEvents = async () => {
  try {
    const response = await fetch(`${apiUrl}/events/eventsCountingBookings`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export default fetchEvents;


