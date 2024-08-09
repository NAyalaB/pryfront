export async function sendCreateUserEmail(email: string, name: string) {
    const response = await fetch('http://localhost:3001/email/CreateUserEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        text: 'Gracias por registrarte',
        urlHome: 'http://localhost:3000/home',
        name: name,
      }),
    });
  
    const data = await response.json();
    console.log(data);
  }
  