export const clamp = ([lowerBound, value, upperBound]: [
  number,
  number,
  number,
]) => {
  'worklet';
  return Math.min(Math.max(lowerBound, value), upperBound);
};
