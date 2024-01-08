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

const directionDeltas = {
  UP: { dx: 0, dy: -1 },
  DOWN: { dx: 0, dy: 1 },
  LEFT: { dx: -1, dy: 0 },
  RIGHT: { dx: 1, dy: 0 },
} as const satisfies Record<Direction, Deltas>;

export function toDeltas(direction: Direction): Deltas {
  return directionDeltas[direction];
}

// STRING

export function toString(direction: Direction): string {
  return direction.toLowerCase();
}
