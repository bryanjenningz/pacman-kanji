import { memo } from "react";
import { blockWidth, screenWidth } from "../utils/constants";
import { levelMap, levelMapWall } from "../utils/level-map";

export const LevelMap = memo(() => {
  return (
    <div
      className="absolute"
      style={{ width: screenWidth, height: screenWidth }}
    >
      {levelMap.map((row, y) => {
        return (
          <div key={y}>
            {row.map((char, x) => {
              const isWall = char === levelMapWall;
              return (
                <div
                  key={x}
                  style={{
                    width: blockWidth,
                    height: blockWidth,
                    left: x * blockWidth,
                    top: y * blockWidth,
                  }}
                  className={isWall ? "absolute z-10 bg-blue-900" : "hidden"}
                ></div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
});
