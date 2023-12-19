import { useState } from "react";
import { blockWidth } from "~/utils/constants";
import { type Direction, type Position } from "~/utils/types";

const initialPosition: Position = {
  x: blockWidth * 7,
  y: blockWidth * 11,
};

export const initialDirection: Direction = "LEFT";

export function usePlayer() {
  const [position, setPosition] = useState(initialPosition);
  const [direction, setDirection] = useState(initialDirection);
  return { position, setPosition, direction, setDirection };
}
