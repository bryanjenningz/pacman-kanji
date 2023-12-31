import { screenWidth } from "~/utils/screen";
import * as Monsters from "~/utils/monsters";
import { LevelMap } from "~/components/level-map";
import { useUpdateLoop } from "~/utils/update-loop";
import { Player } from "~/components/player";
import { usePlayer } from "~/utils/player";

export function Game() {
  const { position, setPosition, direction, setDirection } = usePlayer();
  const { monsters, target, updateMonsters } = Monsters.use();

  useUpdateLoop({
    direction,
    setDirection,
    setPosition,
    updateMonsters,
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

          <Monsters.View monsters={monsters} />
        </div>
      </div>

      <p className="w-full max-w-2xl text-center text-xl text-slate-300">
        {`Eat the kanji named "${target.meaning}"`}
      </p>
    </div>
  );
}
