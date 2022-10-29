import { Request, Response } from 'express';

const success = (
  req: Request,
  res: Response,
  message: any,
  statusCode = 200,
): Response => {
  console.log(message);
  return res.status(statusCode).send({
    error: '',
    body: message,
  });
};

const error = (
  req: Request,
  res: Response,
  message: any,
  details: string,
  statusCode = 500,
): Response => {
  console.error(`response.error: ${details}`);
  return res.status(statusCode).send({
    error: message,
    body: '',
  });
};
export { success, error };
