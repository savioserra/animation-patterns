export const clamp = (
  lowerBound: number,
  value: number,
  upperBound: number,
) => {
  'worklet';
  return Math.min(Math.max(lowerBound, value), upperBound);
};
