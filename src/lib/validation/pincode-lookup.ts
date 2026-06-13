import { PINCODE_RANGES } from "@/data/pincode-ranges";

export function getStateFromPincode(pincode: string): string | null {
  const code = parseInt(pincode, 10);
  if (isNaN(code) || pincode.length !== 6) return null;

  let lo = 0;
  let hi = PINCODE_RANGES.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const range = PINCODE_RANGES[mid];
    if (code < range.start) hi = mid - 1;
    else if (code > range.end) lo = mid + 1;
    else return range.state;
  }
  return null;
}
