import { useEffect, useRef, useState } from "react";

type Direction = "LEFT" | "RIGHT" | "UP" | "DOWN";

type Kanji = { kanji: string; meaning: string };

const initialPosition = { x: 200, y: 200 };
const initialDirection: Direction = "LEFT";
const blockWidth = 20;
const screenWidth = 300;
const speed = 2;

const kanjiValues: Kanji[] = [
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
] as const;

export function Game() {
  const [{ x, y }, setPosition] = useState(initialPosition);
  const [direction, setDirection] = useState(initialDirection);
  const keysDown = useRef(new Set<string>());
  const [kanjiIndex, setKanjiIndex] = useState(0);
  const kanjiValue = kanjiValues[kanjiIndex];

  useEffect(() => {
    let isActive = true;

    (function update() {
      if (!isActive) return;

      (() => {
        if (keysDown.current.has("ArrowLeft")) {
          setDirection("LEFT");
        } else if (keysDown.current.has("ArrowRight")) {
          setDirection("RIGHT");
        } else if (keysDown.current.has("ArrowUp")) {
          setDirection("UP");
        } else if (keysDown.current.has("ArrowDown")) {
          setDirection("DOWN");
        }

        switch (direction) {
          case "LEFT":
            return setPosition(({ x, y }) => ({
              x: Math.max(0, x - speed),
              y,
            }));
          case "RIGHT":
            return setPosition(({ x, y }) => ({
              x: Math.min(screenWidth - blockWidth, x + speed),
              y,
            }));
          case "UP":
            return setPosition(({ x, y }) => ({
              x,
              y: Math.max(0, y - speed),
            }));
          case "DOWN":
            return setPosition(({ x, y }) => ({
              x,
              y: Math.min(screenWidth - blockWidth, y + speed),
            }));
        }
      })();

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
      <div
        className="relative bg-slate-800"
        style={{ width: screenWidth, height: screenWidth }}
      >
        <div
          className="absolute bg-blue-500"
          style={{ width: blockWidth, height: blockWidth, left: x, top: y }}
        ></div>
      </div>

      <div className="text-center text-xl text-slate-300">
        {kanjiValue?.meaning}
      </div>
    </div>
  );
}
