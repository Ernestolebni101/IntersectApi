import { Inject } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import {
  IGroupEntity,
  IGroupStrategy,
} from 'src/App/shared/strategys/istrategy.interface';
import { CreateGroupDto } from '../../dto/create-group.dto';
import { Group } from '../../entities/group.entity';
import {
  FIRSTGROUP,
  IGroupsRepository,
} from '../../repository/groups.repository';

export const ICREATE = Symbol('CreationStrategy');
export class CreationStrategy implements IGroupStrategy {
  constructor(
    @Inject(FIRSTGROUP)
    private readonly groupRepository: IGroupsRepository,
  ) {}
  public async Execute<TModel extends IGroupEntity>(
    model: TModel,
    group: Group,
  ): Promise<any> {
    await this.groupRepository.createGroup(
      plainToInstance(CreateGroupDto, model.getPayload()),
    );
  }
}
