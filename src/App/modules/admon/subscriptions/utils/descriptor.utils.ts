export class Descriptor {
  public static async Distinct<T extends Array<any>, K extends keyof any>(
    iterable: T,
    prop: K,
    fn: (parameter: string) => Promise<any>,
  ): Promise<Record<string, any>> {
    const uniques = new Set(iterable.flatMap((sub) => sub[prop]));
    const iterables = await Promise.all(
      Array.from(uniques).map(async (id) => ({
        [id]: await fn(id),
      })),
    );
    return iterables.reduce((_acc, _iter) => {
      return { ..._acc, ..._iter };
    }, {});
  }
  public static toHashMap<T extends Array<any>, K extends keyof any>(
    iterable: T,
    prop: K,
  ): Record<string, any> {
    return iterable.reduce((_acc, _iter) => {
      _acc[_iter[prop]] = _iter;
      return _acc;
    }, {} as Record<string, any>);
  }
}
