 // src/helpers/fileUtils.ts

 const apiUrl = process.env.NEXT_PUBLIC_API_URL  

 export const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await fetch(`${apiUrl}/uploadImage`, {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to upload file');
      }
  
      const fileUrl = await response.text(); // Si la respuesta es texto (URL directamente)
    
    return fileUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};  