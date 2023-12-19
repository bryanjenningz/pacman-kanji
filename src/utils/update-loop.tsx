import {
  type Dispatch,
  type MutableRefObject,
  type SetStateAction,
  useEffect,
} from "react";
import { isOverlapping } from "~/utils/collisions";
import { blockWidth, speed, screenWidth } from "~/utils/constants";
import { levelMapWalls } from "~/utils/level-map";
import { type Direction, type Position } from "~/utils/types";

export function useUpdateLoop({
  direction,
  setDirection,
  setPosition,
  keysDown,
  updateKanjiMonsters,
}: {
  direction: Direction;
  setDirection: Dispatch<SetStateAction<Direction>>;
  setPosition: Dispatch<SetStateAction<Position>>;
  keysDown: MutableRefObject<Set<string>>;
  updateKanjiMonsters: (position: Position) => void;
}) {
  useEffect(() => {
    let isActive = true;

    (function updateLoop() {
      if (!isActive) return;

      setPosition((position) => {
        const newDirection = updateDirection({
          keysDown,
          position,
          direction,
        });
        setDirection(newDirection);

        const newPosition = ((): Position => {
          const newPosition = updatePosition({
            position,
            direction: newDirection,
          });

          if (levelMapWalls.some((wall) => isOverlapping(newPosition, wall))) {
            return position;
          }
          return newPosition;
        })();

        updateKanjiMonsters(newPosition);

        return newPosition;
      });

      requestAnimationFrame(updateLoop);
    })();

    return () => {
      isActive = false;
    };
  }, [direction]);
}

function updatePosition({
  position: { x, y },
  direction,
}: {
  position: Position;
  direction: Direction;
}): Position {
  switch (direction) {
    case "LEFT":
      return { x: Math.max(0, x - speed), y };
    case "RIGHT":
      return { x: Math.min(screenWidth - blockWidth, x + speed), y };
    case "UP":
      return { x, y: Math.max(0, y - speed) };
    case "DOWN":
      return { x, y: Math.min(screenWidth - blockWidth, y + speed) };
  }
}

function updateDirection({
  keysDown,
  position,
  direction,
}: {
  keysDown: MutableRefObject<Set<string>>;
  position: Position;
  direction: Direction;
}) {
  if (
    keysDown.current.has("ArrowLeft") &&
    !levelMapWalls.some((wall) =>
      isOverlapping(wall, updatePosition({ position, direction: "LEFT" })),
    )
  ) {
    return "LEFT";
  } else if (
    keysDown.current.has("ArrowRight") &&
    !levelMapWalls.some((wall) =>
      isOverlapping(wall, updatePosition({ position, direction: "RIGHT" })),
    )
  ) {
    return "RIGHT";
  } else if (
    keysDown.current.has("ArrowUp") &&
    !levelMapWalls.some((wall) =>
      isOverlapping(wall, updatePosition({ position, direction: "UP" })),
    )
  ) {
    return "UP";
  } else if (
    keysDown.current.has("ArrowDown") &&
    !levelMapWalls.some((wall) =>
      isOverlapping(wall, updatePosition({ position, direction: "DOWN" })),
    )
  ) {
    return "DOWN";
  }
  return direction;
}
