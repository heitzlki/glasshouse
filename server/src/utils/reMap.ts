/**
 * * Re-maps a number from one range to another.
 * * That is, a value of fromLow would get mapped to toLow,
 * * a value of fromHigh to toHigh,
 * * values in-between to values in-between, etc.
 */
const reMap = (
  value: number,
  fromLow: number,
  fromHigh: number,
  toLow: number,
  toHigh: number
) => ((value - fromLow) * (toHigh - toLow)) / (fromHigh - fromLow) + toLow;

export default reMap;
