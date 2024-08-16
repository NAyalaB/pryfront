const apiUrl = process.env.NEXT_PUBLIC_API_URL;  
const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_PROD_URL || process.env.NEXT_PUBLIC_FRONTEND_URL;

export async function sendCreateBookingEmail(
  email: string,
  title: string,
  subtitle: string,
  description: string,
  date: string,
  price: number,
  location: string,
  picture: string
) {
  const response = await fetch(`${apiUrl}/email/CreateBookingEmail`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: email,
      text: `Thank you for booking ${title}! Here are the details of your booking.`,
      title: title,
      subtitle: subtitle,
      description: description,
      date: date,
      location: location,
      price: price,
      picture: picture,
      urlHome: `${frontendUrl}/home`,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to send email: ${errorText}`);
  }

  const data = await response.json();
  console.log(data);
}
