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

export function useUpdate({
  direction,
  setDirection,
  setPosition,
  keysDown,
}: {
  direction: Direction;
  setDirection: Dispatch<SetStateAction<Direction>>;
  setPosition: Dispatch<SetStateAction<Position>>;
  keysDown: MutableRefObject<Set<string>>;
}) {
  useEffect(() => {
    let isActive = true;

    (function update() {
      if (!isActive) return;

      if (keysDown.current.has("ArrowLeft")) {
        setDirection("LEFT");
      } else if (keysDown.current.has("ArrowRight")) {
        setDirection("RIGHT");
      } else if (keysDown.current.has("ArrowUp")) {
        setDirection("UP");
      } else if (keysDown.current.has("ArrowDown")) {
        setDirection("DOWN");
      }

      setPosition(({ x, y }) => {
        switch (direction) {
          case "LEFT": {
            const newPosition = {
              x: Math.max(0, x - speed),
              y,
            };
            if (
              levelMapWalls.some((space) => isOverlapping(newPosition, space))
            ) {
              return { x, y };
            }
            return newPosition;
          }
          case "RIGHT": {
            const newPosition = {
              x: Math.min(screenWidth - blockWidth, x + speed),
              y,
            };
            if (
              levelMapWalls.some((space) => isOverlapping(newPosition, space))
            ) {
              return { x, y };
            }
            return newPosition;
          }
          case "UP": {
            const newPosition = {
              x,
              y: Math.max(0, y - speed),
            };
            if (
              levelMapWalls.some((space) => isOverlapping(newPosition, space))
            ) {
              return { x, y };
            }
            return newPosition;
          }
          case "DOWN": {
            const newPosition = {
              x,
              y: Math.min(screenWidth - blockWidth, y + speed),
            };
            if (
              levelMapWalls.some((space) => isOverlapping(newPosition, space))
            ) {
              return { x, y };
            }
            return newPosition;
          }
        }
      });

      requestAnimationFrame(update);
    })();

    return () => {
      isActive = false;
    };
  }, [direction]);
}