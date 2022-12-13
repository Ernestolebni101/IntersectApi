import { Request, Response } from 'express';

const success = (
  req: Request,
  res: Response,
  message: any,
  statusCode = 200,
): Response => {
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
  fn: (msg: string, e: string, context: string) => void = undefined,
  context = '',
): Response => {
  fn != undefined &&
    fn('Error en la Petición', `Traza del Error: ${details}`, context);
  return res.status(statusCode).send({
    error: message,
    body: '',
  });
};
export { success, error };
