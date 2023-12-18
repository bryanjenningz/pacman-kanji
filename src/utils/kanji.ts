import { blockWidth } from "~/utils/constants";
import { type Position } from "~/utils/types";

export type KanjiValue = {
  kanji: string;
  meaning: string;
};

export type KanjiMonster = {
  id: number;
  kanjiValue: KanjiValue;
  position: Position;
  path: Position[];
};

export const kanjiValues: KanjiValue[] = [
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

export const initialKanjiMonsters: KanjiMonster[] = [
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
