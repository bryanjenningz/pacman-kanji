import { blockWidth } from "~/utils/screen";
import { type Position } from "~/utils/types";

export function Player({ position }: { position: Position }) {
  return (
    <div
      className="absolute z-10 bg-blue-500"
      style={{
        width: blockWidth,
        height: blockWidth,
        left: position.x,
        top: position.y,
      }}
    ></div>
  );
}
