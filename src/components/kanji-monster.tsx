import { blockWidth } from "~/utils/screen";
import { type KanjiMonster } from "~/utils/monsters";

export function KanjiMonster({ kanjiMonster }: { kanjiMonster: KanjiMonster }) {
  return (
    <div
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
}
