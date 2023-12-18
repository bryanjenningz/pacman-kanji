import {
  type Dispatch,
  type MutableRefObject,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { isOverlapping } from "~/utils/is-overlapping";
import {
  blockWidth,
  initialPosition,
  initialDirection,
  speed,
  screenWidth,
} from "~/utils/constants";
import { levelMapWalls } from "~/utils/level-map";
import { kanjiValues, initialKanjiMonsters } from "~/utils/kanji";
import { LevelMap } from "~/components/level-map";
import { type Direction, type Position } from "~/utils/types";

export function Game() {
  const [{ x, y }, setPosition] = useState(initialPosition);
  const [direction, setDirection] = useState(initialDirection);
  const keysDown = useRef(new Set<string>());
  const [kanjiIndex, setKanjiIndex] = useState(0);
  const kanjiValue = kanjiValues[kanjiIndex];
  const [kanjiMonsters, setKanjiMonsters] = useState(initialKanjiMonsters);

  useUpdate({ direction, setDirection, setPosition, keysDown });

  useKeys({ keysDown });

  return (
    <div className="flex flex-col gap-2">
      <LevelMap />

      <div
        className="relative bg-slate-800"
        style={{ width: screenWidth, height: screenWidth }}
      >
        <div
          className="absolute z-10 bg-blue-500"
          style={{ width: blockWidth, height: blockWidth, left: x, top: y }}
        ></div>

        {kanjiMonsters.map((kanjiMonster) => {
          return (
            <div
              key={kanjiMonster.id}
              className="absolute z-10 flex items-center justify-center bg-black text-white"
              style={{
                width: blockWidth,
                height: blockWidth,
                left: kanjiMonster.position.x,
                top: kanjiMonster.position.y,
              }}
            >
              {kanjiMonster.kanjiValue.kanji}
            </div>
          );
        })}
      </div>

      <div className="text-center text-xl text-slate-300">
        {`Eat the kanji named "${kanjiValue?.meaning}"`}
      </div>
    </div>
  );
}

function useUpdate({
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

function useKeys({ keysDown }: { keysDown: MutableRefObject<Set<string>> }) {
  useEffect(() => {
    function addKey(event: KeyboardEvent) {
      keysDown.current.add(event.key);
    }
    function deleteKey(event: KeyboardEvent) {
      keysDown.current.delete(event.key);
    }

    document.addEventListener("keydown", addKey);
    document.addEventListener("keyup", deleteKey);

    return () => {
      document.removeEventListener("keydown", addKey);
      document.removeEventListener("keyup", deleteKey);
    };
  }, []);
}
