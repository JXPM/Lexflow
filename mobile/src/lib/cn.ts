import clsx, { type ClassValue } from "clsx";

/** Tiny className combiner for NativeWind. */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
