import { useEffect, useRef, useState } from "react";

type Position = { x: number; y: number };

type Direction = "LEFT" | "RIGHT" | "UP" | "DOWN";

const initialDirection: Direction = "LEFT";
const blockWidth = 20;
const screenWidth = 300;
const speed = 2;
const initialPosition: Position = { x: blockWidth * 7, y: blockWidth * 11 };

const levelMap = [
  "###############",
  "#      #      #",
  "# #### # #### #",
  "#             #",
  "## ##     ## ##",
  "#             #",
  "# ###     ### #",
  "#             #",
  "# #### # #### #",
  "#    #   #    #",
  "## # ## ## # ##",
  "#  #       #  #",
  "# #### # #### #",
  "#             #",
  "###############",
].map((row) => row.split(""));
const levelMapWall = "#";
const levelMapWalls = levelMap
  .flatMap((row, y) =>
    row.map((tile, x) => ({ x: blockWidth * x, y: blockWidth * y, tile })),
  )
  .filter(({ tile }) => tile === levelMapWall);
const levelMapSpaces = levelMap
  .flatMap((row, y) =>
    row.map((tile, x) => ({ x: blockWidth * x, y: blockWidth * y, tile })),
  )
  .filter(({ tile }) => tile === " ");

function getRandomSpace(): Position {
  const index = Math.floor(Math.random() * levelMapSpaces.length);
  return levelMapSpaces[index]!;
}

function findShortestPath(from: Position, to: Position): Position[] {
  const visited = new Set<`x:${number},y:${number}`>();

  function search({ x, y }: Position, path: Position[]): Position[] | void {
    if (x === to.x && y === to.y) return path;
    if (visited.has(`x:${x},y:${y}`)) return;
    if (!levelMapSpaces.find((space) => space.x === x && space.y === y)) return;
    visited.add(`x:${x},y:${y}`);
    const neighbors = [
      [x + blockWidth, y],
      [x - blockWidth, y],
      [x, y + blockWidth],
      [x, y - blockWidth],
    ] as const;
    for (const [newX, newY] of neighbors) {
      path.push({ x: newX, y: newY });
      const shortestPath = search({ x: newX, y: newY }, path);
      if (shortestPath) return shortestPath;
      path.pop();
    }
  }

  return search(from, []) ?? [to];
}

type KanjiValue = { kanji: string; meaning: string };
const kanjiValues: KanjiValue[] = [
  { kanji: "一", meaning: "one" },
  { kanji: "二", meaning: "two" },
  { kanji: "三", meaning: "three" },
  { kanji: "四", meaning: "four" },
  { kanji: "五", meaning: "five" },
  { kanji: "六", meaning: "six" },
  { kanji: "七", meaning: "seven" },
  { kanji: "八", meaning: "eight" },
  { kanji: "九", meaning: "nine" },
  { kanji: "十", meaning: "ten" },
];

type KanjiMonster = {
  id: number;
  kanjiValue: KanjiValue;
  position: Position;
  path: Position[];
};
const initialKanjiMonsters: KanjiMonster[] = [
  {
    id: 0,
    kanjiValue: kanjiValues[0]!,
    position: { x: blockWidth * 6, y: blockWidth * 4 },
    path: [],
  },
  {
    id: 1,
    kanjiValue: kanjiValues[1]!,
    position: { x: blockWidth * 8, y: blockWidth * 4 },
    path: [],
  },
  {
    id: 2,
    kanjiValue: kanjiValues[2]!,
    position: { x: blockWidth * 6, y: blockWidth * 6 },
    path: [],
  },
  {
    id: 3,
    kanjiValue: kanjiValues[3]!,
    position: { x: blockWidth * 8, y: blockWidth * 6 },
    path: [],
  },
];

function isOverlapping<P extends Position>(a: P, b: P): boolean {
  return (
    a.x > b.x - blockWidth &&
    a.x < b.x + blockWidth &&
    a.y > b.y - blockWidth &&
    a.y < b.y + blockWidth
  );
}

export function Game() {
  const [{ x, y }, setPosition] = useState(initialPosition);
  const [direction, setDirection] = useState(initialDirection);
  const keysDown = useRef(new Set<string>());
  const [kanjiIndex, setKanjiIndex] = useState(0);
  const kanjiValue = kanjiValues[kanjiIndex];
  const [kanjiMonsters, setKanjiMonsters] = useState(initialKanjiMonsters);

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

function LevelMap() {
  return (
    <div
      className="absolute"
      style={{ width: screenWidth, height: screenWidth }}
    >
      {levelMap.map((row, y) => {
        return (
          <div key={y}>
            {row.map((char, x) => {
              const isWall = char === levelMapWall;
              return (
                <div
                  key={x}
                  style={{
                    width: blockWidth,
                    height: blockWidth,
                    left: x * blockWidth,
                    top: y * blockWidth,
                  }}
                  className={isWall ? "absolute z-10 bg-blue-900" : "hidden"}
                ></div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
