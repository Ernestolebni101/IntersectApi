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
