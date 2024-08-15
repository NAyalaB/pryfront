const apiUrl = process.env.NEXT_PUBLIC_API_URL  
const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_PROD_URL || process.env.NEXT_PUBLIC_FRONTEND_URL;

export async function sendCreateUserEmail(email: string, name: string) {
    const response = await fetch(`${apiUrl}/email/CreateUserEmail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        text: `Welcome to Our culinary experience, ${name} !`,
        urlHome: `${frontendUrl}/home`,
        name: name,
      }),
    });
  
    const data = await response.json();
    console.log(data);
  }
  