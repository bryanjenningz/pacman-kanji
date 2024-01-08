export type Kanji = {
  character: string;
  meaning: string;
};

export const initKanji: Kanji[] = [
  { character: "一", meaning: "one" },
  { character: "二", meaning: "two" },
  { character: "三", meaning: "three" },
  { character: "四", meaning: "four" },
  { character: "五", meaning: "five" },
  { character: "六", meaning: "six" },
  { character: "七", meaning: "seven" },
  { character: "八", meaning: "eight" },
  { character: "九", meaning: "nine" },
  { character: "十", meaning: "ten" },
] as const satisfies Kanji[];

export async function fetchKanji(): Promise<string> {
  const response = await fetch("/heisig-kanji.txt");
  const text = await response.text();
  return text;
}

export function parseKanji(kanjiText: string) {
  return kanjiText
    .split("\n")
    .map((line) => {
      const [character, meaning] = line.split("\t");

      if (character && meaning) {
        return { character: character, meaning: meaning };
      }

      return null;
    })
    .filter(Boolean);
}
