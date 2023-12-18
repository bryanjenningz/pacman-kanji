import { type Position } from "~/utils/types";
import { blockWidth } from "~/utils/constants";

export function isOverlapping<P extends Position>(a: P, b: P): boolean {
  return (
    a.x > b.x - blockWidth &&
    a.x < b.x + blockWidth &&
    a.y > b.y - blockWidth &&
    a.y < b.y + blockWidth
  );
}
