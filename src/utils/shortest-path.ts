import { levelMapSpaces } from "~/utils/level-map";
import { type Position } from "~/utils/types";
import { blockWidth } from "~/utils/screen";

export function findShortestPath(from: Position, to: Position): Position[] {
  const visited = new Set<`x:${number},y:${number}`>();

  function search({ x, y }: Position, path: Position[]): Position[] | void {
    if (x === to.x && y === to.y) return path;
    if (visited.has(`x:${x},y:${y}`)) return;
    if (!levelMapSpaces.find((space) => space.x === x && space.y === y)) return;
    visited.add(`x:${x},y:${y}`);
    const neighbors = [
      [x + blockWidth, y],
      [x - blockWidth, y],
      [x, y + blockWidth],
      [x, y - blockWidth],
    ] as const;
    for (const [newX, newY] of neighbors) {
      path.push({ x: newX, y: newY });
      const shortestPath = search({ x: newX, y: newY }, path);
      if (shortestPath) return shortestPath;
      path.pop();
    }
  }

  return search(from, []) ?? [to];
}
