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
export class updateDetialDto {
  @IsString()
  @IsNotEmpty()
  public code: string;
  @IsString()
  @IsNotEmpty()
  public userId: string;
}
