import { useCallback, useEffect, useMemo, useState } from "react";
import { blockWidth } from "~/utils/screen";
import { type Position } from "~/utils/types";
import { isOverlapping } from "~/utils/collisions";
import { getRandomSpace } from "~/utils/level-map";
import { findShortestPath } from "~/utils/shortest-path";
import { initKanji, type Kanji } from "~/utils/kanji";

export type Monster = {
  id: number;
  kanjiValue: Kanji;
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
).map((position, i) => ({
  id: i,
  kanjiValue: initKanji[i] ?? initKanji[0],
  position,
  path: [],
}));

export function useKanjiMonsters() {
  const [kanjiMonsters, setKanjiMonsters] = useState(initMonsters);

  useEffect(() => {
    void (async () => {
      const response = await fetch("/heisig-kanji.txt");
      const text = await response.text();
      text.split("\n").forEach((line, i) => {
        const [kanji, meaning] = line.split("\t");
        initKanji[i] = { character: kanji!, meaning: meaning! };
      });
    })();
  }, []);

  const target = useMemo(
    () => getTargetKanjiMonster(kanjiMonsters).kanjiValue,
    [kanjiMonsters],
  );

  const updateKanjiMonsters = useCallback((playerPosition: Position) => {
    setKanjiMonsters((kanjiMonsters) => {
      const targetKanji =
        getTargetKanjiMonster(kanjiMonsters).kanjiValue.character;

      return kanjiMonsters.map((kanjiMonster) => {
        if (
          kanjiMonster.kanjiValue.character === targetKanji &&
          isOverlapping(kanjiMonster.position, playerPosition)
        ) {
          return updateKanjiMonster(kanjiMonster);
        }

        const nextStep = kanjiMonster.path[0];
        if (!nextStep) {
          return {
            ...kanjiMonster,
            path: findShortestPath(kanjiMonster.position, getRandomSpace()),
          };
        }

        if (
          nextStep.x === kanjiMonster.position.x &&
          nextStep.y === kanjiMonster.position.y
        ) {
          return {
            ...kanjiMonster,
            path: kanjiMonster.path.slice(1),
          };
        }

        const dx = clamp(-speed, nextStep.x - kanjiMonster.position.x, speed);
        const dy = clamp(-speed, nextStep.y - kanjiMonster.position.y, speed);
        const { x, y } = kanjiMonster.position;

        return {
          ...kanjiMonster,
          position: { x: x + dx, y: y + dy },
        };
      });
    });
  }, []);

  return { kanjiMonsters, target, updateKanjiMonsters };
}

function updateKanjiMonster(kanjiMonster: Monster): Monster {
  const kanjiIndex = initKanji.findIndex(
    (x) => x.character === kanjiMonster.kanjiValue.character,
  );
  const newKanjiIndex = (kanjiIndex + initMonsters.length) % initKanji.length;
  const newKanjiValue = initKanji[newKanjiIndex]!;
  return {
    ...kanjiMonster,
    id: kanjiMonster.id + initMonsters.length,
    kanjiValue: newKanjiValue,
  };
}

function getTargetKanjiMonster(kanjiMonsters: Monster[]): Monster {
  return kanjiMonsters.sort((a, b) => a.id - b.id)[0]!;
}

function clamp(lower: number, x: number, upper: number): number {
  return Math.min(upper, Math.max(lower, x));
}

const speed = 1;
