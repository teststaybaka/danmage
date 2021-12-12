export class NumberRange {
  public constructor(
    public maxValue: number,
    public minValue: number,
    public defaultValue?: number
  ) {}

  public getValidValue(raw: number): number {
    let res = Math.max(raw, this.minValue);
    res = Math.min(res, this.maxValue);
    return res;
  }

  public getValidValueWithDefault(raw?: number): number {
    if (isNaN(raw)) {
      return this.defaultValue;
    }
    return this.getValidValue(raw);
  }
}
