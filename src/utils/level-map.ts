import { blockWidth } from "./constants";
import { type Position } from "./types";

export const levelMap = [
  "###############",
  "#      #      #",
  "# #### # #### #",
  "#             #",
  "## ## # # ## ##",
  "#             #",
  "# ### # # ### #",
  "#             #",
  "# #### # #### #",
  "#    #   #    #",
  "## # ## ## # ##",
  "#  #       #  #",
  "# #### # #### #",
  "#             #",
  "###############",
].map((row) => row.split(""));

export const levelMapWall = "#";

export const levelMapWalls = levelMap
  .flatMap((row, y) =>
    row.map((tile, x) => ({ x: blockWidth * x, y: blockWidth * y, tile })),
  )
  .filter(({ tile }) => tile === levelMapWall);

export const levelMapSpaces = levelMap
  .flatMap((row, y) =>
    row.map((tile, x) => ({ x: blockWidth * x, y: blockWidth * y, tile })),
  )
  .filter(({ tile }) => tile === " ");

export function getRandomSpace(): Position {
  const index = Math.floor(Math.random() * levelMapSpaces.length);
  return levelMapSpaces[index]!;
}
