import {
  type Dispatch,
  type MutableRefObject,
  type SetStateAction,
  useEffect,
} from "react";
import { isOverlapping } from "~/utils/is-overlapping";
import { blockWidth, speed, screenWidth } from "~/utils/constants";
import { levelMapWalls } from "~/utils/level-map";
import { type Direction, type Position } from "~/utils/types";
import { type KanjiMonster } from "~/utils/kanji";

export function useUpdate({
  direction,
  setDirection,
  setPosition,
  keysDown,
  setKanjiMonsters,
}: {
  direction: Direction;
  setDirection: Dispatch<SetStateAction<Direction>>;
  setPosition: Dispatch<SetStateAction<Position>>;
  keysDown: MutableRefObject<Set<string>>;
  setKanjiMonsters: Dispatch<SetStateAction<KanjiMonster[]>>;
}) {
  useEffect(() => {
    let isActive = true;

    (function update() {
      if (!isActive) return;

      setPosition(({ x, y }) => {
        const newDirection = updateDirection({
          keysDown,
          position: { x, y },
          direction,
        });
        setDirection(newDirection);

        const newPosition = updatePosition({
          position: { x, y },
          direction: newDirection,
        });
        if (levelMapWalls.some((wall) => isOverlapping(newPosition, wall))) {
          return { x, y };
        }
        return newPosition;
      });

      requestAnimationFrame(update);
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
  position: { x, y },
  direction,
}: {
  keysDown: MutableRefObject<Set<string>>;
  position: Position;
  direction: Direction;
}) {
  if (
    keysDown.current.has("ArrowLeft") &&
    !levelMapWalls.some((wall) =>
      isOverlapping(
        wall,
        updatePosition({ position: { x, y }, direction: "LEFT" }),
      ),
    )
  ) {
    return "LEFT";
  } else if (
    keysDown.current.has("ArrowRight") &&
    !levelMapWalls.some((wall) =>
      isOverlapping(
        wall,
        updatePosition({ position: { x, y }, direction: "RIGHT" }),
      ),
    )
  ) {
    return "RIGHT";
  } else if (
    keysDown.current.has("ArrowUp") &&
    !levelMapWalls.some((wall) =>
      isOverlapping(
        wall,
        updatePosition({ position: { x, y }, direction: "UP" }),
      ),
    )
  ) {
    return "UP";
  } else if (
    keysDown.current.has("ArrowDown") &&
    !levelMapWalls.some((wall) =>
      isOverlapping(
        wall,
        updatePosition({ position: { x, y }, direction: "DOWN" }),
      ),
    )
  ) {
    return "DOWN";
  }
  return direction;
}
