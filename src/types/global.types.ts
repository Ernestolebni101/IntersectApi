export declare type PromiseSettledResult<T> = {
  status: 'fulfilled';
  value: T;
};

export declare type PromiseRejectedResult = {
  status: 'rejected';
  reason: any;
};

export declare type PromiseSettled<T> =
  | PromiseSettledResult<T>
  | PromiseRejectedResult;

export function getValue<T>(result: PromiseSettled<T>): T {
  if (result.status === 'fulfilled') {
    return result.value;
  } else {
    throw result.reason;
  }
}

// const currentDate = moment();
// const beginDate: number = currentDate.startOf('month').valueOf();
// const endDate: number = moment('2023-03-01').add(6, 'days').valueOf();
// const date = Time.daysBetween({
//   startDate: new Date(beginDate),
//   endDate: new Date(endDate),
// });
// console.log(date);
