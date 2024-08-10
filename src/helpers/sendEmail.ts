const apiUrl = process.env.NEXT_PUBLIC_API_URL  
export async function sendCreateUserEmail(email: string, name: string) {
    const response = await fetch(`${apiUrl}/email/CreateUserEmail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        text: 'Gracias por registrarte',
        urlHome: `https://pryfront.vercel.app/home`,
        name: name,
      }),
    });
  
    const data = await response.json();
    console.log(data);
  }
  