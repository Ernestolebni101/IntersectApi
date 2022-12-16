import { createSuscriptionDto } from '../dtos/create-suscription.dto';
import { SuscriptionDetailDto } from '../dtos/read-suscriptions.dto';

export interface ISuscription {
  newSuscription(payload: createSuscriptionDto): Promise<SuscriptionDetailDto>;
  getSuscription();
  getSuscriptionDetail();
}

export class SuscriptionRepository implements ISuscription {}
