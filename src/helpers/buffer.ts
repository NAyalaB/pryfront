import { IncomingMessage } from 'http';
import getRawBody from 'raw-body';
import { HttpError } from './http-error';

interface BufferInfo {
  limit?: string | number | undefined;
}

export const buffer = (
  req: IncomingMessage,
  { limit = '1mb' }: BufferInfo = {},
): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    const type = req.headers['content-type'] || 'text/plain';
    const length = req.headers['content-length'];

    getRawBody(req, {
      limit,
      length,
      // Eliminamos `encoding` para que el resultado sea un Buffer
      encoding: null, // Fuerza a que el resultado sea un Buffer
    })
      .then((buf) => {
        resolve(buf as Buffer); // Aseguramos que buf sea de tipo Buffer
      })
      .catch((err) => {
        if (err.type === 'entity.too.large') {
          reject(new HttpError(`Body exceeded ${limit} limit`, err));
        } else {
          reject(new HttpError('Invalid body', err));
        }
      });
  });
