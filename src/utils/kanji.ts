import { useCallback, useMemo, useState } from "react";
import { blockWidth } from "~/utils/constants";
import { type Position } from "~/utils/types";
import { isOverlapping } from "./is-overlapping";
import { getRandomSpace } from "./level-map";
import { findShortestPath } from "./shortest-path";

type KanjiValue = {
  kanji: string;
  meaning: string;
};

export type KanjiMonster = {
  id: number;
  kanjiValue: KanjiValue;
  position: Position;
  path: Position[];
};

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

const initialKanjiMonsters: KanjiMonster[] = [
  { x: blockWidth * 5, y: blockWidth * 3 },
  { x: blockWidth * 9, y: blockWidth * 3 },
  { x: blockWidth * 5, y: blockWidth * 7 },
  { x: blockWidth * 9, y: blockWidth * 7 },
].map((position, i) => ({
  id: i,
  kanjiValue: kanjiValues[i]!,
  position,
  path: [],
}));

export function useKanjiMonsters() {
  const [kanjiMonsters, setKanjiMonsters] = useState(initialKanjiMonsters);

  const target = useMemo(
    () => getTargetKanjiMonster(kanjiMonsters).kanjiValue,
    [kanjiMonsters],
  );

  const updateKanjiMonsters = useCallback((playerPosition: Position) => {
    setKanjiMonsters((kanjiMonsters) => {
      const targetKanji = getTargetKanjiMonster(kanjiMonsters).kanjiValue.kanji;

      return kanjiMonsters.map((kanjiMonster) => {
        if (
          kanjiMonster.kanjiValue.kanji === targetKanji &&
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

        const dx = clamp(-1, nextStep.x - kanjiMonster.position.x, 1);
        const dy = clamp(-1, nextStep.y - kanjiMonster.position.y, 1);
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

function updateKanjiMonster(kanjiMonster: KanjiMonster): KanjiMonster {
  const kanjiIndex = kanjiValues.findIndex(
    (x) => x.kanji === kanjiMonster.kanjiValue.kanji,
  );
  const newKanjiIndex =
    (kanjiIndex + initialKanjiMonsters.length) % kanjiValues.length;
  const newKanjiValue = kanjiValues[newKanjiIndex]!;
  return {
    ...kanjiMonster,
    id: kanjiMonster.id + initialKanjiMonsters.length,
    kanjiValue: newKanjiValue,
  };
}

function getTargetKanjiMonster(kanjiMonsters: KanjiMonster[]): KanjiMonster {
  return kanjiMonsters.sort((a, b) => a.id - b.id)[0]!;
}

function clamp(lower: number, x: number, upper: number): number {
  return Math.min(upper, Math.max(lower, x));
}
