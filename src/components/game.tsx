import { screenWidth } from "~/utils/screen";
import { useKanjiMonsters } from "~/utils/kanji-monsters";
import { LevelMap } from "~/components/level-map";
import { useUpdateLoop } from "~/utils/update-loop";
import { Player } from "~/components/player";
import { usePlayer } from "~/utils/player";
import { KanjiMonster } from "~/components/kanji-monster";

export function Game() {
  const { position, setPosition, direction, setDirection } = usePlayer();
  const { kanjiMonsters, target, updateKanjiMonsters } = useKanjiMonsters();

  useUpdateLoop({
    direction,
    setDirection,
    setPosition,
    updateKanjiMonsters,
  });

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <LevelMap />

        <div
          className="relative bg-slate-800"
          style={{ width: screenWidth, height: screenWidth }}
        >
          <Player position={position} />

          {kanjiMonsters.map((kanjiMonster) => {
            return (
              <KanjiMonster key={kanjiMonster.id} kanjiMonster={kanjiMonster} />
            );
          })}
        </div>
      </div>

      <p className="w-full max-w-2xl text-center text-xl text-slate-300">
        {`Eat the kanji named "${target.meaning}"`}
      </p>
    </div>
  );
}
