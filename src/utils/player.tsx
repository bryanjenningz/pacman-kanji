import { useState } from "react";
import { initialPosition, initialDirection } from "~/utils/constants";

export function usePlayer() {
  const [position, setPosition] = useState(initialPosition);
  const [direction, setDirection] = useState(initialDirection);
  return { position, setPosition, direction, setDirection };
}
