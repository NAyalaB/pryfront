// utils/http-error.ts
export class HttpError extends Error {
    constructor(public message: string, public originalError?: any) {
      super(message);
      this.name = 'HttpError';
      if (originalError) {
        console.error(originalError);
      }
    }
  }
  