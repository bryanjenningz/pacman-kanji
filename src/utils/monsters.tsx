import { useCallback, useEffect, useMemo, useState } from "react";
import { blockWidth } from "~/utils/screen";
import { type Position } from "~/utils/types";
import { isOverlapping } from "~/utils/collisions";
import { getRandomSpace } from "~/utils/level-map";
import { findShortestPath } from "~/utils/shortest-path";
import { fetchKanji, initKanji, parseKanji, type Kanji } from "~/utils/kanji";

export type Monster = {
  id: number;
  kanji: Kanji;
  position: Position;
  path: Position[];
};

const initMonsters: Monster[] = (
  [
    { x: blockWidth * 5, y: blockWidth * 3 },
    { x: blockWidth * 9, y: blockWidth * 3 },
    { x: blockWidth * 5, y: blockWidth * 7 },
    { x: blockWidth * 9, y: blockWidth * 7 },
  ] as const
).map(
  (position, i): Monster => ({
    id: i,
    kanji: initKanji[i] ?? initKanji[0],
    position,
    path: [],
  }),
);

export function use() {
  const [monsters, setMonsters] = useState(initMonsters);

  useEffect(() => {
    void (async () => {
      const text = await fetchKanji();
      const kanjis = parseKanji(text);
      for (const [i, kanji] of kanjis.entries()) {
        initKanji[i] = kanji;
      }
    })();
  }, []);

  const target = useMemo(() => getTargetMonster(monsters).kanji, [monsters]);

  const updateMonsters = useCallback((playerPosition: Position) => {
    setMonsters((monsters) => {
      const targetKanji = getTargetMonster(monsters).kanji.character;

      return monsters.map((monster) => {
        if (
          monster.kanji.character === targetKanji &&
          isOverlapping(monster.position, playerPosition)
        ) {
          return updateMonster(monster);
        }

        const nextStep = monster.path[0];
        if (!nextStep) {
          return {
            ...monster,
            path: findShortestPath(monster.position, getRandomSpace()),
          };
        }

        if (
          nextStep.x === monster.position.x &&
          nextStep.y === monster.position.y
        ) {
          return {
            ...monster,
            path: monster.path.slice(1),
          };
        }

        const dx = clamp(-speed, nextStep.x - monster.position.x, speed);
        const dy = clamp(-speed, nextStep.y - monster.position.y, speed);
        const { x, y } = monster.position;

        return {
          ...monster,
          position: { x: x + dx, y: y + dy },
        };
      });
    });
  }, []);

  return { monsters, target, updateMonsters };
}

function updateMonster(monster: Monster): Monster {
  const kanjiIndex = initKanji.findIndex(
    (x) => x.character === monster.kanji.character,
  );
  const newKanjiIndex = (kanjiIndex + initMonsters.length) % initKanji.length;
  const newKanjiValue = initKanji[newKanjiIndex]!;
  return {
    ...monster,
    id: monster.id + initMonsters.length,
    kanji: newKanjiValue,
  };
}

function getTargetMonster(monsters: Monster[]): Monster {
  return monsters.sort((a, b) => a.id - b.id)[0]!;
}

function clamp(lower: number, x: number, upper: number): number {
  return Math.min(upper, Math.max(lower, x));
}

const speed = 1;

export function View({ monster }: { monster: Monster }) {
  return (
    <div
      className="absolute z-10 flex items-center justify-center bg-black text-white"
      style={{
        width: blockWidth,
        height: blockWidth,
        left: monster.position.x,
        top: monster.position.y,
      }}
    >
      {monster.kanji.character}
    </div>
  );
}
