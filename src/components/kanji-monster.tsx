import { blockWidth } from "~/utils/screen";
import { type Monster } from "~/utils/monsters";

export function KanjiMonster({ kanjiMonster }: { kanjiMonster: Monster }) {
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
