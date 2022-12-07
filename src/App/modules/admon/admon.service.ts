import { Injectable } from '@nestjs/common';
import { CreateAdmonDto } from './dto/create-suscription.dto';
import { UpdateAdmonDto } from './dto/update-suscription.dto';

@Injectable()
export class AdmonService {
  create(createAdmonDto: CreateAdmonDto) {
    return 'This action adds a new admon';
  }

  findAll() {
    return `This action returns all admon`;
  }

  findOne(id: number) {
    return `This action returns a #${id} admon`;
  }

  update(id: number, updateAdmonDto: UpdateAdmonDto) {
    return `This action updates a #${id} admon`;
  }

  remove(id: number) {
    return `This action removes a #${id} admon`;
  }
}
