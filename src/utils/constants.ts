import { type Direction, type Position } from "~/utils/types";

export const initialDirection: Direction = "LEFT";
export const blockWidth = 20;
export const screenWidth = 300;
export const speed = 2;
export const initialPosition: Position = {
  x: blockWidth * 7,
  y: blockWidth * 11,
};
