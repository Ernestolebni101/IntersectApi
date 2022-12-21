import { Injectable } from '@nestjs/common';
import { UnitOfWorkAdapter } from 'src/App/Database';
import { IGroupsRepository } from '../../groups/repository/groups.repository';
import { BillingPeriodRepository } from '../catalogs/billing-period/repository/billing-period.repository';
import { createSuscriptionDto } from './dtos/create-suscription.dto';
import { SuscriptionRepository } from './repository/suscription.repository';

@Injectable()
export class SuscriptionService {
  private readonly groupRepo: IGroupsRepository;
  constructor(
    private readonly unitOfWork: UnitOfWorkAdapter,
    private readonly suscriptionRepo: SuscriptionRepository,
    private readonly periodRepo: BillingPeriodRepository,
  ) {
    this.groupRepo = this.unitOfWork.Repositories.groupsRepository;
  }
  public async newSuscription(
    payload: createSuscriptionDto,
  ): Promise<createSuscriptionDto> {
    const suscriptionResult = await this.suscriptionRepo.newSuscription(
      payload,
      this.groupRepo.updateGroup,
      this.periodRepo.getByParam,
    );
    this.unitOfWork.commitChanges();
    return suscriptionResult;
  }
}
