export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

// ARROW KEYS

type ArrowKey = (typeof directionArrowKeys)[Direction];

const directionArrowKeys = {
  UP: "ArrowUp",
  DOWN: "ArrowDown",
  LEFT: "ArrowLeft",
  RIGHT: "ArrowRight",
} as const satisfies Record<Direction, string>;

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

export function toArrowKey(direction: Direction): ArrowKey {
  return directionArrowKeys[direction];
}

// DELTAS

type Deltas = { dx: number; dy: number };

export function toDeltas(direction: Direction): Deltas {
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

// STRING

export function toString(direction: Direction): string {
  return direction.toLowerCase();
}
