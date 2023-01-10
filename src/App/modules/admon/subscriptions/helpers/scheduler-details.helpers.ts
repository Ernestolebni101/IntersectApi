import { status } from '../..';
export const scheduler: Record<string, number> = {
  '0': status.TOEXPIRE,
  '-3': status.EXPIRED,
};
