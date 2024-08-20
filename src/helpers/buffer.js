// utils/buffer.js

export async function buffer(readable) {
    const chunks = [];
    return new Promise((resolve, reject) => {
      readable.on('data', chunk => chunks.push(chunk));
      readable.on('end', () => resolve(Buffer.concat(chunks)));
      readable.on('error', reject);
    });
  }
  