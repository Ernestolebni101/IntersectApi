import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { status } from '../..';

export class updateSubscriptionDetailDto {
  @IsString()
  @IsNotEmpty()
  public id: string;
  @IsNumber()
  @IsNotEmpty()
  public subscriptionStatus: status;
}
