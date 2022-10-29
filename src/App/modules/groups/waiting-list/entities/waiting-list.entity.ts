import { Collection } from 'fireorm';
import { Time } from '../../../../../Utility/utility-time-zone';

/**
 * @ModifiedDate : 2/24/2022
 * @Author : Ernesto Miranda Escobar
 * @Description : Encargada de almacenar las solicitudes de espera para unirse a un determinado grupo o subgrupo
 */
@Collection()
export class WaitingList {
  public id: string;
  public userId: string;
  public groupId: string;
  public isAccepted: boolean = null;
  public isBanned = false;
  public isNotified = true;
  public requestedTime: string = Time.formatAMPM(new Date());
}
