export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

export function fromArrowKey(key: string): Direction | null {
  switch (key) {
    case "ArrowUp":
      return "UP";
    case "ArrowDown":
      return "DOWN";
    case "ArrowLeft":
      return "LEFT";
    case "ArrowRight":
      return "RIGHT";
    default:
      return null;
  }
}

export function toArrowKey(direction: Direction): string {
  switch (direction) {
    case "UP":
      return "ArrowUp";
    case "DOWN":
      return "ArrowDown";
    case "LEFT":
      return "ArrowLeft";
    case "RIGHT":
      return "ArrowRight";
  }
}

export function toDeltas(direction: Direction): { dx: number; dy: number } {
  switch (direction) {
    case "UP":
      return { dx: 0, dy: -1 };
    case "DOWN":
      return { dx: 0, dy: 1 };
    case "LEFT":
      return { dx: -1, dy: 0 };
    case "RIGHT":
      return { dx: 1, dy: 0 };
  }
}

export function toString(direction: Direction): string {
  return direction.toLowerCase();
}
