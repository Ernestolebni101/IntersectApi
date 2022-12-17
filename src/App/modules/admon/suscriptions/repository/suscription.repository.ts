import { createSuscriptionDto } from '../dtos/create-suscription.dto';
import { SuscriptionDetailDto } from '../dtos/read-suscriptions.dto';

export interface ISuscription {
  newSuscription(payload: createSuscriptionDto): Promise<SuscriptionDetailDto>;
  getSuscription();
  getSuscriptionDetail();
}

export class SuscriptionRepository implements ISuscription {
  newSuscription(payload: createSuscriptionDto): Promise<SuscriptionDetailDto> {
    throw new Error('Method not implemented.');
  }
  getSuscription() {
    throw new Error('Method not implemented.');
  }
  getSuscriptionDetail() {
    throw new Error('Method not implemented.');
  }
}
