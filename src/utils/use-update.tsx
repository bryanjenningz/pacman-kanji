import {
  type Dispatch,
  type MutableRefObject,
  type SetStateAction,
  useEffect,
} from "react";
import { isOverlapping } from "~/utils/is-overlapping";
import { blockWidth, speed, screenWidth } from "~/utils/constants";
import { getRandomSpace, levelMapWalls } from "~/utils/level-map";
import { type Direction, type Position } from "~/utils/types";
import { type KanjiMonster } from "~/utils/kanji";
import { findShortestPath } from "./shortest-path";

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

        setKanjiMonsters((kanjiMonsters) => {
          return kanjiMonsters.map((kanjiMonster) => {
            if (!kanjiMonster.path[0]) {
              return {
                ...kanjiMonster,
                path: findShortestPath(kanjiMonster.position, getRandomSpace()),
              };
            }
            const nextStep = kanjiMonster.path[0];
            if (
              nextStep.x === kanjiMonster.position.x &&
              nextStep.y === kanjiMonster.position.y
            ) {
              return {
                ...kanjiMonster,
                path: kanjiMonster.path.slice(1),
              };
            }
            const dx = clamp(-1, nextStep.x - kanjiMonster.position.x, 1);
            const dy = clamp(-1, nextStep.y - kanjiMonster.position.y, 1);
            const { x, y } = kanjiMonster.position;
            return {
              ...kanjiMonster,
              position: { x: x + dx, y: y + dy },
            };
          });
        });

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

function clamp(lower: number, x: number, upper: number): number {
  return Math.min(upper, Math.max(lower, x));
}
