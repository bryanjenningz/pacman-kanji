import { useRef, useState } from "react";
import {
  blockWidth,
  initialPosition,
  initialDirection,
  screenWidth,
} from "~/utils/constants";
import { getCurrentKanjiMonster, useKanjiMonsters } from "~/utils/kanji";
import { LevelMap } from "~/components/level-map";
import { useUpdate } from "~/utils/use-update";
import { useKeys } from "~/utils/use-keys";

export function Game() {
  const [{ x, y }, setPosition] = useState(initialPosition);
  const [direction, setDirection] = useState(initialDirection);
  const keysDown = useRef(new Set<string>());
  const { kanjiMonsters, updateKanjiMonsters } = useKanjiMonsters();
  const currentKanjiMonster = getCurrentKanjiMonster(kanjiMonsters);

  useUpdate({
    direction,
    setDirection,
    setPosition,
    keysDown,
    updateKanjiMonsters,
  });

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
        {`Eat the kanji named "${currentKanjiMonster.kanjiValue.meaning}"`}
      </div>
    </div>
  );
}
