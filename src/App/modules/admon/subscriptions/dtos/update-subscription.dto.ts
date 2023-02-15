import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IParam } from 'src/App/shared/utils/query.interface';
import { status } from '../..';

export class updateSubscriptionDetailDto implements IParam {
  reflectData = (): unknown => this;
  @IsString()
  @IsNotEmpty()
  public id: string;
  @IsNumber()
  @IsNotEmpty()
  public subscriptionStatus: status;
}
export class updateDetialDto {
  @IsString()
  @IsNotEmpty()
  public code: string;
  @IsString()
  @IsNotEmpty()
  public userId: string;
}
